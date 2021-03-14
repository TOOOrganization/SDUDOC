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
  let place = Graphics.getPoint(MouseInput.getMousePoint());
}.bind(Engine)));
MouseInput.addHandler(new Handler("Input.onMouseMove", "mousemove", false, Engine, function(event){
  if(MouseInput.isPressed(MouseInput.Mouse.LEFT)) {
    let distance = new Point(event.layerX, event.layerY).minus(MouseInput.getMousePoint());
    Graphics.moveOrigin(distance.x, distance.y);
  }
}.bind(Engine)));
MouseInput.addHandler(new Handler("Input.onMouseWheel", "wheel", false, Engine, function(event){
  let scale = 1 - event.deltaY / 1200;
  let distance = new Point(event.layerX, event.layerY).minus(Graphics.origin).multiply(1 - scale);
  Graphics.moveOrigin(distance.x, distance.y)
  Graphics.multiScale(scale);
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

Engine.initialize = function(){
  this.canvas_rect = new Rectangle(0, 0, 0, 0);
  this.image_rect = new Rectangle(0, 0, 0, 0);
  this.origin = new Point(0, 0);

  this.doc_data = new DocData();
};
