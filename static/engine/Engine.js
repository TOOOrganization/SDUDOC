// ================================================================================
// * SDUDOC Engine
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Core of SDUDOC Engine.
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/11 - Version 1.0.1
//     - Decoupling functions to plugins.
// --------------------------------------------------------------------------------
//   Update history:
//   2020/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================




// ================================================================================
// * DocData
// ================================================================================
function DocData(){
  this.initialize.apply(this, arguments);
}

DocData.prototype.data = null;
DocData.prototype.point_size = 0;
DocData.prototype.line_size = 0;

DocData.prototype.initialize = function(){
  this.clear();
};
DocData.prototype.clear = function(){
  this.data = { points : {}, lines : {} };
  this.point_size = 0;
  this.line_size = 0;
};
DocData.prototype.generatePointIndex = function(){
  return String(this.point_size ++);
};
DocData.prototype.generateLineIndex = function(){
  return String(this.line_size ++);
};
DocData.prototype.addPoint = function(x, y){
  let point = new Point(x, y);
  this.data.points[this.generatePointIndex()] = point;
};
DocData.prototype.addLine = function(start, end){
  let line = new Line2D(start, end);
  this.data.points[this.generatePointIndex()] = line;
};
DocData.prototype.draw = function(ctx, grid){
  for(let i in this.data.points){
    //this.data.points[i].fill(ctx, grid, 5, 2, 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 255, 1)');
  }
};
// ================================================================================
// * Engine
// ================================================================================
function Engine(){
  this.initialize.apply(this, arguments);
}

Engine.prototype.canvas = null;
Engine.prototype.ctx = null;
Engine.prototype.canvas_rect = null;

Engine.prototype.image = null;
Engine.prototype.image_src = null;
Engine.prototype.image_rect = null;

Engine.prototype.grid = null;
Engine.prototype.doc_data = null;

Engine.prototype.origin = null;
Engine.prototype.scale = 1;

Engine.prototype.initialize = function(){
  Input.setEngine(this);

  this.canvas_rect = new Rectangle(0, 0, 0, 0);
  this.image_rect = new Rectangle(0, 0, 0, 0);
  this.origin = new Point(0, 0);

  this.grid = new Grid();
  this.grid.setEngine(this);

  this.doc_data = new DocData();
};
Engine.prototype.setCanvas = function(canvas){
  this.canvas = canvas;
  Input.setTarget(this.canvas);

  this.ctx = this.canvas.getContext("2d");
  this.canvas_rect = this.calcCanvasRectangle();

  this.refresh();
};
Engine.prototype.calcCanvasRectangle = function(){
  return new Rectangle(0, 0, this.canvas.width, this.canvas.height);
};
Engine.prototype.setImage = async function(src){
  if(!src) return;
  await this.loadImage(src);
  this.setScale(this.calcImageScale());
  this.setOrigin(this.calcImageOrigin());
  this.refresh();
};
Engine.prototype.loadImage = function(src){
  let that = this;
  return new Promise((resolve) => {
    that.image = new Image();
    that.image.src = src;
    that.image.onload = () => {
      resolve();
    }
  });
};
Engine.prototype.calcImageScale = function(){
  let iw = this.image.width;
  let ih = this.image.height;
  let cw = this.canvas_rect.width;
  let ch = this.canvas_rect.height;
  let w = (ih / iw > ch / cw) ? iw * (ch / ih) : cw;
  return w / iw;
};
Engine.prototype.calcImageOrigin = function(){
  let iw = this.image.width;
  let ih = this.image.height;
  let cw = this.canvas_rect.width;
  let ch = this.canvas_rect.height;
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
Engine.prototype.calcImageRectangle = function(){
  let iw = this.image.width;
  let ih = this.image.height;
  let w = iw * this.scale;
  let h = ih * this.scale;
  return new Rectangle(this.origin.x, this.origin.y, w, h);
};
Engine.prototype.setScale = function(scale){
  this.scale = scale;
  this.refresh();
};
Engine.prototype.setOrigin = function(origin){
  this.origin = origin;
  this.refresh();
};
Engine.prototype.addScale = function(scale){
  this.setScale(Math.max(0.05, Math.min(this.scale + scale, 5)));
};
Engine.prototype.multiScale = function(scale){
  this.setScale(Math.max(0.05, Math.min(this.scale * scale, 5)));
};
Engine.prototype.moveOrigin = function(x, y){
  this.setOrigin(new Point(this.origin.x + x, this.origin.y + y));
};
Engine.prototype.refresh = function(){
  if(this.canvas){
    this.canvas_rect = this.calcCanvasRectangle();
    this.canvas_rect.clear(this.ctx);
    this.canvas_rect.fill(this.ctx, 'rgba(0, 0, 0, 0.1)');
  }
  if(this.image){
    this.image_rect = this.calcImageRectangle();
    this.image_rect.drawImage(this.ctx, this.image);
  }
  if(this.grid){
    this.grid.draw(this.ctx);
  }
  if(this.doc_data){
    this.doc_data.draw(this.ctx, this.grid);
  }
};
