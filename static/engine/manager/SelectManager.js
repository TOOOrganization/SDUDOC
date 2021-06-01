// ================================================================================
// * SelectManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/10 - Version 1.0.0
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
// * Functions
// --------------------------------------------------------------------------------
SelectManager.isType = function(type){
  return this._target && this._target.id.startsWith(type);
}
SelectManager.selectObject = function(obj){
  this._target = obj;
  DocumentManager.extractElement(this._target);
}
SelectManager.getObject = function(){
  return this._target;
}
SelectManager.selectId = function(id){
  this.select(id.split(SDUDocument.SAPARATOR)[0], id);
}
SelectManager.select = function(type, id){
  this.selectObject(SDUDocument.getElement(type, id));
}
SelectManager.unSelect = function(){
  this._target = null;
  DocumentManager.clearElement();
}
// --------------------------------------------------------------------------------
