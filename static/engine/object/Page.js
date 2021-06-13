// ================================================================================
// * Page <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Initial
// ================================================================================

// ================================================================================
// * Page
// --------------------------------------------------------------------------------
function Page(){
  this.initialize.apply(this, arguments);
}
Page.prototype = Object.create(Element.prototype);
Page.prototype.constructor = Page;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Page.TAG = 'Page';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Page.prototype._src = '';
// --------------------------------------------------------------------------------
Page.prototype._width = 0;
Page.prototype._height = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Page.prototype.initialize = function(id, src){
  Element.prototype.initialize.call(this, id, []);
  this._src = src;
  this._width = 0;
  this._height = 0;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Page.prototype, 'src', {
  get: function() {
    return this._src;
  },
  set: function(value) {
    this._src = value;
  },
  configurable: true
});
Object.defineProperty(Page.prototype, 'width', {
  get: function() {
    return this._width;
  },
  set: function(value) {
    this._width = value;
  },
  configurable: true
});
Object.defineProperty(Page.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(value) {
    this._height = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Page.prototype.setSize = function(width, height){
  this._width = width;
  this._height = height;
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Page.prototype.newElement = function(){
  return new Page('', '');
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Page.prototype.onAwake = function(){
  Element.prototype.onAwake.call(this);
};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Page.prototype.onUpdate = function(){
  Element.prototype.onUpdate.call(this);
};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Page.prototype.onRemove = function(){
  Element.prototype.onRemove.call(this);
  let dots = ElementManager.getFilteredElements(Dot2D.TAG);
  for(let id in dots){
    DocumentManager.removeElement(Dot2D.TAG, id);
  }
};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Page.prototype.checkCollide = function(point){
  return -1;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Page.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._src    = json_object._src    === undefined ? this._src    : json_object._src;
  this._width  = json_object._width  === undefined ? this._width  : json_object._width;
  this._height = json_object._height === undefined ? this._height : json_object._height;
};
Page.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  delete output._pages;
  output._src    = this._src;
  output._width  = this._width;
  output._height = this._height;
  return output;
};
Page.prototype.exportJson = function(){
  let output = Element.prototype.exportJson.call(this);
  delete output.pages;
  output.src    = this._src;
  output.width  = this._width;
  output.height = this._height;
  return output;
};
// ================================================================================
