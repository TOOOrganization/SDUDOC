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
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  if(collide_list.length > 0) return -1;
  let start = Graphics.getRenderPoint(SDUDocument.data["Dot2D"][this._start]);
  let end = Graphics.getRenderPoint(SDUDocument.data["Dot2D"][this._end]);
  if(start.x === end.x) end.x += 0.0001;
  if(start.y === end.y) end.y += 0.0001;
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
  for(let i in SDUDocument.data["Dot2D"]){
    if(SDUDocument.data["Dot2D"][i].father === this._id ||
      SDUDocument.data["Dot2D"][i].father1 === this._id || SDUDocument.data["Dot2D"][i].father2 === this._id){
      SDUDocument.deleteElement("Dot2D", i);
    }
  }
};
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
  let l1 = SDUDocument.data["Line2D"][line1];
  let l2 = SDUDocument.data["Line2D"][line2];
  let l1_s = SDUDocument.data["Dot2D"][l1.start];
  let l1_e = SDUDocument.data["Dot2D"][l1.end];
  let l2_s = SDUDocument.data["Dot2D"][l2.start];
  let l2_e = SDUDocument.data["Dot2D"][l2.end];
  let k1 = (l1_e.y - l1_s.y)/(l1_e.x - l1_s.x);
  let k2 = (l2_e.y - l2_s.y)/(l2_e.x - l2_s.x);
  let x = (l2_s.y - l1_s.y + k1 * l1_s.x - k2 * l2_s.x) / (k1 - k2);
  let y = k1 * (x - l1_s.x) + l1_s.y;
  return Graphics.getRenderPoint(new Point(x, y));
};
LineFactory.getProjection = function(line, point){
  let l = SDUDocument.data["Line2D"][line];
  let start = Graphics.getRenderPoint(SDUDocument.data["Dot2D"][l.start]);
  let end = Graphics.getRenderPoint(SDUDocument.data["Dot2D"][l.end]);
  let k1 = (end.y - start.y)/(end.x - start.x);
  let k2 = -1 / k1;
  let x = (k2 * point.x - point.y + end.y - k1 * end.x) / (k2 - k1);
  let y = k2 * (x - point.x) + point.y;
  return new Point(x, y);
};
LineFactory.getDependent = function(line, point){
  let l = SDUDocument.data["Line2D"][line];
  let start = Graphics.getRenderPoint(SDUDocument.data["Dot2D"][l.start]);
  let end = Graphics.getRenderPoint(SDUDocument.data["Dot2D"][l.end]);
  let k1 = (end.y - start.y)/(end.x - start.x);
  let k2 = -1 / k1;
  let x = (k2 * point.x - point.y + end.y - k1 * end.x) / (k2 - k1);
  return (x - start.x) / (end.x - start.x);
};
LineFactory.getDependentPoint = function(line, dependent){
  let start = SDUDocument.data["Dot2D"][line.start];
  let end = SDUDocument.data["Dot2D"][line.end];
  return new Point(start.x + (end.x - start.x) * dependent,
    start.y + (end.y - start.y) * dependent);
};
// --------------------------------------------------------------------------------
LineFactory.makeObject = function(page, start, end){
  return new Line2D(this.getNextIndex(), page, start, end);
};
LineFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex("Line2D");
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// ================================================================================
ToolManager.addTool(new Tool("line", "线工具", "mdi-ray-start-end", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("line.onLeftClick", "left_click", false, LineFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  if(collide_list.length === 0){
    collide_list = CollideManager.getCollideList("Line2D", 2);
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
    DocumentManager.addElement("Dot2D", dot);
    if(LineFactory.getFirstPoint()) {
      DocumentManager.addElement("Line2D", LineFactory.makeObject(
        DocumentManager.getCurrentPageId(), LineFactory.getFirstPoint(), dot.id));
    }
    LineFactory.setFirstPoint(dot.id);
  }else{
    if(LineFactory.getFirstPoint()){
      DocumentManager.addElement("Line2D", LineFactory.makeObject(
        DocumentManager.getCurrentPageId(), LineFactory.getFirstPoint(), collide_list[0]));
    }
    LineFactory.setFirstPoint(collide_list[0]);
  }
}));
ToolManager.addHandler(new Handler("line.onRightClick", "right_click", false, LineFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  if(LineFactory.getFirstPoint()){
    LineFactory.clearFirstPoint();
  }else{
    let collide_list = CollideManager.getCollideList("Line2D", 1);
    if(collide_list.length === 0) return;
    DocumentManager.deleteElement("Line2D", collide_list[0]);
  }
  Graphics.refresh();
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
  if(SDUDocument.getCurrentPage() <= 0) return;
  let current_page = DocumentManager.getCurrentPageId();
  let collide_list = CollideManager.getCollideList("Line2D", 2);
  for(let i in SDUDocument.data["Line2D"]){
    if(collide_list.indexOf(i) === -1 && SDUDocument.data["Line2D"][i].page === current_page){
      SDUDocument.data["Line2D"][i].render(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("!line.collide", 8, LineFactory, function(ctx){
  if(SDUDocument.getCurrentPage() <= 0) return;
  let current_page = DocumentManager.getCurrentPageId();
  let collide_list = CollideManager.getCollideList("Line2D", 2);
  for(let i in SDUDocument.data["Line2D"]){
    if(collide_list.indexOf(i) !== -1 && SDUDocument.data["Line2D"][i].page === current_page){
      SDUDocument.data["Line2D"][i].render(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("line.collide", 9, LineFactory, function(ctx){
  if(SDUDocument.getCurrentPage() <= 0) return;
  let current_page = DocumentManager.getCurrentPageId();
  let collide_list = CollideManager.getCollideList("Line2D", 2);
  for(let i in SDUDocument.data["Line2D"]){
    if(collide_list.indexOf(i) !== -1 && SDUDocument.data["Line2D"][i].page === current_page){
      SDUDocument.data["Line2D"][i].renderCollide(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("line.dot.collide", 11, LineFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  for(let i in SDUDocument.data["Dot2D"]){
    if(collide_list.indexOf(i) !== -1){
      SDUDocument.data["Dot2D"][i].renderCollide(ctx);
    }
  }
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("line.mouseBottom", 9, LineFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
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
    let start = SDUDocument.data["Dot2D"][LineFactory.getFirstPoint()];
    collide_list = CollideManager.getCollideList("Line2D", 2);
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
