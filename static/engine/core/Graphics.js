// ================================================================================
// * Graphics <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/14 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Graphics
// --------------------------------------------------------------------------------
function Graphics(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Graphics.PER_UNIT_LENGTH = 12.5;
Graphics.GRID_LIMIT = 100;
// --------------------------------------------------------------------------------
Graphics._canvas = null;
Graphics._element = null;
Graphics._ctx = null;
Graphics._canvas_rect = null;
// --------------------------------------------------------------------------------
Graphics._image = null;
Graphics._image_src = null;
Graphics._image_rect = null;
// --------------------------------------------------------------------------------
Graphics._origin = null;
Graphics._scale = 1;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Graphics.initialize = function(){
  this.clear();
};
Graphics.clear = function(){
  this._canvas = null;
  this._element = null;
  this._ctx = null;
  this._canvas_rect = new Rectangle(0, 0, 0, 0);
  this.reset();
};
Graphics.reset = function(){
  this._image = null;
  this._image_src = null;
  this._image_rect = new Rectangle(0, 0, 0, 0);
  this.calcInitialOrigin();
  this._scale = 1;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Graphics, 'origin', {
  get: function() {
    return this._origin;
  },
  set: function(value) {
    this._origin = value;
  },
  configurable: true
});
Object.defineProperty(Graphics, 'scale', {
  get: function() {
    return this._scale;
  },
  set: function(value) {
    this._scale = value;
  },
  configurable: true
});
Object.defineProperty(Graphics, 'canvas', {
  get: function() {
    return this._canvas;
  },
  set: function(value) {
    this._canvas = value;
  },
  configurable: true
});
Object.defineProperty(Graphics, 'ctx', {
  get: function() {
    return this._ctx;
  },
  set: function(value) {
    this._ctx = value;
  },
  configurable: true
});
Object.defineProperty(Graphics, 'canvas_rect', {
  get: function() {
    return this._canvas_rect;
  },
  set: function(value) {
    this._canvas_rect = value;
  },
  configurable: true
});
Object.defineProperty(Graphics, 'image_rect', {
  get: function() {
    return this._image_rect;
  },
  set: function(value) {
    this._image_rect = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Graphics.setCanvas = function(canvas, element){
  this.addCanvasHandler(canvas);

  this._canvas = canvas;
  this._element = element;
  this._ctx = this._canvas.getContext("2d");

  this.refreshCanvas();
};
Graphics.setImage = async function(src){
  if(!src) return this.clearImage();
  await this.loadImage(src);
  this.setScale(this.calcImageScale());
  this.setOrigin(this.calcImageOrigin());
  this.refresh();
};
Graphics.clearImage = function(){
  this.reset();
  this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.setScale = function(scale){
  this._scale = scale;
  this.refresh();
};
Graphics.setOrigin = function(origin){
  this._origin = origin;
  this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.getGridPoint = function(point){
  let draw_distance = point.minus(this._origin);
  return draw_distance.division(this._scale);
}
Graphics.getRenderPoint = function(point){
  let draw_distance = point.multiply(this._scale);
  return draw_distance.add(this._origin);
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Graphics.addCanvasHandler = function(canvas){
  window.addEventListener('resize', this.refreshCanvas.bind(this));
};
Graphics.refreshCanvas = function(){
  this._canvas.width = this._element.clientWidth;
  this._canvas.height = this._element.clientHeight;
  this.calcInitialOrigin();
  this.refresh();
};
Graphics.calcCanvasRectangle = function(){
  return new Rectangle(0, 0, this._canvas.width, this._canvas.height);
};
Graphics.calcInitialOrigin = function(){
  if(!this._image){
    if(this._canvas){
      this._origin = new Point(this._canvas.width / 2, this._canvas.height / 2);
    }else{
      this._origin = new Point(0, 0);
    }
  }
};
// --------------------------------------------------------------------------------
Graphics.loadImage = function(src){
  return new Promise((resolve) => {
    Graphics._image = new Image();
    Graphics._image.src = src;
    Graphics._image.onload = () => {
      resolve();
    }
  });
};
Graphics.calcImageScale = function(){
  let iw = this._image.width;
  let ih = this._image.height;
  let cw = this._canvas_rect.width;
  let ch = this._canvas_rect.height;
  let w = (ih / iw > ch / cw) ? iw * (ch / ih) : cw;
  return w / iw;
};
Graphics.calcImageOrigin = function(){
  let iw = this._image.width;
  let ih = this._image.height;
  let cw = this._canvas_rect.width;
  let ch = this._canvas_rect.height;
  let x = 0, y = 0, w = 0, h = 0;
  if(ih / iw > ch / cw){
    w = iw * (ch / ih)
    x = (cw - w)/2;
  }else{
    h = ih * (cw / iw);
    y = (ch - h)/2;
  }
  return new Point(x, y);
};
Graphics.calcImageRectangle = function(){
  let iw = this._image.width;
  let ih = this._image.height;
  let w = iw * this._scale;
  let h = ih * this._scale;
  return new Rectangle(this._origin.x, this._origin.y, w, h);
};
// --------------------------------------------------------------------------------
Graphics.addScale = function(scale){
  this.setScale(Math.max(0.025, Math.min(this._scale + scale, 5)));
};
Graphics.multiScale = function(scale){
  this.setScale(Math.max(0.025, Math.min(this._scale * scale, 5)));
};
Graphics.moveOrigin = function(x, y){
  this.setOrigin(new Point(this._origin.x + x, this._origin.y + y));
};
// --------------------------------------------------------------------------------
Graphics.refresh = function(){
  if(this._canvas){
    this._canvas_rect = this.calcCanvasRectangle();
    this._canvas_rect.clear(this._ctx);
    this._canvas_rect.fillSelf(this._ctx, 'rgba(0, 0, 0, 0.1)');
  }
  if(this._image){
    this._image_rect = this.calcImageRectangle();
    this._image_rect.drawImage(this._ctx, this._image);
  }
  if(this._canvas) {
    this.drawGrid(this._ctx);
    RenderManager.callRenderer(this._ctx);
  }
};
Graphics.drawGrid = function(ctx){
  let scaled_unit = this.PER_UNIT_LENGTH * this._scale;
  let draw_unit = 0;
  let unit_scale = 1;
  if(scaled_unit < this.GRID_LIMIT) {
    for(let i = scaled_unit; i < this.GRID_LIMIT; i *= 2){
      draw_unit = i;
      unit_scale *= 2;
    }
  }else{
    for(let i = scaled_unit; i > this.GRID_LIMIT / 2; i /= 2){
      draw_unit = i;
      unit_scale /= 2;
    }
  }
  let draw_start_x = this._origin.x / draw_unit;
  let draw_start_y = this._origin.y / draw_unit;
  let draw_origin_x = Math.floor(draw_start_x);
  let draw_origin_y = Math.floor(draw_start_y);

  let cw = this._canvas_rect.width;
  let ch = this._canvas_rect.height;

  ctx.fontSize = "10px";
  for(let i = draw_start_x - draw_origin_x; i <= cw / draw_unit; i ++){
    ctx.fillStyle = 'rgba(0, 0, 0, ' + ((Math.floor(i) - draw_origin_x) % 2 === 0 ? 1 : (draw_unit / 10 - 5)) +')';
    ctx.fillRect(i * draw_unit - 0.5, 0, 1, ch);
    let point = Math.round((Math.floor(i) - draw_origin_x) * this.PER_UNIT_LENGTH * unit_scale);
    ctx.fillText(point / 2, i * draw_unit - ctx.measureText(String(point / 2)).width - 3, draw_start_y * draw_unit + 12);
  }
  for(let i = draw_start_y - draw_origin_y; i <= ch / draw_unit; i ++){
    ctx.fillStyle = 'rgba(0, 0, 0, ' + ((Math.floor(i) - draw_origin_y) % 2 === 0 ? 1 : (draw_unit / 10 - 5)) +')';
    ctx.fillRect(0, i * draw_unit - 0.5, cw, 1);
    let point = Math.round((Math.floor(i) - draw_origin_y) * this.PER_UNIT_LENGTH * unit_scale);
    ctx.fillText(point / 2, draw_start_x * draw_unit + 4, i * draw_unit - 4);
  }
};
// ================================================================================
