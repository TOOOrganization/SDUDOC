// ================================================================================
// * PageArray <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/06/04 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * PageArray
// --------------------------------------------------------------------------------
function PageArray(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
PageArray.prototype._page_list = [];
PageArray.prototype._current_page = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
PageArray.prototype.initialize = function(){
  this.clear();
};
PageArray.prototype.clear = function(){
  this._page_list = [];
  this._current_page = 0;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(PageArray.prototype, 'page_list', {
  get: function() {
    return this._page_list;
  },
  configurable: true
});
Object.defineProperty(PageArray.prototype, 'current_page', {
  get: function() {
    return this._current_page;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
PageArray.prototype.addPage = function(index, page_id){
  this._page_list.splice(index, 0, page_id);
  this.setCurrentPage(index + 1);
};
PageArray.prototype.addAfterCurrentPage = function(page_id){
  this.addPage(this._current_page, page_id);
};
PageArray.prototype.removeCurrentPage = function(){
  if(this._page_list.length <= 0) return;
  let page_id = this._page_list.splice(this._current_page - 1, 1)[0];
  if(this._current_page > this._page_list.length){
    this.setCurrentPage(this._current_page);
  }
  return page_id;
};
// --------------------------------------------------------------------------------
PageArray.prototype.moveCurrentPageMinus = function(){
  this.moveCurrentPageTo(this._current_page - 1)
};
PageArray.prototype.moveCurrentPagePlus = function(){
  this.moveCurrentPageTo(this._current_page + 1)
};
PageArray.prototype.moveCurrentPageTo = function(target){
  if(target < this.current_page){
    this.moveCurrentPage(target - 1);
  }else{
    this.moveCurrentPage(target);
  }
};
PageArray.prototype.moveCurrentPage = function(target){
  if(this._page_list.length <= 1) return;
  if(this._current_page === target) return;
  if(this._current_page <= 0 || this._current_page > this._page_list.length) return;
  if(this._current_page === 1 && target <= 1) return;
  if(this._current_page === this._page_list.length && target > this._page_list.length) return;
  let real_target = Math.max(0, Math.min(target, this._page_list.length));
  if(this._current_page === real_target || this._current_page === real_target + 1) return;

  let page_id = this._page_list.splice(this._current_page - 1, 1)[0];
  if(real_target > this._current_page){
    this._current_page = real_target - 1;
  }else{
    this._current_page = real_target;
  }
  this.addAfterCurrentPage(page_id);
};
// --------------------------------------------------------------------------------
PageArray.prototype.getCurrentPage = function(){
  return this._current_page;
};
PageArray.prototype.getCurrentPageId = function(){
  return this.getPageId(this._current_page);
};
PageArray.prototype.getPageId = function(index){
  return index > 0 && index <= this._page_list.length ? this._page_list[index - 1] : null;
};
PageArray.prototype.setCurrentPage = function(index){
  if(index < 0 || index > this._page_list.length) return;
  if(index === 0){
    if(this._page_list.length > 0){
      this._current_page = 1;
    }else{
      this._current_page = 0;
    }
  }else{
    this._current_page = index;
  }
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
PageArray.prototype.loadJson = function(json_object){
  this._page_list    = json_object._page_list;
  this._current_page = json_object._current_page;
};
PageArray.prototype.saveJson = function(){
  let output = {};
  output._page_list    = this._page_list;
  output._current_page = this._current_page;
  return output;
};
PageArray.prototype.exportJson = function(){
  return this._page_list;
};
// ================================================================================
