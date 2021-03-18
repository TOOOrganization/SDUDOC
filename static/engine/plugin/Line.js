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
// --------------------------------------------------------------------------------
Line2D.prototype.getObject = function(){
  return new Line2D("", "", "", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Line2D.prototype.checkCollide = function(point){
  //let distance = Graphics.getRenderPoint(this).distance(point);
  return -1;//distance <= this._radius + 2 ? distance : -1;
};
// --------------------------------------------------------------------------------
Line2D.prototype.render = function(ctx){
  Line.prototype.fillCanvas.call(this, ctx, this._radius - 2, this._color);
  Line.prototype.strokeCanvas.call(this, ctx, this._radius - 2, this._stroke_width / 2, this._stroke_color);
};
Line2D.prototype.renderCollide = function(ctx){
  Line.prototype.fillCanvas.call(this, ctx, this._radius, this._color);
  Line.prototype.strokeCanvas.call(this, ctx, this._radius, this._stroke_width, this._collide_color);
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
// --------------------------------------------------------------------------------
LineFactory.makeObject = function(page, start, end){
  return new Line2D(this.getNextIndex(), page, start, end);
}
LineFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex("Line2D");
}
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
    let point = Graphics.getGridPoint(new Point(event.layerX, event.layerY));
    let dot = DotFactory.makeObject(DocumentManager.getCurrentPageId(), Dot2D.Type.FREE, point.x, point.y)
    DocumentManager.addElement("Dot2D", dot);
    if(LineFactory._firstPoint) {
      DocumentManager.addElement("Line2D", LineFactory.makeObject(
        DocumentManager.getCurrentPageId(), LineFactory._firstPoint, dot.id));
      LineFactory._firstPoint = null;
      console.log(SDUDocument.data, LineFactory._firstPoint)
    }else{
      LineFactory._firstPoint = dot.id;
    }
  }else{
    if(LineFactory._firstPoint){
      DocumentManager.addElement("Line2D", LineFactory.makeObject(
        DocumentManager.getCurrentPageId(), LineFactory._firstPoint, collide_list[0]));
      LineFactory._firstPoint = null;
      console.log(SDUDocument.data, LineFactory._firstPoint)
    }else{
      LineFactory._firstPoint = collide_list[0];
    }
  }

}));/*
ToolManager.addHandler(new Handler("line.onRightClick", "right_click", false, LineFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  if(collide_list.length === 0) return;
  DocumentManager.deleteElement("Dot2D", collide_list[0]);
}));*/
ToolManager.addHandler(new Handler("line.onMouseMove", "mousemove", false, LineFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("line.onMouseOut", "mouseout", false, LineFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("_line.normal", 9, LineFactory, function(ctx){
  if(SDUDocument.getCurrentPage() <= 0) return;
  let current_page = DocumentManager.getCurrentPageId();
  let collide_list = CollideManager.getCollideList("Line2D", 1);
  for(let i in SDUDocument.data["Line2D"]){
    if(collide_list.indexOf(i) === -1 && SDUDocument.data["Line2D"][i].page === current_page){
      SDUDocument.data["Line2D"][i].render(ctx);
    }
  }
}));
/*
RenderManager.addRenderer(new Renderer("_line.collide", 11, LineFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  for(let i in SDUDocument.data["Dot2D"]){
    if(collide_list.indexOf(i) !== -1){
      SDUDocument.data["Dot2D"][i].renderCollide(ctx);
    }
  }
}));*/
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("line.mouse", 100, LineFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  if(collide_list.length > 0) return;
  let mouse_point = MouseInput.getMousePoint();
  if(mouse_point !== null){
    mouse_point.fillSelf(ctx, 3, 'rgba(255, 255, 255, 0.5)');
    mouse_point.strokeSelf(ctx, 5, 2, 'rgba(0, 0, 255, 0.5)');
  }
}));
// ================================================================================
