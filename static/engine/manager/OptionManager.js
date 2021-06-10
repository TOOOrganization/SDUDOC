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
// --------------------------------------------------------------------------------
// * Plugin Option
// --------------------------------------------------------------------------------
OptionManager.addOption = function(option){
  this._options[option.tool_id] = this._options[option.tool_id] || {};
  this._options[option.tool_id][option.id] = option;
};
OptionManager.haveOption = function(tool_id, id){
  return id && this._options[tool_id] && this._options[tool_id][id];
};
// --------------------------------------------------------------------------------
OptionManager.calcValue = function(tool_id, id, value) {
}
// ------------------------------------------------------------------------------
// };--
OptionManager.setValue = function(tool_id, id, value){
  if (!this.haveOption()) return;
  this._values[tool_id] = this._values[tool_id] || [];
  this._values[tool_id][id] = this.calcValue(tool_id, id, value);
};
OptionManager.getValue = function(tool_id, id){
  if (!this.haveOption()) return null;
  if(id && this._values[tool_id] && this._values[tool_id][id]){
    return this._values[tool_id][id];
  }
  return this._options[tool_id][id].value;
};
// --------------------------------------------------------------------------------
OptionManager.resetValue = function(tool_id, id){
  if (!this.haveOption()) return;
  this._options[tool_id][id].value = this._options[tool_id][id].default_value;
};
OptionManager.resetAllOption = function(){
  for(let tool_id in this._options){
    for(let id in this._options[tool_id]){
      this._options[tool_id][id].value = this._options[tool_id][id].default_value;
    }
  }
};
// ================================================================================
