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
// * Initialize
// --------------------------------------------------------------------------------
HistoryManager.initialize = function(){
  this.clear();
}
HistoryManager.clear = function(){
  this._left_queue = [];
  this._right_queue = [];
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
HistoryManager.push = function(history){
  this._left_queue.push(history);
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
HistoryManager.undo = function(){
  let history = this._left_queue.pop();
  for(let i = history.length - 1; i >= 0; i--){
    history[i].undo();
  }
}
HistoryManager.redo = function(){
  let history = this._left_queue.pop();
  for(let i = history.length - 1; i >= 0; i--){
    history[i].redo();
  }
}
// ================================================================================
