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
Rectangle.prototype.x = 0;
Rectangle.prototype.y = 0;
Rectangle.prototype.width = 0;
Rectangle.prototype.height = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Rectangle.prototype.initialize = function(x, y ,width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
};
// --------------------------------------------------------------------------------
// * Setter
// --------------------------------------------------------------------------------
Rectangle.prototype.setPlace = function(x, y){
  this.x = x;
  this.y = y;
};
Rectangle.prototype.setSize = function(width, height){
  this.width = width;
  this.height = height;
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Rectangle.prototype.fill = function(ctx, color){
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
  ctx.restore();
};
Rectangle.prototype.stroke = function(ctx, lineWidth, color){
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(this.x, this.y, this.width, this.height);
  ctx.restore();
};
// --------------------------------------------------------------------------------
Rectangle.prototype.clear = function(ctx){
  ctx.clearRect(this.x, this.y, this.width, this.height);
};
Rectangle.prototype.drawImage = function(ctx, image){
  ctx.drawImage(image, this.x, this.y, this.width, this.height);
};
// ================================================================================
