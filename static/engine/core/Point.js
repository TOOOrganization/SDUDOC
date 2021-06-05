// ================================================================================
// * Point <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Point
// --------------------------------------------------------------------------------
function Point(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Point.prototype._x = 0;
Point.prototype._y = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Point.prototype.initialize = function(x, y){
  this._x = x;
  this._y = y;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Point.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(value) {
    this._x = value;
  },
  configurable: true
});
Object.defineProperty(Point.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(value) {
    this._y = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Point.prototype.setPlace = function(x, y){
  this._x = x;
  this._y = y;
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Point.prototype.distance = function(point){
  let distance2D = this.minus(point);
  return Math.sqrt(Math.pow(distance2D.x, 2) + Math.pow(distance2D.y, 2));
};
// --------------------------------------------------------------------------------
Point.prototype.add = function(point){
  return new Point(this.x + point.x, this.y + point.y);
};
Point.prototype.minus = function(point){
  return new Point(this.x - point.x, this.y - point.y);
};
Point.prototype.multiply = function(num){
  return new Point(this.x * num, this.y * num);
};
Point.prototype.division = function(num){
  return new Point(this.x / num, this.y / num);
};
// ================================================================================
