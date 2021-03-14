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
/*
MouseInput.addHandler(new Handler("testEngine1", "mousemove", true, Engine, function(event){
  console.log(MouseInput.getMousePoint(), MouseInput.isOver());
}.bind(this)))
MouseInput.addHandler(new Handler("testEngine", "mousemove", false, Engine, function(event){
  console.log(MouseInput.getMousePoint(), MouseInput.isOver());
}.bind(this)))*/

MouseInput.addHandler(new Handler("Input.onMouseDown", "leftdown", false, Engine, function(event){
  let place = Engine.grid.getPoint(MouseInput.getMousePoint());
  Engine.doc_data.addPoint(place.x, place.y);
}.bind(Engine)));
MouseInput.addHandler(new Handler("Input.onMouseMove", "mousemove", false, Engine, function(event){
  if(MouseInput.isPressed(MouseInput.Mouse.LEFT)) {
    let distance = new Point(event.layerX, event.layerY).minus(MouseInput.getMousePoint());
    Engine.moveOrigin(distance.x, distance.y);
  }
}.bind(Engine)));
MouseInput.addHandler(new Handler("Input.onMouseWheel", "wheel", false, Engine, function(event){
  let scale = 1 - event.deltaY / 1200;
  let distance = new Point(event.layerX, event.layerY).minus(Engine.origin).multiply(1 - scale);
  Engine.moveOrigin(distance.x, distance.y)
  Engine.multiScale(scale);
}.bind(Engine)));

Input.addHandler(new Handler("Input", "keydown", "M", Engine, function(event){
  console.log(event)
}.bind(Engine)));
// ================================================================================
// * Engine
// ================================================================================
function Engine(){
  throw new Error('This is a static class');
}

Engine.canvas = null;
Engine.ctx = null;
Engine.canvas_rect = null;

Engine.image = null;
Engine.image_src = null;
Engine.image_rect = null;

Engine.grid = null;
Engine.doc_data = null;

Engine.origin = null;
Engine.scale = 1;

Engine.initialize = function(){
  this.canvas_rect = new Rectangle(0, 0, 0, 0);
  this.image_rect = new Rectangle(0, 0, 0, 0);
  this.origin = new Point(0, 0);

  this.grid = new Grid();
  this.grid.setEngine(this);

  this.doc_data = new DocData();
};
Engine.setCanvas = function(canvas){
  this.canvas = canvas;
  //Input.setTarget(this.canvas);

  this.ctx = this.canvas.getContext("2d");
  this.canvas_rect = this.calcCanvasRectangle();

  this.refresh();
};
Engine.calcCanvasRectangle = function(){
  return new Rectangle(0, 0, this.canvas.width, this.canvas.height);
};
Engine.setImage = async function(src){
  if(!src) return;
  await this.loadImage(src);
  this.setScale(this.calcImageScale());
  this.setOrigin(this.calcImageOrigin());
  this.refresh();
};
Engine.loadImage = function(src){
  let that = this;
  return new Promise((resolve) => {
    that.image = new Image();
    that.image.src = src;
    that.image.onload = () => {
      resolve();
    }
  });
};
Engine.calcImageScale = function(){
  let iw = this.image.width;
  let ih = this.image.height;
  let cw = this.canvas_rect.width;
  let ch = this.canvas_rect.height;
  let w = (ih / iw > ch / cw) ? iw * (ch / ih) : cw;
  return w / iw;
};
Engine.calcImageOrigin = function(){
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
Engine.calcImageRectangle = function(){
  let iw = this.image.width;
  let ih = this.image.height;
  let w = iw * this.scale;
  let h = ih * this.scale;
  return new Rectangle(this.origin.x, this.origin.y, w, h);
};
Engine.setScale = function(scale){
  this.scale = scale;
  this.refresh();
};
Engine.setOrigin = function(origin){
  this.origin = origin;
  this.refresh();
};
Engine.addScale = function(scale){
  this.setScale(Math.max(0.05, Math.min(this.scale + scale, 5)));
};
Engine.multiScale = function(scale){
  this.setScale(Math.max(0.05, Math.min(this.scale * scale, 5)));
};
Engine.moveOrigin = function(x, y){
  this.setOrigin(new Point(this.origin.x + x, this.origin.y + y));
};
Engine.refresh = function(){
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
