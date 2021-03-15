






// ================================================================================
// * SDUDocument
// ================================================================================
function SDUDocument(){
  throw new Error('This is a static class');
}

SDUDocument._data = {};
SDUDocument._nextIndex = {};

SDUDocument._current_page = 0;

SDUDocument.initialize = function(){
  this.clear();
}
SDUDocument.clear = function(){
  this._data = {Page: []};
  this._nextIndex = {Page: 0};
  this._current_page = 0;
  Graphics.clearImage();
}

SDUDocument.getNextIndex = function(key){
  if(!this._nextIndex[key]) this._nextIndex[key] = 1;
  return this._nextIndex[key] ++;
}

SDUDocument.addPage = async function(page){
  this._data.Page.splice(this._current_page, 0, page);
  await this.setPage(this._current_page + 1);
}
SDUDocument.setPage = async function(index){
  if(index <= 0 || index > this._data.Page.length) return;
  this._current_page = index;
  await Graphics.setImage(this._data.Page[this._current_page - 1].src);
}

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
