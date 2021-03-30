// ================================================================================
// * DocumentManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * DocumentManager
// --------------------------------------------------------------------------------
function DocumentManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
DocumentManager.MAX_HISTORY = 100;
// --------------------------------------------------------------------------------
DocumentManager._filename = null;
DocumentManager._history = [];
DocumentManager._now_history = 0;
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
DocumentManager.clear = function(){
  SDUDocument.clear();
  Engine.owner.page_list = [];
  Engine.owner.current_page = 0;
  this._filename = null;
  this._history = [];
  this._now_history = 0;
}
DocumentManager.updateList = function(){
  Engine.owner.page_list = this.getPageList();
  Engine.owner.current_page = SDUDocument.current_page - 1;
}
// --------------------------------------------------------------------------------
DocumentManager.addElement = function(type, element){
  SDUDocument.addElement(type, element);
  Graphics.refresh();
  this.push();
}
DocumentManager.deleteElement = function(type, id){
  SDUDocument.deleteElement(type, id);
  Graphics.refresh();
  this.push();
}
// --------------------------------------------------------------------------------
DocumentManager.newDocument = function(){
  this.clear();
  this.updateList();
}
DocumentManager.newPage = async function(src){
  await SDUDocument.addPage(PageFactory.makeObject(src));
  this.updateList();
  this.push();
}
DocumentManager.deletePage = async function(){
  await SDUDocument.deletePage();
  this.updateList();
  this.push();
}
// --------------------------------------------------------------------------------
DocumentManager.movePagePlus = async function(){
  await SDUDocument.movePagePlus();
  this.updateList();
  this.push();
}
DocumentManager.movePageMinus = async function(){
  await SDUDocument.movePageMinus();
  this.updateList();
  this.push();
}
DocumentManager.movePage = async function(target){
  await SDUDocument.movePageTo(target);
  this.updateList();
  this.push();
}
// --------------------------------------------------------------------------------
DocumentManager.getNextIndex = function(key){
  return SDUDocument.getNextIndex(key);
}
// --------------------------------------------------------------------------------
DocumentManager.getPageList = function(){
  let pages = SDUDocument.data.Page;
  let data = [];
  for(let i = 0;i < pages.length; i++){
    data.push({
      id: i + 1,
      src: pages[i].src
    });
  }
  return data;
}
DocumentManager.getCurrentPage = function(){
  return SDUDocument.getCurrentPage();
}
DocumentManager.getCurrentPageId = function(){
  return SDUDocument.getCurrentPage() > 0 ? SDUDocument.data.Page[SDUDocument.getCurrentPage() - 1].id : null;
}
DocumentManager.setCurrentPage = async function(index){
  await SDUDocument.setCurrentPage(index + 1);
}
// --------------------------------------------------------------------------------
DocumentManager.cloneObject = function (obj) {
  if(obj === null) return null
  if(typeof obj !== 'object') return obj;
  if(obj.constructor === Date) return new Date(obj);
  let newObj = new obj.constructor();
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let val = obj[key];
      newObj[key] = typeof val === 'object' ? arguments.callee(val) : val;
    }
  }
  return newObj;
};
DocumentManager.xmlToObject = function(xml){
  if(!xml) return;
  let list = xml.split("  ");
  if(list.length === 0) return;
  list[0] = list[0].substring(1, list[0].length);
  list[list.length - 1] = list[list.length - 1].substring(0, list[list.length - 1].length - 2);
  let object = this.cloneObject(window[list.shift()].get());
  for(let i in list){
    let data = list[i].split("=");
    switch(data[1]){
      case "false":
        object[data[0]] = false;
        break;
      case "true":
        object[data[0]] = true;
        break;
      default:
        if(data[1].charAt(0) === "\""){
          object[data[0]] = data[1].substring(1, data[1].length - 1)
        }else{
          object[data[0]] = Number(data[1]);
        }
    }
  }
  return object;
}
DocumentManager.objectToXml = function(obj){
  let string_builder = "";
  string_builder += "<" + obj.__proto__.constructor.name;
  for(let i in obj){
    switch(typeof obj[i]){
      case "string":
        string_builder += "  " + i + "=\"" + obj[i] + "\"";
        break;
      case "number": case "boolean":
        string_builder += "  " + i + "=" + obj[i];
        break;
    }
  }
  string_builder += "/>";
  return string_builder;
}
// --------------------------------------------------------------------------------
DocumentManager.getSaveFilename = function(){
  return (this._filename ? this._filename : "Untitled") + ".sjs";
}
DocumentManager.getExportFilename = function(){
  return (this._filename ? this._filename : "Untitled") + ".sdudoc";
}
DocumentManager.new = function(){
  this._filename = null;
  this.newDocument();
}
DocumentManager.load = async function(json, filename){
  this._filename = filename;
  await SDUDocument.loadJson(json);
  this.updateList();
}
DocumentManager.save = function(){
  return [this.getSaveFilename(), SDUDocument.saveJson()];
}
DocumentManager.export = function(){
  return [this.getExportFilename(), SDUDocument.exportJson()];
}
// --------------------------------------------------------------------------------
DocumentManager.push = function(){
  this._history.splice(++ this._now_history, this._history.length - this._now_history);
  this._history.push(SDUDocument.saveJson());
  if(this._history.length >= this.MAX_HISTORY){
    this._history.shift();
  }
  this._now_history = this._history.length - 1;
}
DocumentManager.undo = async function(){
  if(this._now_history > 0){
    await SDUDocument.loadJson(this._history[-- this._now_history]);
  }
}
DocumentManager.redo = async function(){
  if(this._now_history < this._history.length - 1){
    await SDUDocument.loadJson(this._history[++ this._now_history]);
  }
}
// ================================================================================
