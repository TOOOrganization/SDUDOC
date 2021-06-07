// ================================================================================
// * Dot2D <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Dot2D
// --------------------------------------------------------------------------------
function Dot2D() {
  this.initialize.apply(this, arguments);
}
Dot2D.prototype = Object.create(Element.prototype);
Dot2D.prototype.constructor = Dot2D;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Dot2D.TAG = 'Dot2D';
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
Dot2D.Type = {
  FREE: 0, DEPENDENT: 1, INTERSECTION: 2
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Dot2D.prototype._type = Dot2D.Type.FREE;
// --------------------------------------------------------------------------------
Dot2D.prototype._x = 0;
Dot2D.prototype._y = 0;
// --------------------------------------------------------------------------------
Dot2D.prototype._father = '';
Dot2D.prototype._position = 0;
// --------------------------------------------------------------------------------
Dot2D.prototype._father1 = '';
Dot2D.prototype._father2 = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Dot2D.prototype.initialize = function(id, pages, type, arg1, arg2){
  Element.prototype.initialize.call(this, id, pages);

  this._type = type;
  switch (this._type) {
    case Dot2D.Type.FREE: default:
      this._x = arg1;
      this._y = arg2;
      break;
    case Dot2D.Type.DEPENDENT:
      this._father = arg1;
      this._position = arg2;
      break;
    case Dot2D.Type.INTERSECTION:
      this._father1 = arg1;
      this._father2 = arg2;
      break;
  }
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Dot2D.prototype, 'type', {
  get: function() {
    return this._type;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'x', {
  get: function() {
    return this.getPoint().x;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'y', {
  get: function() {
    return this.getPoint().y;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'father', {
  get: function() {
    return this._father;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'position', {
  get: function() {
    return this._position;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'father1', {
  get: function() {
    return this._father1;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'father2', {
  get: function() {
    return this._father2;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Dot2D.prototype.move = function(point){
  switch (this._type){
    case Dot2D.Type.FREE:
      this._x += point.x;
      this._y += point.y;
      break;
    case Dot2D.Type.DEPENDENT:
      let line = ElementManager.getElement(Line2D.TAG, this._father).getLine();
      let dependent = line.getDependent(point);
      this._position = Math.max(0, Math.min(1, dependent))
      break;
  }
};
// --------------------------------------------------------------------------------
// * Get Base Object
// --------------------------------------------------------------------------------
Dot2D.prototype.getPoint = function(){
  switch (this._type) {
    case Dot2D.Type.FREE: default:
      return new Point(this._x, this._y);
    case Dot2D.Type.DEPENDENT:
      let line = ElementManager.getElement(Line2D.TAG, this._father).getLine();
      return line.getDependentPoint(this._position);
    case Dot2D.Type.INTERSECTION:
      let line1 = ElementManager.getElement(Line2D.TAG, this._father1).getLine();
      let line2 = ElementManager.getElement(Line2D.TAG, this._father2).getLine();
      return line1.getIntersectionPoint(line2);
  }
}
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Dot2D.prototype.newElement = function(){
  return new Dot2D('', [], Dot2D.Type.FREE, 0, 0);
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Dot2D.prototype.onAwake = function(){

};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Dot2D.prototype.onUpdate = function(){

};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Dot2D.prototype.onRemove = function(){
  let lines = ElementManager.getFilteredElements(Line2D.TAG);
  for(let id in lines){
    if(lines[id].start === this._id || lines[id].end === this._id){
      DocumentManager.removeElement(Line2D.TAG, id);
    }
  }
  let polygons = ElementManager.getFilteredElements(Polygon2D.TAG);
  for(let id in polygons){
    if(polygons[id].points.indexOf(this._id) >= 0){
      DocumentManager.removeElement(Polygon2D.TAG, id);
    }
  }
};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Dot2D.prototype.checkCollide = function(point){
  let distance = Graphics.getRenderPoint(this.getPoint()).distance(point);
  let radius = 5;
  return distance <= radius + 2 ? distance : -1;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Dot2D.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._type     = json_object._type     === undefined ? this._type     : json_object._type;
  this._x        = json_object._x        === undefined ? this._x        : json_object._x;
  this._y        = json_object._y        === undefined ? this._y        : json_object._y;
  this._father   = json_object._father   === undefined ? this._father   : json_object._father;
  this._position = json_object._position === undefined ? this._position : json_object._position;
  this._father1  = json_object._father1  === undefined ? this._father1  : json_object._father1;
  this._father2  = json_object._father2  === undefined ? this._father2  : json_object._father2;
};
Dot2D.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._type     = this._type;
  output._x        = this._x;
  output._y        = this._y;
  output._father   = this._father;
  output._position = this._position;
  output._father1  = this._father1;
  output._father2  = this._father2;
  return output;
};
Dot2D.prototype.exportJson = function(){
  return null;
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionary({
  type: Language.Type.Todo, id: 'plugin-dot', dictionary:[
    { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增点】左键单击，【删除点】右键单击一个点。'] }
  ]
});
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('dot', '点工具', 'mdi-circle-medium', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-dot');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('dot.onMouseLeftClick', 'left_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;

    let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
    if(collide_list.length > 0) {
      SelectManager.select(Dot2D.TAG, collide_list[0]);
      Graphics.refresh();
      return;
    }

    SelectManager.unSelect();

    collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
    if(collide_list.length === 2){
      let dot_object = ElementManager.makeElement(Dot2D.TAG, [DocumentManager.getCurrentPageId()],
        Dot2D.Type.INTERSECTION, collide_list[0], collide_list[1]);
      DocumentManager.addElementWithUpdate(Dot2D.TAG, dot_object);
    }else if(collide_list.length === 1){
      let line = ElementManager.getElement(Line2D.TAG, collide_list[0]).getLine();
      let mouse_point = Graphics.getSourcePoint(new Point(event.layerX, event.layerY));
      let dependent = line.getDependent(mouse_point);
      let dot_object = ElementManager.makeElement(Dot2D.TAG, [DocumentManager.getCurrentPageId()],
        Dot2D.Type.DEPENDENT, collide_list[0], dependent);
      DocumentManager.addElementWithUpdate(Dot2D.TAG, dot_object);
    }else{
      let mouse_point = Graphics.getSourcePoint(new Point(event.layerX, event.layerY));
      let dot_object = ElementManager.makeElement(Dot2D.TAG, [DocumentManager.getCurrentPageId()],
        Dot2D.Type.FREE, mouse_point.x, mouse_point.y);
      DocumentManager.addElementWithUpdate(Dot2D.TAG, dot_object);
    }
  })
);
ToolManager.addHandler(new Handler('dot.onMouseRightClick', 'right_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
    if(collide_list.length === 0) {
      SelectManager.unSelect();
      Graphics.refresh();
      return;
    }
    DocumentManager.removeElementWithUpdate(Dot2D.TAG, collide_list[0]);
  })
);
ToolManager.addHandler(new Handler('dot.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('dot.onMouseOut', 'mouseout', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
Graphics.renderPointNormal = function(point){
  let fill_color = ColorManager.RGBToHex(0, 0, 255);
  let line_color = ColorManager.RGBToHex(255, 255, 255);
  this.drawPoint(point, 2.5, fill_color, 1, 1, line_color, 1);
};
Graphics.renderPointCollide = function(point){
  let fill_color = ColorManager.RGBToHex(255, 0, 0);
  let line_color = ColorManager.RGBToHex(255, 255, 255);
  this.drawPoint(point, 4, fill_color, 1, 2, line_color, 1);
};
Graphics.renderPointVirtual = function(point){
  let fill_color = ColorManager.RGBToHex(0, 0, 255);
  let line_color = ColorManager.RGBToHex(255, 255, 255);
  this.drawPoint(point, 4, fill_color, 0.5, 2, line_color, 0.5);
};
// --------------------------------------------------------------------------------
Graphics.renderPointNormalList = function(point_list){
  let fill_color = ColorManager.RGBToHex(0, 0, 255);
  let line_color = ColorManager.RGBToHex(255, 255, 255);
  this.drawPointList(point_list, 2.5, fill_color, 1, 1, line_color, 1);
};
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('dot.dot.all', '', 50, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  let dots = ElementManager.getFilteredElements(Dot2D.TAG);
  let render_dots = [];
  for(let id in dots){
    if(collide_list.indexOf(id) === -1){
      render_dots.push(Graphics.getRenderPoint(dots[id].getPoint()));
    }
  }
  Graphics.renderPointNormalList(render_dots);
  if(collide_list.length > 0){
    Graphics.renderPointCollide(Graphics.getRenderPoint(dots[collide_list[0]].getPoint()));
  }
}));
RenderManager.addRenderer(new Renderer('!dot.dot.all', '', 50, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let dots = ElementManager.getFilteredElements(Dot2D.TAG);
  let render_dots = [];
  for(let id in dots){
    render_dots.push(Graphics.getRenderPoint(dots[id].getPoint()));
  }
  Graphics.renderPointNormalList(render_dots);
}));
RenderManager.addRenderer(new Renderer('dot.line.collide', '', 41, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  if(collide_list.length > 0){
    for(let i = 0; i < collide_list.length; i++){
      let line_object = ElementManager.getElement(Line2D.TAG, collide_list[i]);
      Graphics.renderLineCollide(Graphics.getRenderLine(line_object.getLine()));
    }
  }
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('dot.dot.mouse', '', 100, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0) return;

  collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  if(collide_list.length === 2){
    let line1 = ElementManager.getElement(Line2D.TAG, collide_list[0]).getLine();
    let line2 = ElementManager.getElement(Line2D.TAG, collide_list[1]).getLine();
    let intersection_point = line1.getIntersectionPoint(line2);
    Graphics.renderPointVirtual(Graphics.getRenderPoint(intersection_point));
  }else if(collide_list.length === 1){
    let mouse_point = Graphics.getMouseSourcePoint();
    if(mouse_point !== null){
      let line = ElementManager.getElement(Line2D.TAG, collide_list[0]).getLine();
      let projection_point = line.getProjectionPoint(mouse_point);
      Graphics.renderPointVirtual(Graphics.getRenderPoint(projection_point));
    }
  }else{
    let mouse_point = MouseInput.getMousePoint();
    if(mouse_point !== null){
      Graphics.renderPointVirtual(mouse_point);
    }
  }
}));
// ================================================================================
