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
Option.prototype._type = '';
Option.prototype._slot = '';
Option.prototype._name = '';
Option.prototype._default_value = '';
Option.prototype._options = {};
Option.prototype._on_change = function(){};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Option.prototype.initialize = function(type, slot, name, default_value, options, on_change) {
  this._type = type;
  this._slot = slot;
  this._name = name;
  this._default_value = default_value;
  this._options = options;
  this._on_change = on_change.bind(this);
}
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Option.prototype, 'type', {
  get: function() {
    return this._type;
  },
  set: function(value) {
    this._type = value;
  },
  configurable: true
});

Object.defineProperty(Option.prototype, 'slot', {
  get: function() {
    return this._slot;
  },
  set: function(value) {
    this._slot = value;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'name', {
  get: function() {
    return this._name;
  },
  set: function(value) {
    this._name = value;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'default_value', {
  get: function() {
    return this._default_value;
  },
  set: function(value) {
    this._defaule_value = value;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'options', {
  get: function() {
    return this._options;
  },
  set: function(value) {
    this._options = value;
  },
  configurable: true
});
Object.defineProperty(Option.prototype, 'on_change', {
  get: function() {
    return this._on_change;
  },
  set: function(value) {
    this._on_change = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------

// ================================================================================
