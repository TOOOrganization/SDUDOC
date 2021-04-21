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
//   2020/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Dot2D
// --------------------------------------------------------------------------------
function Dot2D() {
  this.initialize.apply(this, arguments);
}
Dot2D.prototype = Object.create(Point.prototype);
Dot2D.prototype.constructor = Dot2D;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Dot2D.TAG = "Dot2D";
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
Dot2D.Type = {
  FREE: 0, DEPENDENT: 1, INTERSECTION: 2
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Dot2D.prototype._id = '';
Dot2D.prototype._page = '';
Dot2D.prototype._type = Dot2D.Type.FREE;
// --------------------------------------------------------------------------------
Dot2D.prototype._radius = 0;
Dot2D.prototype._stroke_width = 0;
Dot2D.prototype._color = '';
Dot2D.prototype._collide_color = '';
Dot2D.prototype._stroke_color = '';
// --------------------------------------------------------------------------------
Dot2D.prototype._father = '';
Dot2D.prototype._position = 0;
// --------------------------------------------------------------------------------
Dot2D.prototype._father1 = '';
Dot2D.prototype._father2 = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Dot2D.prototype.initialize = function(id, page, type, arg1, arg2){
  Point.prototype.initialize.call(this, 0, 0);

  this._radius = 5;
  this._stroke_width = 2;
  this._color = 'rgba(255, 255, 255, 1)';
  this._collide_color = 'rgba(255, 0, 0, 1)';
  this._stroke_color = 'rgba(0, 0, 255, 1)';

  this._id = id;
  this._page = page;
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
Object.defineProperty(Dot2D.prototype, 'x', {
  get: function() {
    return this.getRealPoint()._x;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'y', {
  get: function() {
    return this.getRealPoint()._y;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'page', {
  get: function() {
    return this._page;
  },
  configurable: true
});
Object.defineProperty(Dot2D.prototype, 'type', {
  get: function() {
    return this._type;
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
Dot2D.prototype.setColor = function(color, collide_color, stroke_color){
  this._color = color;
  this._collide_color = collide_color;
  this._stroke_color = stroke_color;
};
Dot2D.prototype.setSize = function(radius, stroke_width){
  this._radius = radius;
  this._stroke_width = stroke_width;
};
// --------------------------------------------------------------------------------
Dot2D.prototype.move = function(point){
  switch (this._type){
    case Dot2D.Type.FREE:
      this._x += point.x;
      this._y += point.y;
      break;
    case Dot2D.Type.DEPENDENT:
      let dependent = LineFactory.getDependent(this._father, point);
      this._position = Math.max(0, Math.min(1, dependent))
      break;
  }
};
// --------------------------------------------------------------------------------
Dot2D.prototype.getObject = function(){
  return new Dot2D("", Dot2D.Type.FREE, "", 0, 0);
};
// --------------------------------------------------------------------------------
Dot2D.prototype.getRealPoint = function(){
  switch (this._type) {
    case Dot2D.Type.FREE: default:
      return this;
    case Dot2D.Type.DEPENDENT:
      let line = SDUDocument.getElement(Line2D.TAG, this._father);
      return LineFactory.getDependentPoint(line, this._position);
    case Dot2D.Type.INTERSECTION:
      return Graphics.getGridPoint(LineFactory.getIntersection(this._father1, this._father2));
  }
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Dot2D.prototype.checkCollide = function(point){
  let distance = Graphics.getRenderPoint(this).distance(point);
  return distance <= this._radius + 2 ? distance : -1;
};
// --------------------------------------------------------------------------------
Dot2D.prototype.render = function(ctx){
  Point.prototype.fillCanvas.call(this, ctx, this._radius - 2, this._color);
  Point.prototype.strokeCanvas.call(this, ctx, this._radius - 2, this._stroke_width / 2, this._stroke_color);
};
Dot2D.prototype.renderCollide = function(ctx){
  Point.prototype.fillCanvas.call(this, ctx, this._radius, this._color);
  Point.prototype.strokeCanvas.call(this, ctx, this._radius, this._stroke_width, this._collide_color);
};
// --------------------------------------------------------------------------------
Dot2D.prototype.onDelete = function(){
  let lines = SDUDocument.getCurrentPageElements(Line2D.TAG);
  for(let i in lines){
    if(lines[i].start === this._id || lines[i].end === this._id){
      if(SDUDocument.getElement(Line2D.TAG, i)) {
        SDUDocument.deleteElement(Line2D.TAG, i);
      }
    }
  }

  let polygons = SDUDocument.getCurrentPageElements(Polygon2D.TAG);
  for(let i in polygons){
    for(let j in polygons[i].points){
      if(polygons[i].points[j] === this._id){
        if(SDUDocument.getElement(Polygon2D.TAG, i)) {
          SDUDocument.deleteElement(Polygon2D.TAG, i);
        }
        break;
      }
    }
  }
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Dot2D.prototype.loadJson = function(json){
  this._id = json._id;
  this._page = json._page;
  this._type = json._type;
  this._x = json._x;
  this._y = json._y;
  this._father = json._father;
  this._position = json._position;
  this._father1 = json._father1;
  this._father2 = json._father2;
}
Dot2D.prototype.saveJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _type: this._type,
    _x: this._x,
    _y: this._y,
    _father: this._father,
    _position: this._position,
    _father1: this._father1,
    _father2: this._father2,
  }
}
// ================================================================================

// ================================================================================
// * DotFactory
// ================================================================================
function DotFactory(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
DotFactory.makeObject = function(page, type, arg1, arg2){
  return new Dot2D(this.getNextIndex(), page, type, arg1, arg2);
};
DotFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Dot2D.TAG);
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// ================================================================================
ToolManager.addTool(new Tool("dot", "点工具", "mdi-circle-medium", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("dot.onLeftClick", "left_click", false, DotFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0) return;

  collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  if(collide_list.length === 2){
    DocumentManager.addElement(Dot2D.TAG, DotFactory.makeObject(DocumentManager.getCurrentPageId(),
      Dot2D.Type.INTERSECTION, collide_list[0], collide_list[1]));
  }else if(collide_list.length === 1){
    let dependent = LineFactory.getDependent(collide_list[0], new Point(event.layerX, event.layerY));
    DocumentManager.addElement(Dot2D.TAG, DotFactory.makeObject(DocumentManager.getCurrentPageId(),
      Dot2D.Type.DEPENDENT, collide_list[0], dependent));
  }else{
    let point = Graphics.getGridPoint(new Point(event.layerX, event.layerY));
    DocumentManager.addElement(Dot2D.TAG, DotFactory.makeObject(DocumentManager.getCurrentPageId(),
      Dot2D.Type.FREE, point.x, point.y));
  }
}));
ToolManager.addHandler(new Handler("dot.onRightClick", "right_click", false, DotFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length === 0) return;
  DocumentManager.deleteElement(Dot2D.TAG, collide_list[0]);
}));
ToolManager.addHandler(new Handler("dot.onMouseMove", "mousemove", false, DotFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("dot.onMouseOut", "mouseout", false, DotFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("_dot.normal", 10, DotFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  let dots = SDUDocument.getCurrentPageElements(Dot2D.TAG);
  for(let i in dots){
    if(collide_list.indexOf(i) === -1){
      dots[i].render(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("!dot.collide", 11, DotFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Dot2D.TAG, collide_list[0]).render(ctx);
  }
}));
RenderManager.addRenderer(new Renderer("dot.collide", 11, DotFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Dot2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
RenderManager.addRenderer(new Renderer("dot.line.collide", 9, DotFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  if(collide_list.length > 0){
    for(let i = 0; i < collide_list.length; i++){
      SDUDocument.getCurrentPageElement(Line2D.TAG, collide_list[i]).renderCollide(ctx);
    }
  }
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("dot.mouse", 100, DotFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0) return;

  collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  if(collide_list.length === 2){
    let point = LineFactory.getIntersection(collide_list[0], collide_list[1]);
    point.fillSelf(ctx, 3, 'rgba(255, 255, 255, 0.5)');
    point.strokeSelf(ctx, 5, 2, 'rgba(0, 0, 255, 0.5)');
  }else if(collide_list.length === 1){
    let mouse_point = MouseInput.getMousePoint();
    if(mouse_point !== null){
      let point = LineFactory.getProjection(collide_list[0], mouse_point);
      point.fillSelf(ctx, 3, 'rgba(255, 255, 255, 0.5)');
      point.strokeSelf(ctx, 5, 2, 'rgba(0, 0, 255, 0.5)');
    }
  }else{
    let mouse_point = MouseInput.getMousePoint();
    if(mouse_point !== null){
      mouse_point.fillSelf(ctx, 3, 'rgba(255, 255, 255, 0.5)');
      mouse_point.strokeSelf(ctx, 5, 2, 'rgba(0, 0, 255, 0.5)');
    }
  }
}));
// ================================================================================
