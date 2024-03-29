// ================================================================================
// * Tool <SDUDOC Engine>
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
// * Tool
// --------------------------------------------------------------------------------
function Tool(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
Tool.Slot = {
  PLUGIN: 'plugin',

  HISTORY: 'history',

  DOCUMENT: 'document',

  USER: 'user',
  CLOUD: 'cloud',
  PAGE: 'page',
  CHECK: 'check',
  DEV: 'dev'
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Tool.prototype._id = '';
Tool.prototype._tooltip = '';
Tool.prototype._icon = '';
Tool.prototype._slot = '';
Tool.prototype._callback = function(){};
// --------------------------------------------------------------------------------
Tool.prototype._on_click = function(){};
Tool.prototype._on_hover = function(){};
Tool.prototype._on_leave = function(){};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Tool.prototype.initialize = function(id, tooltip, icon, slot, callback){
  this._id = id;
  this._tooltip = tooltip;
  this._icon = icon;
  this._slot = slot;
  this._callback = callback;
  this._on_click = this.onClick.bind(this);
  this._on_hover = this.onHover.bind(this);
  this._on_leave = this.onLeave.bind(this);
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
Object.defineProperty(Tool.prototype, 'slot', {
  get: function() {
    return this._slot;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'callback', {
  get: function() {
    return this._callback;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'on_click', {
  get: function() {
    return this._on_click;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'on_hover', {
  get: function() {
    return this._on_hover;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'on_leave', {
  get: function() {
    return this._on_leave;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Tool.prototype.onClick = function(){
  if(this._callback.on_click) {
    this._callback.on_click.call(this);
  }
};
Tool.prototype.onHover = function(){
  if(this._callback.on_hover) {
    this._callback.on_hover.call(this);
  }
};
Tool.prototype.onLeave = function(){
  if(this._callback.on_leave) {
    this._callback.on_leave.call(this);
  }
};
// ================================================================================
