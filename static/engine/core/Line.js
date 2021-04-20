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
Line.prototype.getDot = function(x, y, k, r){
  let b = Math.sqrt(k * k + 1);
  let x1 = (x * b - r)/b;
  let x2 = (x * b + r)/b;
  let y1 = k * (x1 - x) + y;
  let y2 = k * (x2 - x) + y;
  return [new Point(x1, y1), new Point(x2, y2)];
}
Line.prototype.getDrawPolygon = function(radius, start, end){
  if(Math.abs(start.y - end.y) < 0.01){
    return new Polygon([new Point(start.x, start.y + radius), new Point(start.x, start.y - radius), radius,
      new Point(end.x, end.y - radius), new Point(end.x, end.y + radius)]);
  }else if(Math.abs(start.x - end.x) < 0.01){
    return new Polygon([new Point(start.x + radius, start.y), new Point(start.x - radius, start.y), radius,
      new Point(end.x - radius, end.y), new Point(end.x + radius, end.y)]);
  }
  let k = -1 / ((end.y - start.y)/(end.x - start.x));
  let dot1 = this.getDot(start.x, start.y, k, radius);
  let dot2 = this.getDot(end.x, end.y, k, radius);
  return new Polygon([dot1[0], dot1[1], dot2[1], dot2[0]]);
};
// --------------------------------------------------------------------------------
Line.prototype.fillCanvas = function(ctx, radius, color){
  let start = SDUDocument.getCurrentPageElement("Dot2D", this._start);
  let end = SDUDocument.getCurrentPageElement("Dot2D", this._end);
  this.fill(ctx, radius, color, Graphics.getRenderPoint(start), Graphics.getRenderPoint(end));
};
Line.prototype.strokeCanvas = function(ctx, radius, lineWidth, color) {
  let start = SDUDocument.getCurrentPageElement("Dot2D", this._start);
  let end = SDUDocument.getCurrentPageElement("Dot2D", this._end);
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
