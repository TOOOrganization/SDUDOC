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
Line.prototype._start = null;
Line.prototype._end = null;
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
Line.prototype.getDrawPolygon = function(width){
  let r = this._start.distance(this._end);
  let dx = this._end.x = this._start.x;
  let dy = this._end.y = this._start.y;
  let sx = dy * width / r;
  let sy = dx * width / r;
  let data = [];
  data.push(new Point(this._start.x - sx, this._start.y - sy));
  data.push(new Point(this._start.x + sx, this._start.y + sy));
  data.push(new Point(this._end.x + sx, this._end.y + sy));
  data.push(new Point(this._end.x - sx, this._end.y - sy));
  return new Polygon(data);
};
// --------------------------------------------------------------------------------
Line.prototype.fill = function(ctx, width, color){
  this.getDrawPolygon.fill(ctx, color);
};
Line.prototype.stroke = function(ctx, width, lineWidth, color){
  this.getDrawPolygon.stroke(ctx, lineWidth, color);
};
// ================================================================================
