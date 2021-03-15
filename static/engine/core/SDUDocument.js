// ================================================================================
// * SDUDocument <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/15 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * SDUDocument
// ================================================================================
function SDUDocument(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
SDUDocument._data = {};
SDUDocument._next_index = {};
SDUDocument._current_page = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
SDUDocument.initialize = function(){
  this.clear();
}
SDUDocument.clear = function(){
  this._data = {Page: []};
  this._next_index = {Page: 0};
  this._current_page = 0;
  Graphics.clearImage();
}
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(SDUDocument, 'data', {
  get: function() {
    return this._data;
  },
  configurable: true
});
Object.defineProperty(SDUDocument, 'current_page', {
  get: function() {
    return this._current_page;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
SDUDocument.getNextIndex = function(key){
  if(!this._next_index[key]) this._next_index[key] = 1;
  return this._next_index[key] ++;
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
SDUDocument.addPage = async function(page){
  this._data.Page.splice(this._current_page, 0, page);
  await this.setCurrentPage(this._current_page + 1);
}
SDUDocument.deletePage = async function(){
  if(this._data.Page.length <= 0) return;
  this._data.Page.splice(this._current_page - 1, 1);
  if(this._current_page === this._data.Page.length + 1) {
    await this.setCurrentPage(this._current_page - 1);
  }else{
    await this.setCurrentPage(this._current_page);
  }
}
SDUDocument.movePagePlus = async function(){
  await this.movePage(this._current_page + 1)
}
SDUDocument.movePageMinus = async function(){
  await this.movePage(this._current_page - 2)
}
SDUDocument.movePage = async function(target){
  if(this._data.Page.length <= 1) return;
  if(this._current_page === target) return;
  if(this._current_page <= 0 || this._current_page > this._data.Page.length) return;
  if(this._current_page === 1 && target <= 1) return;
  if(this._current_page === this._data.Page.length && target > this._data.Page.length) return;
  let real_target = Math.max(0, Math.min(target, this._data.Page.length));
  if(this._current_page === real_target || this._current_page === real_target + 1) return;

  let page = this._data.Page.splice(this._current_page - 1, 1)[0];
  if(real_target > this._current_page){
    this._current_page = real_target - 1;
  }else{
    this._current_page = real_target;
  }

  await this.addPage(page);
}
SDUDocument.setCurrentPage = async function(index){
  if(index < 0 || index > this._data.Page.length) return;
  if(index === 0){
    if(this._data.Page.length > 0){
      this._current_page = 1;
    }else{
      this._current_page = 0;
      return Graphics.clearImage();
    }
  }else{
    this._current_page = index;
  }
  await Graphics.setImage(this._data.Page[this._current_page - 1].src);
}
// ================================================================================


// * DocData
// ================================================================================
function DocData(){
  this.initialize.apply(this, arguments);
}

DocData.prototype.data = null;
DocData.prototype.point_size = 0;
DocData.prototype.line_size = 0;

DocData.prototype.initialize = function(){
  this.clear();
};
DocData.prototype.clear = function(){
  this.data = { points : {}, lines : {} };
  this.point_size = 0;
  this.line_size = 0;
};
DocData.prototype.generatePointIndex = function(){
  return String(this.point_size ++);
};
DocData.prototype.generateLineIndex = function(){
  return String(this.line_size ++);
};
DocData.prototype.addPoint = function(x, y){
  let point = new Point(x, y);
  this.data.points[this.generatePointIndex()] = point;
};
DocData.prototype.addLine = function(start, end){
  let line = new Line2D(start, end);
  this.data.points[this.generatePointIndex()] = line;
};
DocData.prototype.draw = function(ctx, grid){
  for(let i in this.data.points){
    //this.data.points[i].fill(ctx, grid, 5, 2, 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 255, 1)');
  }
};

let data = {

}
