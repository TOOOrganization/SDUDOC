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
// * Engine
// ================================================================================
function Engine(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Engine.initialize = function(){
  this.createHandler();

  Graphics.initialize();
  MouseInput.initialize();
  Input.initialize();
};
Engine.setCanvas = function(canvas, element){
  Graphics.setCanvas(canvas, element);
  MouseInput.setupTargetHandlers(canvas);
};
Engine.createHandler = function(){
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
    let oldScale = Graphics.scale;
    Graphics.multiScale(scale);
    let real_scale = Graphics.scale / oldScale;
    let distance = new Point(event.layerX, event.layerY).minus(Graphics.origin).multiply(1 - real_scale);
    Graphics.moveOrigin(distance.x, distance.y)
  }.bind(Engine)));

  Input.addHandler(new Handler("Input", "keydown", "M", Engine, function(event){
    console.log(event)
  }.bind(Engine)));
};
// ================================================================================
