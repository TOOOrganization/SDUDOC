// ================================================================================
// * ElementManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/06/03 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * ElementManager
// --------------------------------------------------------------------------------
function ElementManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
ElementManager.SAPARATOR = '_';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
ElementManager._element_pool_dict = {};
ElementManager._filtered_pool_dict = {};
ElementManager._next_index = {};
// --------------------------------------------------------------------------------
ElementManager.initializePool = function(type){
  this._element_pool_dict[type] = this._element_pool_dict[type] || {};
};
ElementManager.initializeIndex = function(type){
  this._next_index[type] = this._next_index[type] || 1;
};
// --------------------------------------------------------------------------------
ElementManager.isElementExist = function(type, id){
  return id && this._element_pool_dict[type] && this._element_pool_dict[type][id];
}
ElementManager.isFilteredElementExist = function(type, id){
  return id && this._filtered_pool_dict[type] && this._filtered_pool_dict[type][id];
}
// --------------------------------------------------------------------------------
ElementManager.addElement = function(type, element){
  this.initializePool(type);
  if (this.isElementExist(type, element.id)) return;
  this._element_pool_dict[type][element.id] = element;
};
ElementManager.deleteElement = function(type, id){
  if (!this.isElementExist(type, id)) return;
  this._element_pool_dict[type][id].onDelete.call(this._data[type][id]);
  delete this._element_pool_dict[type][id];
};
ElementManager.updateElement = function(type, id, json){
  if (!this.isElementExist(type, id)) return;
  for(let key in json) {
    this._element_pool_dict[type][id][key] = json[key];
  }
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
ElementManager.getNextIndex = function(type){
  this.initializeIndex(type);
  return type + this.SAPARATOR + (this._next_index[type] ++);
}
ElementManager.makeElement = function(type, pages){
  let element = window[type].prototype.newElement();
  arguments[0] = this.getNextIndex(type);
  element.initialize.apply(element, arguments);
  return element;
}
// --------------------------------------------------------------------------------
// * Get Element
// --------------------------------------------------------------------------------
ElementManager.getElement = function(type, id){
  if(!this.isElementExist(type, id)) return null;
  return this._element_pool_dict[type][id];
}
ElementManager.getFilteredElement = function(type, id){
  if(!this.isFilteredElementExist(type, id)) return null;
  return this._filtered_pool_dict[type][id];
}
// --------------------------------------------------------------------------------
// * Filter
// --------------------------------------------------------------------------------
ElementManager.isElementInPage = function(element, page_id){
  return element.pages && element.pages.indexOf(page_id) !== -1;
}
ElementManager.updateFilteredDict = function(page_id){
  this._filtered_pool_dict = {};
  for(let type in this._element_pool_dict){
    this._filtered_pool_dict[type] = {}
    for(let id in this._element_pool_dict[type]){
      if(this.isElementInPage(this._element_pool_dict[type][id], page_id)){
        this._filtered_pool_dict[type][id] = this._element_pool_dict[type][id];
      }
    }
  }
}
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
ElementManager.loadJson = function(json_object){
  this._next_index = json_object.Index;

  this._element_pool_dict = {};
  for(let type in json_object.Data){
    this._element_pool_dict[type] = {};
    for(let i in json_object.Data[type]){
      let element = window[type].prototype.newElement();
      element.loadJson(json_object.Data[type][i]);
      this._element_pool_dict[type][element.id] = element;
    }
  }
}
ElementManager.saveJson = function(){
  let output = {};

  output.Index = this._next_index;
  output.Data = {}

  for(let type in this._element_pool_dict){
    output.Data[type] = [];
    for(let id in this._element_pool_dict[type]){
      output.Data[type].push(this._element_pool_dict[type][id].saveJson());
    }
  }
  return output;
}
ElementManager.exportJson = function(){
  let output = {};
  for(let type in this._element_pool_dict){
    output[type] = [];
    for(let id in this._element_pool_dict[type]){
      let json_object = this._element_pool_dict[type][id].exportJson();
      if(json_object) output[type].push(json_object);
    }
  }
  return output;
}
// ================================================================================
