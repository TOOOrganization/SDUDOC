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
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
OptionManager.addOption = function(option){
  this._options[option.tool_id] = this._options[option.tool_id] || {};
  this._options[option.tool_id][option.id] = option;
};
OptionManager.haveOption = function(tool_id, id){
  return id && this._options[tool_id] && this._options[tool_id][id] !== undefined;
}
OptionManager.haveValue = function(tool_id, id){
  return id && this._values[tool_id] && this._values[tool_id][id] !== undefined;
};
// --------------------------------------------------------------------------------
OptionManager.calcValue = function(tool_id, id, value) {
  if (!this.haveOption(tool_id, id)) return 0;
  let option = this._options[tool_id][id];
  switch (option.type){
    case Option.Type.BOOLEAN:
      return !!value;
    case Option.Type.INT_INPUT: case Option.Type.INT_SLIDE:
      return Math.round(Math.max(option.options.min, Math.min(value, option.options.max)));
    case Option.Type.DOUBLE_INPUT: case Option.Type.DOUBLE_SLIDE:
      return Math.max(option.options.min, Math.min(value, option.options.max));
  }
}
// ------------------------------------------------------------------------------
OptionManager.setValue = function(tool_id, id, value){
  if (!this.haveOption(tool_id, id)) return;
  this._values[tool_id] = this._values[tool_id] || [];
  this._values[tool_id][id] = this.calcValue(tool_id, id, value);
};
OptionManager.getValue = function(tool_id, id){
  if (!this.haveOption(tool_id, id)) return null;
  if(this.haveValue(tool_id, id)){
    return this._values[tool_id][id];
  }
  return this._options[tool_id][id].default_value;
};
// --------------------------------------------------------------------------------
OptionManager.resetOptionValue = function(tool_id, id){
  if (!this.haveValue(tool_id, id)) return;
  this._values[tool_id][id].value;
};
OptionManager.resetOptionAll = function(){
  this._values = {};
};
OptionManager.resetOptionTool = function(tool_id){
  if(this._values[tool_id]){
    delete this._values[tool_id];
  }
};
// --------------------------------------------------------------------------------
OptionManager.getOptionList = function(){
  let output = {};
  for(let tool_id in this._options){
    output[tool_id] = {}
    for(let id in this._options[tool_id]){
      let option = this._options[tool_id][id];
      output[tool_id][id] = {
        tool_id: option.tool_id,
        id: option.id,
        type: option.type,
        name: Language.get(Language.Type.Option, option.name) || option.name,
        value: this.getValue(tool_id, id),
        options: option.options,
        on_change: option.on_change,
      }
    }
  }
  return output;
};
// ================================================================================
