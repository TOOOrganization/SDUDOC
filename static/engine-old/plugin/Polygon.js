// ================================================================================
// * Polygon <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/19 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Polygon2D
// --------------------------------------------------------------------------------
function Polygon2D(){
  this.initialize.apply(this, arguments);
}
Polygon2D.prototype = Object.create(Polygon.prototype);
Polygon2D.prototype.constructor = Polygon2D;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Polygon2D.TAG = "Polygon2D";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Polygon2D.prototype._id = "";
Polygon2D.prototype._page = "";
// --------------------------------------------------------------------------------
Polygon2D.prototype._color = '';
Polygon2D.prototype._collide_color = '';
// --------------------------------------------------------------------------------
Polygon2D.prototype._character = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Polygon2D.prototype.initialize = function(id, page, points){
  Polygon.prototype.initialize.call(this, points);

  this._color = 'rgba(0, 0, 255, 0.3)';
  this._collide_color = 'rgba(255, 0, 0, 0.3)';

  this._id = id;
  this._page = page;

  this._character = '';
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Polygon2D.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Polygon2D.prototype, 'page', {
  get: function() {
    return this._page;
  },
  configurable: true
});
Object.defineProperty(Polygon2D.prototype, 'character', {
  get: function() {
    return this._character;
  },
  set: function(value) {
    this._character = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Polygon2D.prototype.setColor = function(color, collide_color){
  this._color = color;
  this._collide_color = collide_color;
}
// --------------------------------------------------------------------------------
Polygon2D.prototype.getObject = function(){
  return new Polygon2D("", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Polygon2D.prototype.getCorePoint = function(){
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points[i] = SDUDocument.getCurrentPageElement(Dot2D.TAG, this._points[i]);
  }
  let point = new Point(0, 0);
  for(let i = 0; i < points.length; i++){
    point = point.add(points[i]);
  }
  return point.division(points.length);
};
// --------------------------------------------------------------------------------
Polygon2D.prototype.checkCollide = function(point){
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points[i] = Graphics.getRenderPoint(SDUDocument.getCurrentPageElement(Dot2D.TAG, this._points[i]));
  }
  return new Polygon(points).isPointInSelf(point);
};
// --------------------------------------------------------------------------------
Polygon2D.prototype.render = function(ctx){
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points[i] = SDUDocument.getCurrentPageElement(Dot2D.TAG, this._points[i]);
  }
  Polygon.prototype.fillCanvas.call(new Polygon(points), ctx, this._color);
};
Polygon2D.prototype.renderCollide = function(ctx){
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points[i] = SDUDocument.getCurrentPageElement(Dot2D.TAG, this._points[i]);
  }
  Polygon.prototype.fillCanvas.call(new Polygon(points), ctx, this._collide_color);
};
// --------------------------------------------------------------------------------
Polygon2D.prototype.onDelete = function(){
  SDUDocument.deleteElement(Character.TAG, this._character);
  this._character = '';
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Polygon2D.prototype.loadJson = function(json){
  this._id = json._id;
  this._page = json._page;
  this._points = json._points;
  this._character = json._character;
}
Polygon2D.prototype.saveJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _points: this._points,
    _character: this._character
  }
}
// ================================================================================

