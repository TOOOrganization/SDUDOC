OptionManager.addOption(new Option('line.continue2', 'line', Option.Type.INT_SLIDE, 'option-line-continue', 0, {
  min: 0, max:100, step:5}, function(){

}));
OptionManager.addOption(new Option('line.continue3', 'line', Option.Type.INT_INPUT, 'option-line-continue', 0, {
  min: 0, max:100, step:5}, function(){

}));
OptionManager.addOption(new Option('line.continue1', 'dot', Option.Type.INT_INPUT, 'option-line-continue', 0, {}, function(){}));
OptionManager.addOption(new Option('line.continue2', 'dot', Option.Type.BOOLEAN, 'option-line-continue', true, {}, function(){

}));
OptionManager.addOption(new Option('line.continue3', 'dot', Option.Type.INT_SLIDE, 'option-line-continue', 0, {}, function(){}));
OptionManager.addOption(new Option('line.continue1', 'move', Option.Type.INT_SLIDE, 'option-line-continue', 0, {}, function(){}));
OptionManager.addOption(new Option('line.continue2', 'move', Option.Type.INT_INPUT, 'option-line-continue', 0, {}, function(){}));
OptionManager.addOption(new Option('line.continue3', 'move', Option.Type.BOOLEAN, 'option-line-continue', true, {}, function(){

}));
/*
Input.addHandler(new Handler('Input.onMouseDown1', 'key_down', 'M', Engine, function(event){
  console.log('key_down')
}.bind(Engine)));
Input.addHandler(new Handler('Input.onMouseDown2', 'key_up', 'M', Engine, function(event){
  console.log('key_up')
}.bind(Engine)));
Input.addHandler(new Handler('Input.onMouseDown3', 'key_long_hold', 'M', Engine, function(event){
  console.log('key_long_hold')
}.bind(Engine)));
Input.addHandler(new Handler('Input.onMouseDown4', 'key_hold', 'M', Engine, function(event){
  console.log('key_hold')
}.bind(Engine)));
Input.addHandler(new Handler('Input.onMouseDown5', 'key_click', 'M', Engine, function(event){
  console.log('key_click')
}.bind(Engine)));
*/

// ToolManager.addTool(new Tool('cut', '剪切工具', 'mdi-scissors-cutting', Tool.Slot.PLUGIN, function(){
//
// }));
// ToolManager.addTool(new Tool('comment', '注释工具', 'mdi-tooltip-plus-outline', Tool.Slot.PLUGIN, function(){
//
// }));
