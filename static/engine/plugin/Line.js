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
//   2020/03/17 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Line2D
// ================================================================================
function Line2D(){
  this.initialize.apply(this, arguments);
}
Line2D.prototype = Object.create(Line.prototype);
Line2D.prototype.constructor = Line2D;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Line2D.TAG = "Line2D";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Line2D.prototype._id = "";
Line2D.prototype._page = "";
// --------------------------------------------------------------------------------
Line2D.prototype._radius = 0;
Line2D.prototype._stroke_width = 0;
Line2D.prototype._color = '';
Line2D.prototype._collide_color = '';
Line2D.prototype._stroke_color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Line2D.prototype.initialize = function(id, page, start, end){
  Line.prototype.initialize.call(this, start, end);

  this._radius = 3;
  this._stroke_width = 1;
  this._color = 'rgba(0, 0, 255, 1)';
  this._collide_color = 'rgba(255, 0, 0, 1)';
  this._stroke_color = 'rgba(255, 255, 255, 1)';

  this._id = id;
  this._page = page;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Line2D.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Line2D.prototype, 'page', {
  get: function() {
    return this._page;
  },
  configurable: true
});
Object.defineProperty(Line2D.prototype, 'radius', {
  get: function() {
    return this._radius;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Line2D.prototype.setColor = function(color, collide_color, stroke_color){
  this._color = color;
  this._collide_color = collide_color;
  this._stroke_color = stroke_color;
}
Line2D.prototype.setSize = function(radius, stroke_width){
  this._radius = radius;
  this._stroke_width = stroke_width;
}
// --------------------------------------------------------------------------------
Line2D.prototype.getObject = function(){
  return new Line2D("", "", "", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Line2D.prototype.checkCollide = function(point){
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0) return -1;
  let start = Graphics.getRenderPoint(SDUDocument.getCurrentPageElement(Dot2D.TAG, this._start));
  let end = Graphics.getRenderPoint(SDUDocument.getCurrentPageElement(Dot2D.TAG, this._end));
  if(Math.abs(start.x - end.x) < 0.01){
    if((start.y < end.y && (start.y < point.y && point.y < end.y)) ||
      (start.y > end.y && (start.y > point.y && point.y > end.y))){
      let distance = Math.abs(point.x - start.x)
      return distance <= this._radius + 2 ? distance : -1;
    }
  }else if(Math.abs(start.y - end.y) < 0.01){
    if((start.x < end.x && (start.x < point.x && point.x < end.x)) ||
      (start.x > end.x && (start.x > point.x && point.x > end.x))){
      let distance = Math.abs(point.y - start.y)
      return distance <= this._radius + 2 ? distance : -1;
    }
  }else{
    let k1 = (end.y - start.y)/(end.x - start.x);
    let k2 = -1 / k1;
    let x = (k2 * point.x - point.y + end.y - k1 * end.x) / (k2 - k1);
    let y = k2 * (x - point.x) + point.y;
    if((start.x < end.x && (start.x < x && x < end.x)) || (start.x > end.x && (start.x > x && x > end.x))){
      if((start.y < end.y && (start.y < y && y < end.y)) || (start.y > end.y && (start.y > y && y > end.y))){
        let distance = point.distance(new Point(x, y));
        return distance <= this._radius + 2 ? distance : -1;
      }
    }
  }
  let distance = Math.min(point.distance(start), point.distance(end));
  return distance <= this._radius + 2 ? distance : -1;
};
// --------------------------------------------------------------------------------
Line2D.prototype.render = function(ctx){
  Line.prototype.fillCanvas.call(this, ctx, this._radius - 2, this._color);
  Line.prototype.strokeCanvas.call(this, ctx, this._radius - 2, this._stroke_width / 2, this._stroke_color);
};
Line2D.prototype.renderCollide = function(ctx){
  Line.prototype.fillCanvas.call(this, ctx, this._radius, this._stroke_color);
  Line.prototype.strokeCanvas.call(this, ctx, this._radius, this._stroke_width, this._collide_color);
};
// --------------------------------------------------------------------------------
Line2D.prototype.onDelete = function(){
  let dots = SDUDocument.getCurrentPageElements(Dot2D.TAG);
  for(let i in dots){
    if(dots[i].father === this._id || dots[i].father1 === this._id || dots[i].father2 === this._id){
      if(SDUDocument.getElement(Dot2D.TAG, i)) {
        SDUDocument.deleteElement(Dot2D.TAG, i);
      }
    }
  }
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Line2D.prototype.loadJson = function(json){
  this._id = json._id;
  this._page = json._page;
  this._start = json._start;
  this._end = json._end;
}
Line2D.prototype.saveJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _start: this._start,
    _end: this._end
  }
}
// ================================================================================

// ================================================================================
// * LineFactory
// ================================================================================
function LineFactory(){
  throw new Error('This is a static class');
}
LineFactory._firstPoint = null;
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
LineFactory.getFirstPoint = function(){
  return this._firstPoint;
};
LineFactory.setFirstPoint = function(id){
  this._firstPoint = id;
};
LineFactory.clearFirstPoint = function(){
  this._firstPoint = null;
};
// --------------------------------------------------------------------------------
LineFactory.getIntersection = function(line1, line2){
  let l1 = SDUDocument.getElement(Line2D.TAG, line1);
  let l2 = SDUDocument.getElement(Line2D.TAG, line2);
  let l1_s = SDUDocument.getElement(Dot2D.TAG, l1.start);
  let l1_e = SDUDocument.getElement(Dot2D.TAG, l1.end);
  let l2_s = SDUDocument.getElement(Dot2D.TAG, l2.start);
  let l2_e = SDUDocument.getElement(Dot2D.TAG, l2.end);
  if(Math.abs(l1_s.x - l1_e.x) < 0.01){
    if(Math.abs(l2_s.x - l2_e.x) < 0.01){
      return Graphics.getRenderPoint(new Point(0, 0));
    }else if(Math.abs(l2_s.y - l2_e.y) < 0.01){
      return Graphics.getRenderPoint(new Point(l1_s.x, l2_s.y));
    }else{
      let k2 = (l2_e.y - l2_s.y)/(l2_e.x - l2_s.x);
      let x = l1_s.x
      let y = k2 * (x - l2_e.x) + l2_e.y
      return Graphics.getRenderPoint(new Point(x, y));
    }
  }else if(Math.abs(l1_s.y - l1_e.y) < 0.01){
    if(Math.abs(l2_s.x - l2_e.x) < 0.01){
      return Graphics.getRenderPoint(new Point(l2_s.x, l1_s.y));
    }else if(Math.abs(l2_s.y - l2_e.y) < 0.01){
      return Graphics.getRenderPoint(new Point(0, 0));
    }else{
      let k2 = (l2_e.y - l2_s.y)/(l2_e.x - l2_s.x);
      let y = l1_s.y
      let x = (y - l2_e.y) / k2 + l2_e.x
      return Graphics.getRenderPoint(new Point(x, y));
    }
  }else{
    if(Math.abs(l2_s.x - l2_e.x) < 0.01){
      let k1 = (l1_e.y - l1_s.y)/(l1_e.x - l1_s.x);
      let x = l2_s.x
      let y = k1 * (x - l1_e.x) + l1_e.y
      return Graphics.getRenderPoint(new Point(x, y));
    }else if(Math.abs(l2_s.y - l2_e.y) < 0.01){
      let k1 = (l1_e.y - l1_s.y)/(l1_e.x - l1_s.x);
      let y = l2_s.y
      let x = (y - l1_e.y) / k1 + l1_e.x
      return Graphics.getRenderPoint(new Point(x, y));
    }else{
      let k1 = (l1_e.y - l1_s.y)/(l1_e.x - l1_s.x);
      let k2 = (l2_e.y - l2_s.y)/(l2_e.x - l2_s.x);
      let x = (l2_s.y - l1_s.y + k1 * l1_s.x - k2 * l2_s.x) / (k1 - k2);
      let y = k1 * (x - l1_s.x) + l1_s.y;
      return Graphics.getRenderPoint(new Point(x, y));
    }
  }
};
LineFactory.getProjection = function(line, point){
  let l = SDUDocument.getElement(Line2D.TAG, line);
  let start = Graphics.getRenderPoint(SDUDocument.getElement(Dot2D.TAG, l.start));
  let end = Graphics.getRenderPoint(SDUDocument.getElement(Dot2D.TAG, l.end));
  if(Math.abs(start.x - end.x) < 0.01){
    return new Point(start.x, point.y);
  }else if(Math.abs(start.y - end.y) < 0.01){
    return new Point(point.x, start.y);
  }else{
    let k1 = (end.y - start.y)/(end.x - start.x);
    let k2 = -1 / k1;
    let x = (k2 * point.x - point.y + end.y - k1 * end.x) / (k2 - k1);
    let y = k2 * (x - point.x) + point.y;
    return new Point(x, y);
  }
};
LineFactory.getDependent = function(line, point){
  let l = SDUDocument.getElement(Line2D.TAG, line);
  let start = Graphics.getRenderPoint(SDUDocument.getElement(Dot2D.TAG, l.start));
  let end = Graphics.getRenderPoint(SDUDocument.getElement(Dot2D.TAG, l.end));
  if(Math.abs(start.x - end.x) < 0.01){
    return (point.y - start.y) / (end.y - start.y);
  }else if(Math.abs(start.y - end.y) < 0.01){
    return (point.x - start.x) / (end.x - start.x);
  }else{
    let k1 = (end.y - start.y)/(end.x - start.x);
    let k2 = -1 / k1;
    let x = (k2 * point.x - point.y + end.y - k1 * end.x) / (k2 - k1);
    return (x - start.x) / (end.x - start.x);
  }
};
LineFactory.getDependentPoint = function(line, dependent){
  let start = SDUDocument.getElement(Dot2D.TAG, line.start);
  let end = SDUDocument.getElement(Dot2D.TAG, line.end);
  return new Point(start.x + (end.x - start.x) * dependent,
    start.y + (end.y - start.y) * dependent);
};
// --------------------------------------------------------------------------------
LineFactory.makeObject = function(page, start, end){
  return new Line2D(this.getNextIndex(), page, start, end);
};
LineFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Line2D.TAG);
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// ================================================================================
ToolManager.addTool(new Tool("line", "直线工具", "mdi-ray-start-end", Tool.Slot.PLUGIN, function(id){
  ToolManager.setCurrentPlugin(id);
  Engine.setTodo(LanguageManager.TOOL_LINE);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("line.onLeftClick", "left_click", false, LineFactory, function(event){
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
    if(LineFactory.getFirstPoint()) {
      DocumentManager.addElement(Line2D.TAG, LineFactory.makeObject(
        DocumentManager.getCurrentPageId(), LineFactory.getFirstPoint(), dot.id));
    }
    LineFactory.setFirstPoint(dot.id);
  }else{
    if(LineFactory.getFirstPoint()){
      DocumentManager.addElement(Line2D.TAG, LineFactory.makeObject(
        DocumentManager.getCurrentPageId(), LineFactory.getFirstPoint(), collide_list[0]));
    }
    LineFactory.setFirstPoint(collide_list[0]);
  }
}));
ToolManager.addHandler(new Handler("line.onRightClick", "right_click", false, LineFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  LineFactory.clearFirstPoint();

  let collide_list = CollideManager.getCollideList(Line2D.TAG, 1);
  if(collide_list.length === 0) {
    Graphics.refresh();
    return;
  }
  DocumentManager.deleteElement(Line2D.TAG, collide_list[0]);
}));
ToolManager.addHandler(new Handler("line.onMouseMove", "mousemove", false, LineFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("line.onMouseOut", "mouseout", false, LineFactory, function(event){
  LineFactory.clearFirstPoint();
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("_line.normal", 9, LineFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  let lines = SDUDocument.getCurrentPageElements(Line2D.TAG);
  for(let i in lines){
    if(collide_list.indexOf(i) === -1){
      lines[i].render(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("!line.collide", 8, LineFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  if(collide_list.length > 0){
    for(let i = 0; i < collide_list.length; i++){
      SDUDocument.getCurrentPageElement(Line2D.TAG, collide_list[i]).render(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("line.collide", 9, LineFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
  if(collide_list.length > 0){
    for(let i = 0; i < collide_list.length; i++){
      SDUDocument.getCurrentPageElement(Line2D.TAG, collide_list[i]).renderCollide(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("line.dot.collide", 11, LineFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Dot2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("line.mouseBottom", 9, LineFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0) {
    if(LineFactory.getFirstPoint()){
      let line = new Line(LineFactory.getFirstPoint(), collide_list[0]);
      line.fillCanvas(ctx, 2, 'rgba(0, 0, 255, 0.5)');
      line.strokeCanvas(ctx, 2, 0.5, 'rgba(255, 255, 255, 0.5)');
    }
  }else{
    let line = null;
    let mouse_point = MouseInput.getMousePoint();
    if(!mouse_point) return;
    if(!LineFactory.getFirstPoint()) return;
    let start = SDUDocument.getCurrentPageElement(Dot2D.TAG, LineFactory.getFirstPoint());
    collide_list = CollideManager.getCollideList(Line2D.TAG, 2);
    if(collide_list.length === 2){
      let point = LineFactory.getIntersection(collide_list[0], collide_list[1]);
      line = new Line(Graphics.getRenderPoint(start), point);
    }else if(collide_list.length === 1){
      let point = LineFactory.getProjection(collide_list[0], mouse_point);
      line = new Line(Graphics.getRenderPoint(start), point);
    }else{
      line = new Line(Graphics.getRenderPoint(start), mouse_point);
    }
    if(line !== null){
      line.fill(ctx, 2, 'rgba(0, 0, 255, 0.5)', line.start, line.end);
      line.stroke(ctx, 2, 0.5, 'rgba(255, 255, 255, 0.5)',  line.start, line.end);
    }
  }
}));
RenderManager.addRenderer(new Renderer("line.mouse", 100, LineFactory, function(ctx){
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
