// ================================================================================
// * Handler <SDUDOC Engine>
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
// * Handler
// --------------------------------------------------------------------------------
function Handler(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Handler.prototype._id = 0;
Handler.prototype._type = 0;
Handler.prototype._overall = false;
Handler.prototype._owner = null;
Handler.prototype._callback = function(){};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Handler.prototype.initialize = function(id, type, overall, owner, callback){
  this._id = id;
  this._type = type;
  this._overall = overall;
  this._owner = owner;
  this._callback = callback;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Handler.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Handler.prototype, 'type', {
  get: function() {
    return this._type;
  },
  configurable: true
});
Object.defineProperty(Handler.prototype, 'overall', {
  get: function() {
    return this._overall;
  },
  configurable: true
});
Object.defineProperty(Handler.prototype, 'key_code', {
  get: function() {
    return this._overall;
  },
  configurable: true
});
Object.defineProperty(Handler.prototype, 'owner', {
  get: function() {
    return this._owner;
  },
  configurable: true
});
Object.defineProperty(Handler.prototype, 'callback', {
  get: function() {
    return this._callback;
  },
  configurable: true
});
// ================================================================================
