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
Dot2D.prototype.getObject = function(){
  return new Dot2D("", Dot2D.Type.FREE, "", 0, 0);
};
// --------------------------------------------------------------------------------
Dot2D.prototype.getRealPoint = function(){
  switch (this._type) {
    case Dot2D.Type.FREE: default:
      return this;
    case Dot2D.Type.DEPENDENT:
      let line = SDUDocument.data["Line2D"][this._father];
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
  for(let i in SDUDocument.data["Line2D"]){
    if(SDUDocument.data["Line2D"][i].start === this._id || SDUDocument.data["Line2D"][i].end === this._id){
      SDUDocument.deleteElement("Line2D", i);
    }
  }
  for(let i in SDUDocument.data["Polygon2D"]){
    for(let j in SDUDocument.data["Polygon2D"][i].points){
      if(SDUDocument.data["Polygon2D"][i].points[j] === this._id){
        SDUDocument.deleteElement("Polygon2D", i);
        break;
      }
    }
  }
};
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
  return DocumentManager.getNextIndex("Dot2D");
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
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  if(collide_list.length > 0) return;

  collide_list = CollideManager.getCollideList("Line2D", 2);
  if(collide_list.length === 2){
    DocumentManager.addElement("Dot2D", DotFactory.makeObject(DocumentManager.getCurrentPageId(),
      Dot2D.Type.INTERSECTION, collide_list[0], collide_list[1]));
  }else if(collide_list.length === 1){
    let dependent = LineFactory.getDependent(collide_list[0], new Point(event.layerX, event.layerY));
    DocumentManager.addElement("Dot2D", DotFactory.makeObject(DocumentManager.getCurrentPageId(),
      Dot2D.Type.DEPENDENT, collide_list[0], dependent));
  }else{
    let point = Graphics.getGridPoint(new Point(event.layerX, event.layerY));
    DocumentManager.addElement("Dot2D", DotFactory.makeObject(DocumentManager.getCurrentPageId(),
      Dot2D.Type.FREE, point.x, point.y));
  }
}));
ToolManager.addHandler(new Handler("dot.onRightClick", "right_click", false, DotFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  if(collide_list.length === 0) return;
  DocumentManager.deleteElement("Dot2D", collide_list[0]);
}));
ToolManager.addHandler(new Handler("dot.onMouseMove", "mousemove", false, DotFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("dot.onMouseOut", "mouseout", false, DotFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("_dot.normal", 10, DotFactory, function(ctx){
  if(SDUDocument.getCurrentPage() <= 0) return;
  let current_page = DocumentManager.getCurrentPageId();
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  for(let i in SDUDocument.data["Dot2D"]){
    if(collide_list.indexOf(i) === -1 && SDUDocument.data["Dot2D"][i].page === current_page){
      SDUDocument.data["Dot2D"][i].render(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("!dot.collide", 11, DotFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  for(let i in SDUDocument.data["Dot2D"]){
    if(collide_list.indexOf(i) !== -1){
      SDUDocument.data["Dot2D"][i].render(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("dot.collide", 11, DotFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  for(let i in SDUDocument.data["Dot2D"]){
    if(collide_list.indexOf(i) !== -1){
      SDUDocument.data["Dot2D"][i].renderCollide(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("dot.line.collide", 9, DotFactory, function(ctx){
  if(SDUDocument.getCurrentPage() <= 0) return;
  let current_page = DocumentManager.getCurrentPageId();
  let collide_list = CollideManager.getCollideList("Line2D", 2);
  for(let i in SDUDocument.data["Line2D"]){
    if(collide_list.indexOf(i) !== -1 && SDUDocument.data["Line2D"][i].page === current_page){
      SDUDocument.data["Line2D"][i].renderCollide(ctx);
    }
  }
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("dot.mouse", 100, DotFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  if(collide_list.length > 0) return;

  collide_list = CollideManager.getCollideList("Line2D", 2);
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
