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
// * Plugin Parameters
// --------------------------------------------------------------------------------
Dot2D.Rander = {
  z: 100
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Dot2D.prototype._id = '';
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
Dot2D.prototype.initialize = function(id, type, arg1, arg2){
  Point.prototype.initialize.call(this, 0, 0);

  this._radius = 5;
  this._stroke_width = 2;
  this._color = 'rgba(0, 0, 255, 1)';
  this._collide_color = 'rgba(255, 0, 0, 1)';
  this._stroke_color = 'rgba(255, 255, 255, 1)';

  this._id = id;

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
Dot2D.prototype.setColor = function(color, collide_color, stroke_color){
  this._color = color;
  this._collide_color = collide_color;
  this._stroke_color = stroke_color;
}
Dot2D.prototype.setSize = function(radius, stroke_width){
  this._radius = radius;
  this._stroke_width = stroke_width;
}
// --------------------------------------------------------------------------------
Dot2D.prototype.getObject = function(){
  return new Page("", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Dot2D.prototype.checkCollide = function(point){
  let distance = this.distance(point);
  return distance <= this._radius ? distance : -1;
};
// --------------------------------------------------------------------------------
Dot2D.prototype.render = function(){
  Point.prototype.fillCanvas.call(this, Graphics.ctx, this._radius - 2, this._color);
  Point.prototype.strokeCanvas.call(this, Graphics.ctx, this._radius, this._stroke_width, this._stroke_color);
};
Dot2D.prototype.renderCollide = function(){
  Point.prototype.fillCanvas.call(this, Graphics.ctx, this._radius, this._color);
  Point.prototype.strokeCanvas.call(this, Graphics.ctx, this._radius, this._stroke_width, this._collide_color);
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
DotFactory.makeObject = function(type, arg1, arg2){
  return new Dot2D(this.getNextIndex(), type, arg1, arg2);
}
DotFactory.getNextIndex = function(){
  return SDUDocument.getNextIndex("Dot2D");
}
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// ================================================================================
ToolManager.addTool(new Tool("dot", "点工具", "mdi-circle-medium", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
ToolManager.addHandler(new Handler("dot.onLeftClick", "left_click", false, ToolManager, function(event){

}));
ToolManager.addHandler(new Handler("dot.onRightClick", "right_click", false, ToolManager, function(event){

}));
ToolManager.addHandler(new Handler("dot.onMouseMove", "mousemove", false, ToolManager, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("dot.onMouseOut", "mouseout", false, ToolManager, function(event){
  Graphics.refresh();
}));

RenderManager.addRenderer(new Renderer("dot.mouse", 10, RenderManager, function(ctx){
  let mouse_point = MouseInput.getMousePoint();
  if(mouse_point !== null){
    mouse_point.fillSelf(ctx, 3, 'rgba(255, 255, 255, 0.5)');
    mouse_point.strokeSelf(ctx, 5, 2, 'rgba(0, 0, 255, 0.5)');
  }
}));

// ================================================================================
