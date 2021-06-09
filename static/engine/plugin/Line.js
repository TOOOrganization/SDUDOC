// ================================================================================
// * Line2D <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/17 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Line2D
// ================================================================================
function Line2D(){
  this.initialize.apply(this, arguments);
}
Line2D.prototype = Object.create(Element.prototype);
Line2D.prototype.constructor = Line2D;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Line2D.TAG = 'Line2D';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Line2D.prototype._start = '';
Line2D.prototype._end = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Line2D.prototype.initialize = function(id, pages, start, end){
  Element.prototype.initialize.call(this, id, pages);

  this._start = start;
  this._end = end;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Line2D.prototype, 'start', {
  get: function() {
    return this._start;
  },
  configurable: true
});
Object.defineProperty(Line2D.prototype, 'end', {
  get: function() {
    return this._end;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Get Base Object
// --------------------------------------------------------------------------------
Line2D.prototype.getLine = function(){
  let start = ElementManager.getElement(Dot2D.TAG, this._start).getPoint();
  let end = ElementManager.getElement(Dot2D.TAG, this._end).getPoint();
  return new Line(start, end);
}
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Line2D.prototype.newElement = function(){
  return new Line2D('', [], '', '');
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Line2D.prototype.onAwake = function(){

};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Line2D.prototype.onUpdate = function(){

};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Line2D.prototype.onRemove = function(){
  let dots = ElementManager.getFilteredElements(Dot2D.TAG);
  for(let id in dots){
    if(dots[id].father === this._id || dots[id].father1 === this._id || dots[id].father2 === this._id){
      DocumentManager.removeElement(Dot2D.TAG, id);
    }
  }
};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Line2D.prototype.checkCollide = function(point){
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0) return -1;
  let line = Graphics.getRenderLine(this.getLine());
  let start = line.start;
  let end = line.end;
  let radius = 3;
  if(Math.abs(start.x - end.x) < 0.01){
    if((start.y < end.y && (start.y < point.y && point.y < end.y)) ||
      (start.y > end.y && (start.y > point.y && point.y > end.y))){
      let distance = Math.abs(point.x - start.x)
      return distance <= radius + 2 ? distance : -1;
    }
  }else if(Math.abs(start.y - end.y) < 0.01){
    if((start.x < end.x && (start.x < point.x && point.x < end.x)) ||
      (start.x > end.x && (start.x > point.x && point.x > end.x))){
      let distance = Math.abs(point.y - start.y)
      return distance <= radius + 2 ? distance : -1;
    }
  }else{
    let k1 = (end.y - start.y)/(end.x - start.x);
    let k2 = -1 / k1;
    let x = (k2 * point.x - point.y + end.y - k1 * end.x) / (k2 - k1);
    let y = k2 * (x - point.x) + point.y;
    if((start.x < end.x && (start.x < x && x < end.x)) || (start.x > end.x && (start.x > x && x > end.x))){
      if((start.y < end.y && (start.y < y && y < end.y)) || (start.y > end.y && (start.y > y && y > end.y))){
        let distance = point.distance(new Point(x, y));
        return distance <= radius + 2 ? distance : -1;
      }
    }
  }
  let distance = Math.min(point.distance(start), point.distance(end));
  return distance <= radius + 2 ? distance : -1;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Line2D.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._start = json_object._start === undefined ? this._start : json_object._start;
  this._end   = json_object._end   === undefined ? this._end   : json_object._end;
};
Line2D.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._start = this._start;
  output._end   = this._end;
  return output;
};
Line2D.prototype.exportJson = function(){
  return null;
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Todo, id: 'plugin-todo-line', dictionary:[
      { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增线】依次点击两个点。【取消新增线】点击第二个点前，右键单击。【移除线】右键单击一条线。'] },
      { id: 'zh-tw', text: ['【移動】按下中鍵+拖動。【縮放】滾動鼠標中鍵。【新增線】依次點擊兩個點。【取消新增線】點擊第二個點前，右鍵單擊。【移除線】右鍵單擊一條線。'] },
      { id: 'en-us', text: ['[Move]: Press & Drag. [Scale]: Mousewheel.'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'plugin-tooltip-line', dictionary:[
      { id: 'zh-cn', text: ['直线工具'] },
      { id: 'zh-tw', text: ['直線工具'] },
      { id: 'en-us', text: ['Line2D Tool'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('line', 'plugin-tooltip-line', 'mdi-ray-start-end', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-todo-line');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('line.onMouseLeftClick', 'left_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
    if(collide_list.length === 0){
      collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
      let dot_object = null;
      if(collide_list.length === 2){
        dot_object = ElementManager.makeElement(Dot2D.TAG, [DocumentManager.getCurrentPageId()],
          Dot2D.Type.INTERSECTION, collide_list[0], collide_list[1]);
      }else if(collide_list.length === 1){
        let line = ElementManager.getElement(Line2D.TAG, collide_list[0]).getLine();
        let mouse_point = Graphics.getSourcePoint(new Point(event.layerX, event.layerY));
        let dependent = line.getDependent(mouse_point);
        dot_object = ElementManager.makeElement(Dot2D.TAG, [DocumentManager.getCurrentPageId()],
          Dot2D.Type.DEPENDENT, collide_list[0], dependent);
      }else{
        let mouse_point = Graphics.getSourcePoint(new Point(event.layerX, event.layerY));
        dot_object = ElementManager.makeElement(Dot2D.TAG, [DocumentManager.getCurrentPageId()],
          Dot2D.Type.FREE, mouse_point.x, mouse_point.y);
      }
      DocumentManager.addElement(Dot2D.TAG, dot_object);
      if(SelectManager.isSelectedType(Dot2D.TAG)) {
        let line_object = ElementManager.makeElement(Line2D.TAG, [DocumentManager.getCurrentPageId()],
          SelectManager.getSelectedId(), dot_object.id);
        DocumentManager.addElement(Line2D.TAG, line_object);
      }
      SelectManager.selectObject(dot_object);
      DocumentManager.afterChangeElement();
    }else{
      if(SelectManager.isSelectedType(Dot2D.TAG)){
        let line_object = ElementManager.makeElement(Line2D.TAG, [DocumentManager.getCurrentPageId()],
          SelectManager.getSelectedId(), collide_list[0]);
        DocumentManager.addElementWithUpdate(Line2D.TAG, line_object);
      }
      SelectManager.select(Dot2D.TAG, collide_list[0]);
      Graphics.update();
    }
  })
);
ToolManager.addHandler(new Handler('line.onMouseRightClick', 'right_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;

    if(SelectManager.isSelectedType(Dot2D.TAG)){
      SelectManager.unSelect();
      Graphics.refresh();
      return;
    }
    let collide_list = CollideManager.getCollideList(Line2D.TAG, 1);
    if(collide_list.length === 0) {
      Graphics.refresh();
      return;
    }
    DocumentManager.removeElementWithUpdate(Line2D.TAG, collide_list[0]);
  })
);
ToolManager.addHandler(new Handler('line.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('line.onMouseOut', 'mouseout', false, Engine,
  function(event){
    SelectManager.unSelect();
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
Graphics.renderLineNormal = function(line){
  let fill_color = ColorManager.RGBToHex(0, 0, 255);
  let line_color = ColorManager.RGBToHex(255, 255, 255);
  this.drawPolygon(line.getRenderPolygon(1), fill_color, 1, 0.5, line_color, 1);
};
Graphics.renderLineCollide = function(line){
  let fill_color = ColorManager.RGBToHex(255, 0, 0);
  let line_color = ColorManager.RGBToHex(255, 255, 255);
  this.drawPolygon(line.getRenderPolygon(2.5), fill_color, 1, 1, line_color, 1);
};
Graphics.renderLineVirtual = function(line){
  let fill_color = ColorManager.RGBToHex(0, 0, 255);
  let line_color = ColorManager.RGBToHex(255, 255, 255);
  this.drawPolygon(line.getRenderPolygon(2.5), fill_color, 0.5, 1, line_color, 0.5);
};
// --------------------------------------------------------------------------------
Graphics.renderLineNormalList = function(line_list){
  let fill_color = ColorManager.RGBToHex(0, 0, 255);
  let line_color = ColorManager.RGBToHex(255, 255, 255);
  for(let i = 0; i < line_list.length; i++){
    line_list[i] = line_list[i].getRenderPolygon(1);
  }
  this.drawPolygonList(line_list, fill_color, 1, 0.5, line_color, 1);
};
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('line.line.all', '', 40, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  let lines = ElementManager.getFilteredElements(Line2D.TAG);
  let render_lines = [];
  for(let id in lines){
    if(collide_list.indexOf(id) === -1){
      render_lines.push(Graphics.getRenderLine(lines[id].getLine()));
    }
  }
  Graphics.renderLineNormalList(render_lines);
  if(collide_list.length > 0){
    for(let i = 0; i < collide_list.length; i++){
      Graphics.renderLineCollide(Graphics.getRenderLine(lines[collide_list[i]].getLine()));
    }
  }
}));
RenderManager.addRenderer(new Renderer('!line.line.all', '', 40, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let lines = ElementManager.getFilteredElements(Line2D.TAG);
  let render_lines = [];
  for(let id in lines){
    render_lines.push(Graphics.getRenderLine(lines[id].getLine()));
  }
  Graphics.renderLineNormalList(render_lines);
}));
RenderManager.addRenderer(new Renderer('line.dot.collide', '', 51, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0){
    let dot_object = ElementManager.getElement(Dot2D.TAG, collide_list[0]);
    Graphics.renderPointCollide(Graphics.getRenderPoint(dot_object.getPoint()));
  }
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('line.line.mouse', '', 49, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0) {
    if(SelectManager.isSelectedType(Dot2D.TAG)){
      let dot_object = ElementManager.getElement(Dot2D.TAG, collide_list[0]);
      let line = new Line(SelectManager.getSelectedObject().getPoint(), dot_object.getPoint());
      Graphics.renderLineVirtual(Graphics.getRenderLine(line));
    }
  }else{
    let line = null;
    let mouse_point = Graphics.getMouseSourcePoint();
    if(!mouse_point) return;
    if(!SelectManager.isSelectedType(Dot2D.TAG)) return;
    let start_point = SelectManager.getSelectedObject().getPoint();

    collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
    if(collide_list.length === 2){
      let line1 = ElementManager.getElement(Line2D.TAG, collide_list[0]).getLine();
      let line2 = ElementManager.getElement(Line2D.TAG, collide_list[1]).getLine();
      let intersection_point = line1.getIntersectionPoint(line2);
      line = new Line(start_point, intersection_point);
    }else if(collide_list.length === 1){
      let line1 = ElementManager.getElement(Line2D.TAG, collide_list[0]).getLine();
      let projection_point = line1.getProjectionPoint(mouse_point);
      line = new Line(start_point, projection_point);
    }else{
      line = new Line(start_point, mouse_point);
    }
    if(line !== null){
      Graphics.renderLineVirtual(Graphics.getRenderLine(line));
    }
  }
}));
RenderManager.addRenderer(new Renderer('line.dot.mouse', '', 100, function(ctx){
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
