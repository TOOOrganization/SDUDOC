// ================================================================================
// * Renderer <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/17 - Version 1.0.0
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
Renderer.prototype._id = "";
Renderer.prototype._z = 0;
Renderer.prototype._owner = null;
Renderer.prototype._render = function(){};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Renderer.prototype.initialize = function(id, z, owner, render){
  this._id = id;
  this._z = z;
  this._owner = owner;
  this._render = render;
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
Object.defineProperty(Renderer.prototype, 'z', {
  get: function() {
    return this._z;
  },
  configurable: true
});
Object.defineProperty(Renderer.prototype, 'owner', {
  get: function() {
    return this._owner;
  },
  configurable: true
});
Object.defineProperty(Renderer.prototype, 'render', {
  get: function() {
    return this._render;
  },
  configurable: true
});

// ================================================================================
