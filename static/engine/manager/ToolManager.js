// ================================================================================
// * ToolManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/14 - Version 1.0.0
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
ToolManager._tool_list = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
ToolManager.initialize = function() {
  this.clear();
  this._tool_list = this.calcToolList();
  this._setupEventHandlers();
};
ToolManager.initializeEditor = function(editor){
  this.getInitialPlugin().on_click();
}
ToolManager.clear = function() {
  this._current_plugin = this.getInitialPluginId();
};
ToolManager._setupEventHandlers = function(){
  MouseInput.addHandler(new Handler('ToolManager.leftClick', 'left_click', false, this, (event) => {
    this._processHandler.call(this, event, 'left_click')}));
  MouseInput.addHandler(new Handler('ToolManager.middleClick', 'middle_click', false, this, (event) => {
    this._processHandler.call(this, event, 'middle_click')}));
  MouseInput.addHandler(new Handler('ToolManager.rightClick', 'right_click', false, this, (event) => {
    this._processHandler.call(this, event, 'right_click')}));
  MouseInput.addHandler(new Handler('ToolManager.leftDoubleClick', 'left_double_click', false, this, (event) => {
    this._processHandler.call(this, event, 'left_double_click')}));
  MouseInput.addHandler(new Handler('ToolManager.middleDoubleClick', 'middle_double_click', false, this, (event) => {
    this._processHandler.call(this, event, 'middle_double_click')}));
  MouseInput.addHandler(new Handler('ToolManager.rightDoubleClick', 'right_double_click', false, this, (event) => {
    this._processHandler.call(this, event, 'right_double_click')}));
  MouseInput.addHandler(new Handler('ToolManager.leftDown', 'left_down', false, this, (event) => {
    this._processHandler.call(this, event, 'left_down')}));
  MouseInput.addHandler(new Handler('ToolManager.middleDown', 'middle_down', false, this, (event) => {
    this._processHandler.call(this, event, 'middle_down')}));
  MouseInput.addHandler(new Handler('ToolManager.rightDown', 'right_down', false, this, (event) => {
    this._processHandler.call(this, event, 'right_down')}));
  MouseInput.addHandler(new Handler('ToolManager.leftUp', 'left_up', false, this, (event) => {
    this._processHandler.call(this, event, 'left_up')}));
  MouseInput.addHandler(new Handler('ToolManager.middleUp', 'middle_up', false, this, (event) => {
    this._processHandler.call(this, event, 'middle_up')}));
  MouseInput.addHandler(new Handler('ToolManager.rightUp', 'right_up', false, this, (event) => {
    this._processHandler.call(this, event, 'right_up')}));

  MouseInput.addHandler(new Handler('ToolManager.mouseMove', 'mousemove', false, this, (event) => {
    this._processHandler.call(this, event, 'mousemove')}));
  MouseInput.addHandler(new Handler('ToolManager.mouseOver', 'mouseover', false, this, (event) => {
    this._processHandler.call(this, event, 'mouseover')}));
  MouseInput.addHandler(new Handler('ToolManager.mouseOut', 'mouseout', false, this, (event) => {
    this._processHandler.call(this, event, 'mouseout')}));
  MouseInput.addHandler(new Handler('ToolManager.wheel', 'wheel', false, this, (event) => {
    this._processHandler.call(this, event, 'wheel')}));

  Input.addHandler(new Handler('ToolManager.keyClick', 'key_click', 'all', this, (event) => {
    this._processHandler.call(this, event, 'key_click')}));
  Input.addHandler(new Handler('ToolManager.keyHold', 'key_hold', 'all', this, (event) => {
    this._processHandler.call(this, event, 'key_hold')}));
  Input.addHandler(new Handler('ToolManager.keyLongHold', 'key_long_hold', 'all', this, (event) => {
    this._processHandler.call(this, event, 'key_long_hold')}));
  Input.addHandler(new Handler('ToolManager.keyDown', 'key_down', 'all', this, (event) => {
    this._processHandler.call(this, event, 'key_down')}));
  Input.addHandler(new Handler('ToolManager.keyUp', 'key_up', 'all', this, (event) => {
    this._processHandler.call(this, event, 'key_up')}));
};
// --------------------------------------------------------------------------------
// * Handler
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
};
// --------------------------------------------------------------------------------
ToolManager.canCurrentPluginCall = function(id){
  return id.startsWith('_') || id.startsWith(this.getCurrentPluginId())
    || (id.startsWith('!') && !id.startsWith('!' + this.getCurrentPluginId()))
};
ToolManager.callMouseHandler = function(event, type){
  for(let key in this._handlers){
    if(this._handlers[key].type === type && this.canCurrentPluginCall(this._handlers[key].id)){
      this._handlers[key].callback.call(this._handlers[key], event);
    }
  }
};
ToolManager.callKeyHandler = function(event, type){
  for(let key in this._handlers){
    if(this._handlers[key].type === type && this._handlers[key].key_code === Input.getKeyCode(event.keyCode)
      && this.canCurrentPluginCall(this._handlers[key].id)){
      this._handlers[key].callback.call(this._handlers[key], event);
    }
  }
};
// --------------------------------------------------------------------------------
// * Tool
// --------------------------------------------------------------------------------
ToolManager.addTool = function(tool){
  this._tools.push(tool);
};
ToolManager.addHandler = function(handler){
  this._handlers[handler.id] = handler;
};
ToolManager.removeHandler = function(id){
  this._handlers.remove(id);
};
// --------------------------------------------------------------------------------
ToolManager.calcToolList = function(){
  let output = {};
  for(let i = 0; i < this._tools.length; i++){
    let slot = this._tools[i].slot;
    output[slot] = output[slot] || [];
    output[slot].push({
      id: this._tools[i].id,
      tooltip: Language.get(Language.Type.ToolTip, this._tools[i].tooltip) || this._tools[i].tooltip,
      icon: this._tools[i].icon,
      on_click: this._tools[i].on_click,
      on_hover: this._tools[i].on_hover,
      on_leave: this._tools[i].on_leave
    });
  }
  return output;
};
ToolManager.getAllToolList = function(){
  return this._tool_list;
};
ToolManager.getToolList = function(slot){
  return this._tool_list[slot] || [];
};
// --------------------------------------------------------------------------------
ToolManager.getToolLabels = function(){
  let output = {};
  output.plugin = Language.get(Language.Type.Label, 'editor-label-plugin');
  output.cloud  = Language.get(Language.Type.Label, 'editor-label-cloud');
  output.option = Language.get(Language.Type.Label, 'editor-label-option');
  output.page   = Language.get(Language.Type.Label, 'editor-label-page');
  output.check  = Language.get(Language.Type.Label, 'editor-label-check');
  output.user   = Language.get(Language.Type.Label, 'editor-label-user');
  output.dev    = Language.get(Language.Type.Label, 'editor-label-dev');
  return output;
}
// --------------------------------------------------------------------------------
// * Plugin
// --------------------------------------------------------------------------------
ToolManager.getInitialPlugin = function(){
  let list = this.getToolList(Tool.Slot.PLUGIN);
  if(list.length === 0) return {id: null};
  return list[0];
};
ToolManager.getInitialPluginId = function(){
  return this.getInitialPlugin().id;
};
ToolManager.getCurrentPlugin = function(){
  let list = this.getToolList(Tool.Slot.PLUGIN);
  for(let i = 0; i < list.length; i++){
    if(list[i].id === this._current_plugin){
      return list[i];
    }
  }
  return {id: null};
};
ToolManager.getCurrentPluginIndex = function(){
  let list = this.getToolList(Tool.Slot.PLUGIN);
  for(let i = 0; i < list.length; i++){
    if(list[i].id === this._current_plugin){
      return i;
    }
  }
  return -1;
};
ToolManager.getCurrentPluginId = function(){
  return this.getCurrentPlugin().id;
};
ToolManager.setCurrentPlugin = function(id){
  let list = this.getToolList(Tool.Slot.PLUGIN);
  for(let i = 0; i < list.length; i++){
    if(list[i].id === id){
      this._current_plugin = list[i].id;
    }
  }
  Engine.clearToolTemp();
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Label, id: 'editor-label-plugin', dictionary:[
      { id: 'zh-cn', text: ['工具'] },
      { id: 'zh-tw', text: ['工具'] },
      { id: 'en-us', text: ['Tools'] }
    ]
  }, {
    type: Language.Type.Label, id: 'editor-label-page', dictionary:[
      { id: 'zh-cn', text: ['页面工具'] },
      { id: 'zh-tw', text: ['頁面工具'] },
      { id: 'en-us', text: ['Page Tools'] }
    ]
  }, {
    type: Language.Type.Label, id: 'editor-label-check', dictionary:[
      { id: 'zh-cn', text: ['检查工具'] },
      { id: 'zh-tw', text: ['檢查工具'] },
      { id: 'en-us', text: ['Check Tools'] }
    ]
  }, {
    type: Language.Type.Label, id: 'editor-label-user', dictionary:[
      { id: 'zh-cn', text: ['用户工具'] },
      { id: 'zh-tw', text: ['用戶工具'] },
      { id: 'en-us', text: ['User Tools'] }
    ]
  }, {
    type: Language.Type.Label, id: 'editor-label-option', dictionary:[
      { id: 'zh-cn', text: ['选项工具'] },
      { id: 'zh-tw', text: ['選項工具'] },
      { id: 'en-us', text: ['Option Tools'] }
    ]
  }, {
    type: Language.Type.Label, id: 'editor-label-cloud', dictionary:[
      { id: 'zh-cn', text: ['云功能工具'] },
      { id: 'zh-tw', text: ['雲功能工具'] },
      { id: 'en-us', text: ['Cloud Tools'] }
    ]
  }, {
    type: Language.Type.Label, id: 'editor-label-dev', dictionary: [
      {id: 'zh-cn', text: ['开发者工具']},
      {id: 'zh-tw', text: ['開發者工具']},
      {id: 'en-us', text: ['Development Tools']}
    ]
  }
]);
// ================================================================================
