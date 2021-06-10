// ================================================================================
// * Option <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/06/08 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Option
// --------------------------------------------------------------------------------
function Option() {
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
Option.Type = {
  BOOLEAN: 0,
  NUMBER_INPUT: 1,
  NUMBER_SLIDE: 1,
  TEXT: 2,
};
Option.Slot = {
  RENDERER: 0
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Option.prototype._id = '';
Option.prototype._tool_id = '';
Option.prototype._type = '';
Option.prototype._name = '';
Option.prototype._default_value = '';
Option.prototype._options = {};
Option.prototype._callback = function(){};
// --------------------------------------------------------------------------------
Option.prototype._on_change = function(){};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Option.prototype.initialize = function(id, tool_id, type, name, default_value, options, callback) {
  this._id = id;
  this._tool_id = tool_id;
  this._type = type;
  this._name = name;
  this._default_value = default_value;
  this._options = options;
  this._callback = callback;
  this._on_change = this.onChange.bind(this);
}
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Option.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'tool_id', {
  get: function() {
    return this._tool_id;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'type', {
  get: function() {
    return this._type;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'name', {
  get: function() {
    return this._name;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'default_value', {
  get: function() {
    return this._default_value;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'options', {
  get: function() {
    return this._options;
  },
  configurable: true
});
Object.defineProperty(Tool.prototype, 'callback', {
  get: function() {
    return this._callback;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'on_change', {
  get: function() {
    return this._on_change;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Option.prototype.onChange = function(){
  if(this._callback) {
    this._callback.call(this);
  }
};
// ================================================================================
