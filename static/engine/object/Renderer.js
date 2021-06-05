// ================================================================================
// * Renderer <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/17 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Renderer
// --------------------------------------------------------------------------------
function Renderer(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Renderer.prototype._id = '';
Renderer.prototype._name = '';
Renderer.prototype._z_index = 0;
Renderer.prototype._owner = null;
Renderer.prototype._render = function(){};
// --------------------------------------------------------------------------------
Renderer.prototype._visible = true;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Renderer.prototype.initialize = function(id, name, z_index, render){
  this._id = id;
  this._name = name;
  this._z_index = z_index;
  this._render = render;
  this._visible = true;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Renderer.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Renderer.prototype, 'name', {
  get: function() {
    return this._name;
  },
  configurable: true
});
Object.defineProperty(Renderer.prototype, 'z_index', {
  get: function() {
    return this._z_index;
  },
  configurable: true
});
Object.defineProperty(Renderer.prototype, 'render', {
  get: function() {
    return this._render;
  },
  configurable: true
});
Object.defineProperty(Renderer.prototype, 'visible', {
  get: function() {
    return this._visible;
  },
  set: function(value) {
    this._visible = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Renderer.prototype.setVisible = function(value){
  this._visible = value;
};
// ================================================================================