// ================================================================================
// * PolygonFactory
// --------------------------------------------------------------------------------
function PolygonFactory(){
  throw new Error('This is a static class');
}
PolygonFactory._points = [];
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
PolygonFactory.getPoints = function(){
  return this._points;
};
PolygonFactory.addPoint = function(id){
  this._points.push(id);
};
PolygonFactory.clearPoints = function(){
  this._points = [];
};
PolygonFactory.isClose = function(id){
  return this._points[0] === id;
};
// --------------------------------------------------------------------------------
PolygonFactory.makeObject = function(page, points){
  return new Polygon2D(this.getNextIndex(), page, points);
};
PolygonFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Polygon2D.TAG);
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool("polygon", "多边形工具", "mdi-pentagon-outline", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
  Engine.setTodo(LanguageManager.TOOL_POLYGON);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("polygon.onLeftClick", "left_click", false, PolygonFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length === 0){
    collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
    let dot;
    if(collide_list.length === 2){
      dot = DotFactory.makeObject(DocumentManager.getCurrentPageId(), Dot2D.Type.INTERSECTION, collide_list[0], collide_list[1]);
    }else if(collide_list.length === 1){
      let dependent = LineFactory.getDependent(collide_list[0], new Point(event.layerX, event.layerY));
      dot = DotFactory.makeObject(DocumentManager.getCurrentPageId(), Dot2D.Type.DEPENDENT, collide_list[0], dependent);
    }else{
      let point = Graphics.getGridPoint(new Point(event.layerX, event.layerY));
      dot = DotFactory.makeObject(DocumentManager.getCurrentPageId(), Dot2D.Type.FREE, point.x, point.y);
    }
    DocumentManager.addElement(Dot2D.TAG, dot);
    PolygonFactory.addPoint(dot.id);
  }else{
    if(PolygonFactory.isClose(collide_list[0])){
      DocumentManager.addElement(Polygon2D.TAG, PolygonFactory.makeObject(
        DocumentManager.getCurrentPageId(), PolygonFactory.getPoints()));
      PolygonFactory.clearPoints();
    }else{
      PolygonFactory.addPoint(collide_list[0]);
    }
  }
}));
ToolManager.addHandler(new Handler("polygon.onRightClick", "right_click", false, PolygonFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  PolygonFactory.clearPoints();

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length === 0) {
    Graphics.refresh();
    return;
  }
  DocumentManager.deleteElement(Polygon2D.TAG, collide_list[0]);
}));
ToolManager.addHandler(new Handler("polygon.onMouseMove", "mousemove", false, PolygonFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("polygon.onMouseOut", "mouseout", false, PolygonFactory, function(event){
  PolygonFactory.clearPoints();
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("_polygon.normal", 5, PolygonFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  let polygons = SDUDocument.getCurrentPageElements(Polygon2D.TAG);
  for(let i in polygons){
    if(collide_list.indexOf(i) === -1){
      polygons[i].render(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("!polygon.collide", 6, PolygonFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).render(ctx);
  }
}));
RenderManager.addRenderer(new Renderer("polygon.collide", 6, PolygonFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
RenderManager.addRenderer(new Renderer("polygon.line.collide", 9, PolygonFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  if(collide_list.length > 0){
    for(let i = 0; i < collide_list.length; i++){
      SDUDocument.getCurrentPageElement(Line2D.TAG, collide_list[i]).renderCollide(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("polygon.dot.collide", 11, PolygonFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Dot2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("polygon.mouseBottom", 9, PolygonFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0) {
    if(PolygonFactory.getPoints().length >= 2){
      let points = PolygonFactory.getPoints().concat(collide_list[0]);
      for(let i = 0; i < points.length; i++){
        points[i] = SDUDocument.getCurrentPageElement(Dot2D.TAG, points[i]);
      }
      let polygon = new Polygon(points);
      polygon.fillCanvas(ctx, 'rgba(0, 0, 0, 0.3)');
    }
  }else{
    let polygon = null;
    let mouse_point = MouseInput.getMousePoint();
    if(!mouse_point) return;
    if(PolygonFactory.getPoints().length < 2) return;
    let points = PolygonFactory.getPoints().concat();
    for(let i = 0; i < points.length; i++){
      points[i] = SDUDocument.getCurrentPageElement(Dot2D.TAG, points[i]);
    }

    collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
    if(collide_list.length === 2){
      let point = LineFactory.getIntersection(collide_list[0], collide_list[1]);
      polygon = new Polygon(points.concat(Graphics.getGridPoint(point)));
    }else if(collide_list.length === 1){
      let point = LineFactory.getProjection(collide_list[0], mouse_point);
      polygon = new Polygon(points.concat(Graphics.getGridPoint(point)));
    }else{
      polygon = new Polygon(points.concat(Graphics.getGridPoint(mouse_point)));
    }
    if(polygon !== null){
      polygon.fillCanvas(ctx, 'rgba(0, 0, 0, 0.3)');
    }
  }
}));
RenderManager.addRenderer(new Renderer("polygon.mouse", 100, PolygonFactory, function(ctx){
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
