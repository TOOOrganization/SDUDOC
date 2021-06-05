// ================================================================================
// * SelectManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * SelectManager
// --------------------------------------------------------------------------------
function SelectManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
SelectManager._target = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
SelectManager.initialize = function(){
  this.clear();
}
SelectManager.clear = function(){
  this._target = null;
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
SelectManager.isSelectedType = function(type){
  return this._target && this._target.id.startsWith(type);
};
SelectManager.isSelected = function(type, id){
  return this._target && this._target.id === id;
};
// --------------------------------------------------------------------------------
SelectManager.getSelectedObject = function(){
  return this._target;
};
SelectManager.getSelectedId = function(){
  return this._target ? this._target.id : null;
};
// --------------------------------------------------------------------------------
SelectManager.selectId = function(id){
  this.select(id.split(ElementManager.SAPARATOR)[0], id);
};
SelectManager.select = function(type, id){
  this.selectObject(ElementManager.getElement(type, id));
};
SelectManager.selectObject = function(obj){
  this._target = obj;
  this.updateCheckData();
};
// --------------------------------------------------------------------------------
SelectManager.unSelect = function(){
  this._target = null;
  this.updateCheckData();
};
// --------------------------------------------------------------------------------
// * Check
// --------------------------------------------------------------------------------
SelectManager.updateCheckData = function(){
  Engine.updateEditorCheckData();
}
// --------------------------------------------------------------------------------
SelectManager.extractElementById = function(id){
  return this.extractElement(id.split(ElementManager.SAPARATOR)[0], id);
}
SelectManager.extractElement = function(type, id){
  return this.extractElementObject(ElementManager.getElement(type, id));
}
SelectManager.extractElementObject = function(element){
  if (!element) return null;
  let json = element.saveJson();

  let str = JSON.stringify(json);
  str = str.substring(1, str.length - 1);
  str = str.split(',');
  str.shift();
  str = str.join(',');
  str = str.replaceAll(',\"_', '\n\"_');
  return str;
}
// --------------------------------------------------------------------------------
SelectManager.updateElement = function(type, id, data){
  let json = data.replaceAll('\n\"_', ',\"_');
  json = '{\"_id\":\"' + id + '\",' + json + '}';
  let json_object = JSON.parse(json);
  ElementManager.updateElement(type, id, json_object);
  this.unSelect();
  this.updateCheckData();
}
// ================================================================================
