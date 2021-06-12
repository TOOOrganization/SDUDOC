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
History.prototype._old_page = null;
History.prototype._new_page = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
History.prototype.initialize = function(old_handle, new_handle, old_page, new_page){
  this._old_handle = old_handle;
  this._new_handle = new_handle;
  this._old_page = old_page;
  this._new_page = old_page;
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
Object.defineProperty(History.prototype, 'old_page', {
  get: function() {
    return this._old_page;
  },
  configurable: true
});
Object.defineProperty(History.prototype, 'new_page', {
  get: function() {
    return this._new_page;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
History.prototype.undo = async function(){
  await this._old_handle();
  if(this._old_page && DocumentManager.getCurrentPage() !== this.old_page){
    await DocumentManager.setCurrentPage(this._old_page);
  }
};
History.prototype.redo = async function(){
  await this._new_handle();
  if(this._new_page && DocumentManager.getCurrentPage() !== this.new_page){
    await DocumentManager.setCurrentPage(this._new_page);
  }
};
// ================================================================================
