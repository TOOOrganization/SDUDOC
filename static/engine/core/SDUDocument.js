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
  return key + "." + (this._next_index[key] ++);
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
SDUDocument.addElement = function(type, element){
  if(!this._data[type]) this._data[type] = {};
  this._data[type][element.id] = element;
}
SDUDocument.deleteElement = function(type, id){
  this._data[type][id].onDelete.call(this._data[type][id]);
  delete this._data[type][id];
}
// --------------------------------------------------------------------------------
SDUDocument.addPage = async function(page){
  this._data.Page.splice(this._current_page, 0, page);
  await this.setCurrentPage(this._current_page + 1);
}
SDUDocument.deletePage = async function(){
  if(this._data.Page.length <= 0) return;
  this._data.Page[this._current_page - 1].onDelete.call(this._data.Page[this._current_page - 1]);
  this._data.Page.splice(this._current_page - 1, 1);
  if(this._current_page === this._data.Page.length + 1) {
    await this.setCurrentPage(this._current_page - 1);
  }else{
    await this.setCurrentPage(this._current_page);
  }
}
// --------------------------------------------------------------------------------
SDUDocument.movePagePlus = async function(){
  await this.movePageTo(this._current_page + 1)
}
SDUDocument.movePageMinus = async function(){
  await this.movePageTo(this._current_page - 1)
}
SDUDocument.movePageTo = async function(target){
  if(target < this.current_page){
    await this.movePage(target - 1);
  }else{
    await this.movePage(target);
  }
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
// --------------------------------------------------------------------------------
SDUDocument.getCurrentPage = function(){
  return this._current_page;
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
// --------------------------------------------------------------------------------
SDUDocument.loadJson = async function(json){
  this._data = {};
  let temp = JSON.parse(json);
  for(let i in temp){
    if(i === "Index"){
      this._next_index = temp[i];
    }else if(i === "Page"){
      this._data[i] = [];
      for(let j in temp[i]){
        let element = window[i].prototype.getObject();
        element.loadJson(temp[i][j]);
        this._data[i].push(element);
      }
    }else{
      this._data[i] = {};
      for(let j in temp[i]){

        let element = window[i].prototype.getObject();
        element.loadJson(temp[i][j]);
        this._data[i][temp[i][j]._id] = element;
      }
    }
  }
  await this.setCurrentPage(0);
}
SDUDocument.saveJson = function(){
  let temp = {
    Index: this._next_index
  };
  for(let i in this._data){
    temp[i] = [];
    for(let j in this._data[i]){
      if(this._data[i][j].saveJson){
        temp[i].push(this._data[i][j].saveJson());
      }
    }
  }
  return JSON.stringify(temp);
}
SDUDocument.exportJson = function(){
  let temp = {};
  for(let i in this._data){
    temp[i] = [];
    for(let j in this._data[i]){
      if(this._data[i][j].exportJson){
        temp[i].push(this._data[i][j].exportJson());
      }
    }
  }
  return JSON.stringify(temp);
}
// ================================================================================
