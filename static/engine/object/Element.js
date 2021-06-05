// ================================================================================
// * Element <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/06/03 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Element
// --------------------------------------------------------------------------------
function Element(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Element.prototype._id = '';
Element.prototype._pages = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Element.prototype.initialize = function(id, pages){
  this._id = id;
  this._pages = pages;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Element.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Element.prototype, 'pages', {
  get: function() {
    return this._pages;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Element.prototype.newElement = function(){
  return new Element('', []);
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Element.prototype.onAwake = function(){

};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Element.prototype.onUpdate = function(){

};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Element.prototype.onRemove = function(){

};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Element.prototype.checkCollide = function(point){
  return -1;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Element.prototype.loadJson = function(json_object){
  this._id    = json_object._id    === undefined ? this._id    : json_object._id;
  this._pages = json_object._pages === undefined ? this._pages : json_object._pages;
}
Element.prototype.saveJson = function(){
  let output = {};
  output._id    = this._id;
  output._pages = this._pages;
  return output;
}
Element.prototype.exportJson = function(){
  let output = {};
  output.id    = this._id;
  output.pages = this._pages;
  return output;
}
// ================================================================================
