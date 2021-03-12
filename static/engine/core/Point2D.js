// ================================================================================
// * Point2D <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Point2D
// --------------------------------------------------------------------------------
function Point2D(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Point2D.prototype.x = 0;
Point2D.prototype.y = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Point2D.prototype.initialize = function(x, y){
  this.x = x;
  this.y = y;
};
// --------------------------------------------------------------------------------
// * Setter
// --------------------------------------------------------------------------------
Point2D.prototype.setPlace = function(x, y){
  this.x = x;
  this.y = y;
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Point2D.prototype.distance = function(point){
  let distance2D = this.minus(point);
  return Math.sqrt(Math.pow(distance2D.x, 2) + Math.pow(distance2D.y, 2));
};
// --------------------------------------------------------------------------------
Point2D.prototype.add = function(point){
  return new Point2D(this.x + point.x, this.y + point.y);
};
Point2D.prototype.minus = function(point){
  return new Point2D(this.x - point.x, this.y - point.y);
};
Point2D.prototype.multiply = function(num){
  return new Point2D(this.x * num, this.y * num);
};
Point2D.prototype.division = function(num){
  return new Point2D(this.x / num, this.y / num);
};
// --------------------------------------------------------------------------------
Point2D.prototype.fill = function(ctx, radius, color){
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, radius,0,360, false);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
Point2D.prototype.stroke = function(ctx, radius, lineWidth, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(this.x, this.y, radius, 0, 360, false);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
// ================================================================================
