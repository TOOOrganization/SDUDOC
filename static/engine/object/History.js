// ================================================================================
// * History <SDUDOC Engine>
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
// * History
// --------------------------------------------------------------------------------
function History(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
History.prototype._old_handle = null;
History.prototype._new_handle = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
History.prototype.initialize = function(old_handle, new_handle){
  this._old_handle = old_handle;
  this._new_handle = new_handle;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(History.prototype, 'old_handle', {
  get: function() {
    return this._old_handle;
  },
  configurable: true
});
Object.defineProperty(History.prototype, 'new_handle', {
  get: function() {
    return this._new_handle;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
History.prototype.undo = async function(){
  await this._old_handle.callback.call(this._old_handle);
};
History.prototype.redo = async function(){
  await this._new_handle.callback.call(this._new_handle);
};
// ================================================================================
