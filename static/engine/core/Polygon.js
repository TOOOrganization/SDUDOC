// ================================================================================
// * Polygon <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/12 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Polygon
// --------------------------------------------------------------------------------
function Polygon(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Polygon.prototype.points = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Polygon.prototype.initialize = function(points){
  this.points = points;
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Polygon.prototype.fill = function(ctx, color){
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(this.points[0].x, this.points[0].y);
  for(let i = 1; i < this.points.length; i++) {
    ctx.lineTo(this.points[i].x, this.points[i].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
Polygon.prototype.stroke = function(ctx, lineWidth, color){
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(this.points[0].x, this.points[0].y);
  for(let i = 1; i < this.points.length; i++) {
    ctx.lineTo(this.points[i].x, this.points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};
// ================================================================================
