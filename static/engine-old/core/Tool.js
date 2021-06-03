// ================================================================================
// * Tool <SDUDOC Engine>
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
// * Tool
// --------------------------------------------------------------------------------
function Tool(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
Tool.Type = {
  DOCUMENT: 0, HISTORY: 1, PLUGIN: 2, PAGE: 3, CHECK: 4, USER: 5, DEV: 10
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Tool.prototype._id = "";
Tool.prototype._tooltip = "";
Tool.prototype._icon = "";
Tool.prototype._type = 0;
Tool.prototype._description = "";
Tool.prototype._callback = function(){};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Tool.prototype.initialize = function(id, tooltip, icon, type, description, callback){
  this._id = id;
  this._tooltip = tooltip;
  this._icon = icon;
  this._type = type;
  this._description = description;
  this._callback = callback;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Tool.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'tooltip', {
  get: function() {
    return this._tooltip;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'icon', {
  get: function() {
    return this._icon;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'type', {
  get: function() {
    return this._type;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'description', {
  get: function() {
    return this._description;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'callback', {
  get: function() {
    return this._callback;
  },
  configurable: true
});
// ================================================================================
