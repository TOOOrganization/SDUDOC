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
function Dot2D(){
  this.initialize.apply(this, arguments);
}
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
Dot2D.prototype.id = '';
Dot2D.prototype.type = Dot2D.Type.FREE;
// --------------------------------------------------------------------------------
Dot2D.prototype.radius = 0;
Dot2D.prototype.line_width = 0;
Dot2D.prototype.color = '';
Dot2D.prototype.line_color = '';
// --------------------------------------------------------------------------------
Dot2D.prototype.x = 0;
Dot2D.prototype.y = 0;
// --------------------------------------------------------------------------------
Dot2D.prototype.father = '';
Dot2D.prototype.position = 0;
// --------------------------------------------------------------------------------
Dot2D.prototype.father1 = '';
Dot2D.prototype.father2 = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Dot2D.prototype.initialize = function(id, type, arg1, arg2){
  this.radius = 5;
  this.stroke_width = 2;
  this.color = 'rgba(0, 0, 255, 1)';
  this.stroke_color = 'rgba(255, 255, 255, 1)';

  this.id = id;

  this.type = type;
  switch (this.type) {
    case Dot2D.Type.FREE: default:
      this.x = arg1;
      this.y = arg2;
      break;
    case Dot2D.Type.DEPENDENT:
      this.father = arg1;
      this.position = arg2;
      break;
    case Dot2D.Type.INTERSECTION:
      this.father1 = arg1;
      this.father2 = arg2;
      break;
  }
};
// --------------------------------------------------------------------------------
// * Setter
// --------------------------------------------------------------------------------
Dot2D.prototype.setColor = function(color, stroke_color){
  this.color = color;
  this.stroke_color = stroke_color;
}
Dot2D.prototype.setSize = function(radius, stroke_width){
  this.radius = radius;
  this.stroke_width = stroke_width;
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Dot2D.prototype.toXml = function(){
  let string_builder = "";

  return
};
Dot2D.prototype.render = function(ctx, grid){
  let point = grid.getDrawPoint(this);

  ctx.save();
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.stroke_color;
  ctx.lineWidth = this.stroke_width;
  ctx.beginPath();
  ctx.arc(point.x, point.y, this.radius,0,360, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
};
// ================================================================================

/*
// ================================================================================
// * Point2D
// ================================================================================
function Point2D(){
  this.initialize.apply(this, arguments);
}

Point2D.prototype.x = 0;
Point2D.prototype.y = 0;
Point2D.prototype.father = [];
Point2D.prototype.relative = 0;

Point2D.prototype.initialize = function(x, y){
  this.x = x;
  this.y = y;
};
Point2D.prototype.setFather = function(father, relative = 0){
  this.father = father;
  this.relative = relative;
};
Point2D.prototype.distance2D = function(point){
  return new Point2D(point.x - this.x, point.y - this.y);
};
Point2D.prototype.distance = function(point){
  let distance2D = this.distance2D(point);
  return Math.sqrt(Math.pow(distance2D.x, 2) + Math.pow(distance2D.y, 2));
};
Point2D.prototype.add = function(point){
  return new Point2D(this.x + point.x, this.y + point.y);
};
Point2D.prototype.multiply = function(num){
  return new Point2D(this.x * num, this.y * num);
};
Point2D.prototype.division = function(num){
  return new Point2D(this.x / num, this.y / num);
};
Point2D.prototype.fill = function(ctx, grid, radius, lineWidth, color, strokeColor){
  let point = grid.getDrawPoint(this);

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius,0,360, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
};
// ================================================================================
*/
