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
// --------------------------------------------------------------------------------
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
Line.prototype.getEndpointDots = function(point, k, radius){
  let b = Math.sqrt(k * k + 1);
  let x1 = (point.x * b - radius)/b;
  let x2 = (point.x * b + radius)/b;
  let y1 = k * (x1 - point.x) + point.y;
  let y2 = k * (x2 - point.x) + point.y;
  return [new Point(x1, y1), new Point(x2, y2)];
}
Line.prototype.getDrawPolygon = function(radius){
  if(Math.abs(this._start.y - this._end.y) < 0.01){
    return new Polygon([new Point(this._start.x, this._start.y + radius), new Point(this._start.x, this._start.y - radius),
      new Point(this._end.x, this._end.y - radius), new Point(this._end.x, this._end.y + radius)]);
  }else if(Math.abs(this._start.x - this._end.x) < 0.01){
    return new Polygon([new Point(this._start.x + radius, this._start.y), new Point(this._start.x - radius, this._start.y), radius,
      new Point(this._end.x - radius, this._end.y), new Point(this._end.x + radius, this._end.y)]);
  }
  let k = -1 / ((this._end.y - this._start.y)/(this._end.x - this._start.x));
  let dot1 = this.getEndpointDots(this._start, k, radius);
  let dot2 = this.getEndpointDots(this._end, k, radius);
  return new Polygon([dot1[0], dot1[1], dot2[1], dot2[0]]);
};
// ================================================================================
