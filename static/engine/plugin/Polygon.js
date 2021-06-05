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
//   2021/03/19 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Polygon2D
// --------------------------------------------------------------------------------
function Polygon2D(){
  this.initialize.apply(this, arguments);
}
Polygon2D.prototype = Object.create(Element.prototype);
Polygon2D.prototype.constructor = Polygon2D;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Polygon2D.TAG = "Polygon2D";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Polygon2D.prototype._points = [];
// --------------------------------------------------------------------------------
Polygon2D.prototype._character = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Polygon2D.prototype.initialize = function(id, page, points){
  Element.prototype.initialize.call(this, id, page);

  this._points = points;
  this._character = '';
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Polygon2D.prototype, 'points', {
  get: function() {
    return this._points;
  },
  set: function(value) {
    this._points = value;
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
// * Get Base Object
// --------------------------------------------------------------------------------
Polygon2D.prototype.getPolygon = function(){
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points.push(ElementManager.getElement(Dot2D.TAG, this._points[i]).getPoint());
  }
  return new Polygon(points);
}
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Polygon2D.prototype.newElement = function(){
  return new Polygon2D('', [], []);
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Polygon2D.prototype.onAwake = function(){

};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Polygon2D.prototype.onUpdate = function(){

};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Polygon2D.prototype.onRemove = function(){
  ElementManager.removeElement(Character.TAG, this._character);
  this._character = '';
};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Polygon2D.prototype.checkCollide = function(point){
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points[i] = Graphics.getRenderPoint(ElementManager.getElement(Dot2D.TAG, this._points[i]).getPoint());
  }
  return new Polygon(points).isPointInSelf(point);
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Polygon2D.prototype.append = function(point){
  this._points.push(point);
};
Polygon2D.prototype.isClose = function(point){
  return this._points[0] === point;
};
// --------------------------------------------------------------------------------
Polygon2D.prototype.getCorePoint = function(){
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points[i] = ElementManager.getCurrentPageElement(Dot2D.TAG, this._points[i]);
  }
  let point = new Point(0, 0);
  for(let i = 0; i < points.length; i++){
    point = point.add(points[i]);
  }
  return point.division(points.length);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Polygon2D.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._points    = json_object._points    === undefined ? this._points    : json_object._points;
  this._character = json_object._character === undefined ? this._character : json_object._character;
}
Polygon2D.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._points    = this._points;
  output._character = this._character;
  return output;
}
Polygon2D.prototype.exportJson = function(){
  return null;
}
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionary({
  type: Language.Type.Todo, id: 'plugin-polygon', dictionary:[
    { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增多边形】依次点击多个点，再点击第一个点。【取消新增多边形】再次点击第一个点前，右键单击。【删除多边形】右键单击一个多边形。'] }
  ]
})
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('polygon', '多边形工具', 'mdi-pentagon-outline', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-polygon');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('polygon.onMouseLeftClick', 'left_click', false, Engine,
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
    if(SelectManager.isSelectedType(Polygon2D.TAG)) {
      let polygon_object = SelectManager.getSelectedObject();
      if(polygon_object.isClose(dot_object.id)){
        DocumentManager.addElement(Polygon2D.TAG, polygon_object);
        SelectManager.unSelect();
      }else{
        polygon_object.append(dot_object.id);
        Graphics.refresh();
      }
    }else{
      let polygon_object = ElementManager.makeElement(Polygon2D.TAG,
        [DocumentManager.getCurrentPageId()], [dot_object.id]);
      SelectManager.selectObject(polygon_object);
      Graphics.refresh();
    }
    DocumentManager.afterChangeElement();
  }else{
    if(SelectManager.isSelectedType(Polygon2D.TAG)) {
      let polygon_object = SelectManager.getSelectedObject();
      if(polygon_object.isClose(collide_list[0])){
        DocumentManager.addElementWithUpdate(Polygon2D.TAG, polygon_object);
        SelectManager.unSelect();
      }else{
        polygon_object.append(collide_list[0]);
        Graphics.refresh();
      }
    }else{
      let polygon_object = ElementManager.makeElement(Polygon2D.TAG,
        [DocumentManager.getCurrentPageId()], [collide_list[0]]);
      SelectManager.selectObject(polygon_object);
      Graphics.refresh();
    }
  }
}));
ToolManager.addHandler(new Handler('polygon.onMouseRightClick', 'right_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    if(SelectManager.isSelectedType(Polygon2D.TAG)){
      SelectManager.unSelect();
      Graphics.refresh();
      return;
    }
    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length === 0) {
      Graphics.refresh();
      return;
    }
    DocumentManager.removeElementWithUpdate(Polygon2D.TAG, collide_list[0]);
  })
);
ToolManager.addHandler(new Handler('polygon.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('polygon.onMouseOut', 'mouseout', false, Engine,
  function(event){
    SelectManager.unSelect();
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
Graphics.renderPolygonNormal = function(polygon){
  let fill_color = ColorManager.RGBToHex(0, 0, 255);
  this.fillPolygon(polygon, fill_color, 0.4);
};
Graphics.renderPolygonCollide = function(polygon){
  let fill_color = ColorManager.RGBToHex(255, 0, 0);
  this.fillPolygon(polygon, fill_color, 0.4);
};
Graphics.renderPolygonVirtual = function(polygon){
  let fill_color = ColorManager.RGBToHex(0, 0, 0);
  this.fillPolygon(polygon, fill_color, 0.3);
};
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('polygon.polygon.all', '', 30, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  let polygons = ElementManager.getFilteredElements(Polygon2D.TAG);
  for(let id in polygons){
    if(collide_list.indexOf(id) === -1){
      Graphics.renderPolygonNormal(Graphics.getRenderPolygon(polygons[id].getPolygon()));
    }
  }
  if(collide_list.length > 0){
    Graphics.renderPolygonCollide(Graphics.getRenderPolygon(polygons[collide_list[0]].getPolygon()));
  }
}));
RenderManager.addRenderer(new Renderer('!polygon.polygon.all', '', 30, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let polygons = ElementManager.getFilteredElements(Polygon2D.TAG);
  for(let id in polygons){
    Graphics.renderPolygonNormal(Graphics.getRenderPolygon(polygons[id].getPolygon()));
  }
}));
RenderManager.addRenderer(new Renderer('polygon.dot.collide', '', 51, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0){
    let dot_object = ElementManager.getElement(Dot2D.TAG, collide_list[0]);
    Graphics.renderPointCollide(Graphics.getRenderPoint(dot_object.getPoint()));
  }
}));
RenderManager.addRenderer(new Renderer('polygon.line.collide', '', 41, function(ctx){
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
RenderManager.addRenderer(new Renderer('polygon.polygon.mouse', '', 39, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0) {
    let polygon_object = SelectManager.getSelectedObject();
    if(!polygon_object) return;
    if(polygon_object.points.length >= 2){
      let dot_object = ElementManager.getElement(Dot2D.TAG, collide_list[0]);
      let polygon = polygon_object.getPolygon();
      polygon.append(dot_object.getPoint());
      Graphics.renderPolygonVirtual(Graphics.getRenderPolygon(polygon));
    }
  }else{
    let mouse_point = Graphics.getMouseSourcePoint();
    if(!mouse_point) return;
    let polygon_object = SelectManager.getSelectedObject();
    if(!polygon_object) return;
    if(polygon_object.points.length < 2) return;
    let polygon = polygon_object.getPolygon();

    collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
    if(collide_list.length === 2){
      let line1 = ElementManager.getElement(Line2D.TAG, collide_list[0]).getLine();
      let line2 = ElementManager.getElement(Line2D.TAG, collide_list[1]).getLine();
      let intersection_point = line1.getIntersectionPoint(line2);
      polygon.append(intersection_point);
    }else if(collide_list.length === 1){
      let line = ElementManager.getElement(Line2D.TAG, collide_list[0]).getLine();
      let projection_point = line.getProjectionPoint(mouse_point);
      polygon.append(projection_point);
    }else{
      polygon.append(mouse_point);
    }
    if(polygon !== null){
      Graphics.renderPolygonVirtual(Graphics.getRenderPolygon(polygon));
    }
  }
}));
RenderManager.addRenderer(new Renderer('polygon.dot.mouse', '', 100, function(ctx){
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
