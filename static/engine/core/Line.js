// ================================================================================
// * Line <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/13 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Line
// ================================================================================
function Line(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Line.prototype._start = "";
Line.prototype._end = "";
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Line.prototype.initialize = function(start, end){
  this._start = start;
  this._end = end;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Line.prototype, 'start', {
  get: function() {
    return this._start;
  },
  set: function(value) {
    this._start = value;
  },
  configurable: true
});
Object.defineProperty(Line.prototype, 'end', {
  get: function() {
    return this._end;
  },
  set: function(value) {
    this._end = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Line.prototype.getDrawPolygon = function(radius, start, end){
  let r = start.distance(end);
  let dx = end.x - start.x;
  let dy = end.y - start.y;
  let sx = dy * radius / r;
  let sy = dx * radius / r;
  let data = [];
  data.push(new Point(start.x - sx, start.y - sy));
  data.push(new Point(start.x + sx, start.y + sy));
  data.push(new Point(end.x + sx, end.y + sy));
  data.push(new Point(end.x - sx, end.y - sy));
  return new Polygon(data);
};
// --------------------------------------------------------------------------------
Line.prototype.fillCanvas = function(ctx, radius, color){
  let start = SDUDocument.data["Dot2D"][this._start];
  let end = SDUDocument.data["Dot2D"][this._end];
  this.fill(ctx, radius, color, Graphics.getRenderPoint(start), Graphics.getRenderPoint(end));
};
Line.prototype.strokeCanvas = function(ctx, radius, lineWidth, color) {
  let start = SDUDocument.data["Dot2D"][this._start];
  let end = SDUDocument.data["Dot2D"][this._end];
  this.stroke(ctx, radius, lineWidth, color, Graphics.getRenderPoint(start), Graphics.getRenderPoint(end));
}
Line.prototype.fillSelf = function(ctx, radius, color){
  this.fill(ctx, radius, color, this._start, this._end);
};
Line.prototype.strokeSelf = function(ctx, radius, lineWidth, color) {
  this.stroke(ctx, radius, color, this._start, this._end);
}
Line.prototype.fill = function(ctx, radius, color, start, end){
  this.getDrawPolygon(radius, start, end).fillSelf(ctx, color);
};
Line.prototype.stroke = function(ctx, radius, lineWidth, color, start, end) {
  this.getDrawPolygon(radius, start, end).strokeSelf(ctx, lineWidth, color);
}
// ================================================================================
