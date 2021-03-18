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
Polygon.prototype._points = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Polygon.prototype.initialize = function(points){
  this._points = points;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Polygon.prototype, 'points', {
  get: function() {
    return this._points;
  },
  set: function(value) {
    this._points = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Polygon.prototype.fillCanvas = function(ctx, color){
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points[i] = Graphics.getRenderPoint(this._points[i]);
  }
  this.fill(ctx, color, new Polygon(points));
};
Polygon.prototype.strokeCanvas = function(ctx, lineWidth, color) {
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points[i] = Graphics.getRenderPoint(this._points[i]);
  }
  this.stroke(ctx, lineWidth, color, new Polygon(points));
}
Polygon.prototype.fillSelf = function(ctx, color){
  this.fill(ctx, color, this);
};
Polygon.prototype.strokeSelf = function(ctx, lineWidth, color) {
  this.stroke(ctx, lineWidth, color, this);
};
Polygon.prototype.fill = function(ctx, color, polygon){
  let points = polygon.points;

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for(let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
Polygon.prototype.stroke = function(ctx, lineWidth, color, polygon){
  let points = polygon.points;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for(let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};
// ================================================================================
