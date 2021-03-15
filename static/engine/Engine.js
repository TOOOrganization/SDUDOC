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

  this.createTool();
};
Engine.setElements = function(canvas, element, owner){
  this._owner = owner;
  Graphics.setCanvas(canvas, element);
  MouseInput.setupTargetHandlers(canvas);
};
Engine.createHandler = function(){
  MouseInput.addHandler(new Handler("Input.onMouseDown", "leftdown", false, Engine, function(event){
    let place = Graphics.getGridPoint(MouseInput.getMousePoint());
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
};
Engine.createTool = function(){
  ToolManager.addTool(new Tool("新建文档", "mdi-file-plus-outline", Tool.Type.DOCUMENT, "", function(){
    Engine.confirm("您真的要新建文档吗？未保存的数据将全部丢失。", function(){
      Engine.owner.confirm_dialog = false;
      DocumentManager.newDocument();
    });
  }));
  ToolManager.addTool(new Tool("打开文档", "mdi-file-multiple-outline", Tool.Type.DOCUMENT, "", function(){

  }));
  ToolManager.addTool(new Tool("保存", "mdi-content-save", Tool.Type.DOCUMENT, "", function(){

  }));

  ToolManager.addTool(new Tool("撤销(Ctrl+Z)", "mdi-undo-variant", Tool.Type.HISTORY, "", function(){

  }));
  ToolManager.addTool(new Tool("重做(Ctrl+Y)", "mdi-redo-variant", Tool.Type.HISTORY, "", function(){

  }));
  ToolManager.addTool(new Tool("复制(Ctrl+C)", "mdi-content-copy", Tool.Type.HISTORY, "", function(){

  }));
  ToolManager.addTool(new Tool("粘贴(Ctrl+V)", "mdi-clipboard-file-outline", Tool.Type.HISTORY, "", function(){

  }));

  ToolManager.addTool(new Tool("移动工具", "mdi-arrow-all", Tool.Type.PLUGIN, "", function(){

  }));
  ToolManager.addTool(new Tool("点工具", "mdi-circle-medium", Tool.Type.PLUGIN, "", function(){

  }));
  ToolManager.addTool(new Tool("线工具", "mdi-ray-start-end", Tool.Type.PLUGIN, "", function(){

  }));
  ToolManager.addTool(new Tool("剪切工具", "mdi-scissors-cutting", Tool.Type.PLUGIN, "", function(){

  }));
  ToolManager.addTool(new Tool("文字工具", "mdi-alpha-a", Tool.Type.PLUGIN, "", function(){

  }));
  ToolManager.addTool(new Tool("注释工具", "mdi-tooltip-plus-outline", Tool.Type.PLUGIN, "", function(){

  }));


}
// --------------------------------------------------------------------------------
Engine.createInputBox = function(){
  this._input = document.createElement('input');
  this._input.setAttribute('accept', 'image/*');
  this._input.setAttribute('id','open_image');
  this._input.setAttribute('type','file');
  this._input.setAttribute("style",'visibility:hidden; display:none');
  this._input._reader = new FileReader();
  this._input.addEventListener('change', function(event){
    this._reader.readAsDataURL(event.target.files[0]);
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
    this._input._reader.onload = function(event){
      callback.call(owner, event.target.result);
      resolve();
    }
    this._input.click();
  });
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Engine.confirm = function(text, callback){
  Engine.owner.confirm_text = text;
  Engine.owner.confirm_callback = callback;
  Engine.owner.confirm_dialog = true;
}
// ================================================================================
