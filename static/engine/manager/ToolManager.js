// ================================================================================
// * ToolManager <SDUDOC Engine>
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
// * ToolManager
// --------------------------------------------------------------------------------
function ToolManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
ToolManager._tools = [];
ToolManager._handlers = {};
ToolManager._current_plugin = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
ToolManager.initialize = function() {
  this.clear();
  this._setupEventHandlers();
};
ToolManager.clear = function() {
  this._current_plugin = this.getInitialPlugin().id;
};
ToolManager._setupEventHandlers = function(){
  MouseInput.addHandler(new Handler("ToolManager.leftClick", "left_click", false, this, (event) => {
    this._processHandler.call(this, event, "left_click")}));
  MouseInput.addHandler(new Handler("ToolManager.middleClick", "middle_click", false, this, (event) => {
    this._processHandler.call(this, event, "middle_click")}));
  MouseInput.addHandler(new Handler("ToolManager.rightClick", "right_click", false, this, (event) => {
    this._processHandler.call(this, event, "right_click")}));
  MouseInput.addHandler(new Handler("ToolManager.leftDoubleClick", "left_double_click", false, this, (event) => {
    this._processHandler.call(this, event, "left_double_click")}));
  MouseInput.addHandler(new Handler("ToolManager.middleDoubleClick", "middle_double_click", false, this, (event) => {
    this._processHandler.call(this, event, "middle_double_click")}));
  MouseInput.addHandler(new Handler("ToolManager.rightDoubleClick", "right_double_click", false, this, (event) => {
    this._processHandler.call(this, event, "right_double_click")}));
  MouseInput.addHandler(new Handler("ToolManager.leftDown", "left_down", false, this, (event) => {
    this._processHandler.call(this, event, "left_down")}));
  MouseInput.addHandler(new Handler("ToolManager.middleDown", "middle_down", false, this, (event) => {
    this._processHandler.call(this, event, "middle_down")}));
  MouseInput.addHandler(new Handler("ToolManager.rightDown", "right_down", false, this, (event) => {
    this._processHandler.call(this, event, "right_down")}));
  MouseInput.addHandler(new Handler("ToolManager.leftUp", "left_up", false, this, (event) => {
    this._processHandler.call(this, event, "left_up")}));
  MouseInput.addHandler(new Handler("ToolManager.middleUp", "middle_up", false, this, (event) => {
    this._processHandler.call(this, event, "middle_up")}));
  MouseInput.addHandler(new Handler("ToolManager.rightUp", "right_up", false, this, (event) => {
    this._processHandler.call(this, event, "right_up")}));

  MouseInput.addHandler(new Handler("ToolManager.mouseMove", "mousemove", false, this, (event) => {
    this._processHandler.call(this, event, "mousemove")}));
  MouseInput.addHandler(new Handler("ToolManager.mouseOver", "mouseover", false, this, (event) => {
    this._processHandler.call(this, event, "mouseover")}));
  MouseInput.addHandler(new Handler("ToolManager.mouseOut", "mouseout", false, this, (event) => {
    this._processHandler.call(this, event, "mouseout")}));
  MouseInput.addHandler(new Handler("ToolManager.wheel", "wheel", false, this, (event) => {
    this._processHandler.call(this, event, "wheel")}));

  Input.addHandler(new Handler("ToolManager.keyClick", "key_click", 'all', this, (event) => {
    this._processHandler.call(this, event, "key_click")}));
  Input.addHandler(new Handler("ToolManager.keyHold", "key_hold", 'all', this, (event) => {
    this._processHandler.call(this, event, "key_hold")}));
  Input.addHandler(new Handler("ToolManager.keyLongHold", "key_long_hold", 'all', this, (event) => {
    this._processHandler.call(this, event, "key_long_hold")}));
  Input.addHandler(new Handler("ToolManager.keyDown", "key_down", 'all', this, (event) => {
    this._processHandler.call(this, event, "key_down")}));
  Input.addHandler(new Handler("ToolManager.keyUp", "key_up", 'all', this, (event) => {
    this._processHandler.call(this, event, "key_up")}));
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
ToolManager._processHandler = function(event, type){
  if(!this._current_plugin) return;
  switch (type){
    case 'left_click':
    case 'middle_click':
    case 'right_click':
    case 'left_double_click':
    // case 'middle_double_click':
    // case 'right_double_click':
    case 'left_down':
    case 'middle_down':
    case 'right_down':
    case 'left_up':
    case 'middle_up':
    case 'right_up':
    case 'mousemove':
    case 'mouseover':
    case 'mouseout':
    case 'wheel':this.callMouseHandler(event, type);break;
    case 'key_click':
    case 'key_hold':
    case 'key_long_hold':
    case 'key_down':
    case 'key_up':this.callKeyHandler(event, type);break;
  }
}
ToolManager.callMouseHandler = function(event, type){
  for(let i in this._handlers){
    if(this._handlers[i].type === type &&
      (this._handlers[i].id.startsWith('_') || this._handlers[i].id.startsWith(this.getCurrentPlugin().id))){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
}
ToolManager.callKeyHandler = function(event, type){
  for(let i in this._handlers){
    if(this._handlers[i].type === type && this._handlers[i].key_code === Input.getKeyCode(event.keyCode)
      && (this._handlers[i].id.startsWith('_') || this._handlers[i].id.startsWith(this.getCurrentPlugin().id))){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
}
// --------------------------------------------------------------------------------
ToolManager.addTool = function(tool){
  this._tools.push(tool);
}
ToolManager.addHandler = function(handler){
  this._handlers[handler.id] = handler;
};
ToolManager.removeHandler = function(id){
  this._handlers.remove(id);
};
// --------------------------------------------------------------------------------
ToolManager.getToolList = function(type){
  let data = [];
  for(let i in this._tools){
    if(this._tools[i].type === type){
      data.push({
        id: this._tools[i].id,
        tooltip: this._tools[i].tooltip,
        icon: this._tools[i].icon,
        description: this._tools[i].description,
        callback: this._tools[i].callback
      })
    }
  }
  return data;
}
ToolManager.getInitialPlugin = function(){
  let list = this.getToolList(Tool.Type.PLUGIN);
  if(list.length === 0) return {id: null};
  return list[0];
}
ToolManager.getCurrentPlugin = function(){
  let list = this.getToolList(Tool.Type.PLUGIN);
  for(let i in list){
    if(list[i].id === this._current_plugin){
      return list[i];
    }
  }
}
ToolManager.setCurrentPlugin = function(id){
  let list = this.getToolList(Tool.Type.PLUGIN);
  for(let i in list){
    if(list[i].id === id){
      this._current_plugin = list[i].id;
      Engine.owner.current_plugin = i;
    }
  }
  Graphics.refresh();
}
// ================================================================================
