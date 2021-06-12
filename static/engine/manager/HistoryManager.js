// ================================================================================
// * HistoryManager <SDUDOC Engine>
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
// * HistoryManager
// --------------------------------------------------------------------------------
function HistoryManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
HistoryManager.MAX_HISTORY_SIZE = 100;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
HistoryManager._left_queue = [];
HistoryManager._right_queue = [];
// --------------------------------------------------------------------------------
HistoryManager._temp_history_list = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
HistoryManager.initialize = function(){
  this.clear();
}
HistoryManager.clear = function(){
  this._left_queue = [];
  this._right_queue = [];
  this._temp_history_list = [];
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
HistoryManager.append = function(history){
  this._temp_history_list.push(history);
}
HistoryManager.new = function(){
  if(this._temp_history_list.length > 0){
    this.push(this._temp_history_list);
    this._temp_history_list = [];
  }
}
// --------------------------------------------------------------------------------
HistoryManager.push = function(history_list){
  this._left_queue.push(history_list);
  if(this._left_queue.length >= this.MAX_HISTORY_SIZE){
    this._left_queue.shift();
  }
  this._right_queue = [];
}
// --------------------------------------------------------------------------------
HistoryManager.canUndo = function(){
  return this._left_queue.length > 0;
}
HistoryManager.canRedo = function(){
  return this._right_queue.length > 0;
}
// --------------------------------------------------------------------------------
HistoryManager.undo = async function(){
  if (!this.canUndo()) return;
  let history_list = this._left_queue.pop();
  for(let i = history_list.length - 1; i >= 0; i--){
    await history_list[i].undo();
  }
}
HistoryManager.redo = async function(){
  if (!this.canRedo()) return;
  let history_list = this._right_queue.pop();
  for(let i = 0; i < history_list.length; i++){
    await history_list[i].redo();
  }
}
// ================================================================================
