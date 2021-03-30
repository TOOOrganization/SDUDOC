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
// * Property
// --------------------------------------------------------------------------------
Engine._input = null;
Engine._owner = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Engine.initialize = function(){
  this.createHandler();
  this.createInputBox();

  Graphics.initialize();
  MouseInput.initialize();
  Input.initialize();

  SDUDocument.initialize();
  DocumentManager.initialize();

  RenderManager.initialize();
  ToolManager.initialize();
};
Engine.setElements = function(canvas, element, owner){
  this._owner = owner;
  Graphics.setCanvas(canvas, element);
  MouseInput.setupTargetHandlers(canvas);
};
Engine.createHandler = function(){
  MouseInput.addHandler(new Handler("engine.onMouseMove", "mousemove", false, Engine, function(event){
    if(MouseInput.isPressed(MouseInput.Mouse.MIDDLE)) {
      let distance = new Point(event.layerX, event.layerY).minus(MouseInput.getMousePoint());
      Graphics.moveOrigin(distance.x, distance.y);
    }
  }));
  MouseInput.addHandler(new Handler("engine.onMouseWheel", "wheel", false, Engine, function(event){
    let scale = 1 - event.deltaY / 1200;
    let oldScale = Graphics.scale;
    Graphics.multiScale(scale);
    let real_scale = Graphics.scale / oldScale;
    let distance = new Point(event.layerX, event.layerY).minus(Graphics.origin).multiply(1 - real_scale);
    Graphics.moveOrigin(distance.x, distance.y)
  }));
};
// --------------------------------------------------------------------------------
Engine.createInputBox = function(){
  this._input = document.createElement('input');
  this._input.setAttribute('accept', 'image/*');
  this._input.setAttribute('id','file_input');
  this._input.setAttribute('type','file');
  this._input.setAttribute("style",'visibility:hidden; display:none');
  this._input._reader = new FileReader();
  this._input._filename = null;
  this._input._readAsTest = false;
  this._input.addEventListener('change', function(event){
    this._filename = event.target.files[0];
    if(this._readAsTest){
      this._reader.readAsText(event.target.files[0], "UTF-8")
    }else{
      this._reader.readAsDataURL(event.target.files[0]);
    }
    this.value = null;
  }.bind(this._input));
  document.body.appendChild(this._input);
}
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Engine, 'owner', {
  get: function() {
    return this._owner;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Engine.readImage = function(owner, callback){
  return new Promise((resolve) => {
    this._input.setAttribute('accept', 'image/*');
    this._input._readAsTest = false;
    this._input._reader.onload = function(event){
      callback.call(owner, event.target.result);
      resolve();
    }
    this._input.click();
  });
}
Engine.readJson = function(owner, callback){
  return new Promise((resolve) => {
    this._input.setAttribute('accept', '.sjs');
    this._input._readAsTest = true;
    this._input._reader.onload = function(event){
      console.log(event.target.result)
      callback.call(owner, event.target.result, Engine._input.filename);
      resolve();
    }
    this._input.click();
  });
}
Engine.saveFile = function(filename, content){
  const blob = new Blob([content], {type: 'text/plain;charset=UTF-8'})
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    let aTag = document.createElement('a');
    aTag.download = filename;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(aTag.href);
  }
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Engine.alert = function(title, callback){
  Engine.owner.pop_title = title;
  Engine.owner.pop_callback = callback;
  Engine.owner.alert_dialog = true;
}
Engine.prompt = function(title, tooltip, default_text, callback){
  Engine.owner.pop_title = title;
  Engine.owner.prompt_tooltip = tooltip;
  Engine.owner.prompt_text = default_text;
  Engine.owner.pop_callback = callback;
  Engine.owner.prompt_dialog = true;
}
// ================================================================================
