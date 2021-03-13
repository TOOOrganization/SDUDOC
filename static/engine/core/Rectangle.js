// ================================================================================
// * Rectangle <SDUDOC Engine>
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
// * Rectangle
// --------------------------------------------------------------------------------
function Rectangle(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Rectangle.prototype._x = 0;
Rectangle.prototype._y = 0;
Rectangle.prototype._width = 0;
Rectangle.prototype._height = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Rectangle.prototype.initialize = function(x, y ,width, height){
  this._x = x;
  this._y = y;
  this._width = width;
  this._height = height;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Rectangle.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(value) {
    this._x = value;
  },
  configurable: true
});
Object.defineProperty(Rectangle.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(value) {
    this._y = value;
  },
  configurable: true
});
Object.defineProperty(Rectangle.prototype, 'width', {
  get: function() {
    return this._width;
  },
  set: function(value) {
    this._width = value;
  },
  configurable: true
});
Object.defineProperty(Rectangle.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(value) {
    this._height = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Rectangle.prototype.setPlace = function(x, y){
  this._x = x;
  this._y = y;
};
Rectangle.prototype.setSize = function(width, height){
  this._width = width;
  this._height = height;
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Rectangle.prototype.fill = function(ctx, color){
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(this._x, this._y, this._width, this._height);
  ctx.restore();
};
Rectangle.prototype.stroke = function(ctx, lineWidth, color){
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(this._x, this._y, this._width, this._height);
  ctx.restore();
};
// --------------------------------------------------------------------------------
Rectangle.prototype.clear = function(ctx){
  ctx.clearRect(this._x, this._y, this._width, this._height);
};
Rectangle.prototype.drawImage = function(ctx, image){
  ctx.drawImage(image, this._x, this._y, this._width, this._height);
};
// ================================================================================
