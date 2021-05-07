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
// --------------------------------------------------------------------------------
function SDUDocument(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
SDUDocument._data = {};
SDUDocument._page_data = {};
SDUDocument._next_index = {};
SDUDocument._header = null;
SDUDocument._current_page = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
SDUDocument.initialize = function(){
  this.clear();
}
SDUDocument.clear = function(){
  this._data = {Page: []};
  this._current_page_data = {};
  this._next_index = {Page: 0};
  this._header = new Header();
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
Object.defineProperty(SDUDocument, 'current_page_data', {
  get: function() {
    return this._current_page_data;
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
// * Functions
// --------------------------------------------------------------------------------
SDUDocument.addElement = function(type, element, not_update){
  if(!this._data[type]) this._data[type] = {};
  this._data[type][element.id] = element;
  if(!not_update) this.updateCurrentPageData();
}
SDUDocument.deleteElement = function(type, id, not_update){
  if(!id || !this._data[type] || !this._data[type][id]) return;
  this._data[type][id].onDelete.call(this._data[type][id]);
  delete this._data[type][id];
  if(!not_update) this.updateCurrentPageData();
}
// --------------------------------------------------------------------------------
SDUDocument.getNextIndex = function(type){
  if(!this._next_index[type]) this._next_index[type] = 1;
  return type + "." + (this._next_index[type] ++);
}
// --------------------------------------------------------------------------------
SDUDocument.isObjectInCurrentPage = function(obj){
  if(obj.page){
    return obj.page === this.getCurrentPageId()
  }else if(obj.pages){
    return obj.pages.indexOf(this.getCurrentPageId()) !== -1
  }
  return false
}
SDUDocument.updateCurrentPageData = function(){
  this._current_page_data = {};
  CollideManager.clear();
  if(this._current_page <= 0 || this._data[Page.TAG].length === 0) return;
  for(let i in this._data){
    if(i !== Page.TAG){
      this._current_page_data[i] = {};
      for(let j in this._data[i]){
        if(this.isObjectInCurrentPage(this._data[i][j])){
          this._current_page_data[i][j] = this._data[i][j];
        }
      }
    }
  }
}
SDUDocument.getElements = function(type){
  return this._data[type];
}
SDUDocument.getElement = function(type, id){
  return this._data[type][id];
}
SDUDocument.getCurrentPageElements = function(type){
  return this._current_page_data[type];
}
SDUDocument.getCurrentPageElement = function(type, id){
  return this._current_page_data[type][id];
}
// --------------------------------------------------------------------------------
SDUDocument.getHeader = function(){
  if (this._header === null){
    this._header = new Header();
  }
  return this._header
}
// --------------------------------------------------------------------------------
SDUDocument.addPage = async function(page){
  this._data.Page.splice(this._current_page, 0, page);
  await this.setCurrentPage(this._current_page + 1);
}
SDUDocument.clearPage = function(index){
  this._data.Page[index - 1].onDelete.call(this._data.Page[index - 1]);
  this.updateCurrentPageData();
}
SDUDocument.deletePage = async function(){
  if(this._data.Page.length <= 0) return;
  this.clearPage(this._current_page);
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
SDUDocument.getCurrentPageObject = function(){
  return this._current_page > 0 ? this._data[Page.TAG][this._current_page - 1] : null;
}
SDUDocument.getCurrentPageId = function(){
  return this._current_page > 0 ? this._data[Page.TAG][this._current_page - 1].id : null;
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
  this.updateCurrentPageData();
  await Graphics.setImage(this._data.Page[this._current_page - 1].src);
  this.getCurrentPageObject().setSize(Graphics._image.width, Graphics._image.height)
}
// --------------------------------------------------------------------------------
SDUDocument.loadJson = async function(json){
  this._data = {};
  let temp = JSON.parse(json);
  for(let i in temp){
    if(i === "Index"){
      this._next_index = temp[i];
    }else if(i === Header.TAG){
      let header = window[i].prototype.getObject();
      header.loadJson(temp[i]);
      this._header = header;
    }else if(i === Page.TAG){
      this._data[i] = [];
      for(let j in temp[i]){
        let page = window[i].prototype.getObject();
        page.loadJson(temp[i][j]);
        this._data[i].push(page);
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
    Index: this._next_index,
    Header: this._header.saveJson()
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
  let temp = {
    Header: this._header.exportJson()
  };
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
