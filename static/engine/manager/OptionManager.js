// ================================================================================
// * OptionManager <SDUDOC Engine>
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
// * OptionManager
// --------------------------------------------------------------------------------
function OptionManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
OptionManager._options = {};
OptionManager._values = {};

OptionManager.addOption = function(option){
  this.option[option.slot] = this.option[option.slot] || [];
  this.option[option.slot].push(option);
};
OptionManager.setValue = function(id){
  if(!this._options[id]) return null;
  switch (this._options[id].type){
    case '':
  }
  return this._values[id] || this._options[id].default_value;
};
OptionManager.getValue = function(id){
  if(!this._options[id]) return null;
  return this._values[id] || this._options[id].default_value;
};
OptionManager.getOptionList = function(){

};
// ================================================================================
