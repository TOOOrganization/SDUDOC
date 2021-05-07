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
// * Initialize
// --------------------------------------------------------------------------------
DocumentManager.initialize = function(){
  SDUDocument.clear();
  this.push();
};
DocumentManager.clear = function(){
  SDUDocument.clear();
  Engine.owner.page_list = [];
  Engine.owner.current_page = 0;
  this._filename = null;
  this._history = [];
  this._now_history = 0;
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
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
  this.push();
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
DocumentManager.createModulePage = function(x, y){
  SDUDocument.clearPage(SDUDocument.getCurrentPage());
  let width = Graphics._image.width;
  let height = Graphics._image.height;
  let page = this.getCurrentPageId()
  let base_dots = [], base_lines = [];
  base_dots[0] = DotFactory.makeObject(page, Dot2D.Type.FREE, 0, 0);
  base_dots[1] = DotFactory.makeObject(page, Dot2D.Type.FREE, width, 0);
  base_dots[2] = DotFactory.makeObject(page, Dot2D.Type.FREE, width, height);
  base_dots[3] = DotFactory.makeObject(page, Dot2D.Type.FREE, 0, height);
  for(let i = 0; i < base_dots.length; i++){
    SDUDocument.addElement(Dot2D.TAG, base_dots[i], true);
    base_dots[i] = base_dots[i].id;
  }
  base_lines[0] = LineFactory.makeObject(page, base_dots[0], base_dots[1]);
  base_lines[1] = LineFactory.makeObject(page, base_dots[1], base_dots[2]);
  base_lines[2] = LineFactory.makeObject(page, base_dots[2], base_dots[3]);
  base_lines[3] = LineFactory.makeObject(page, base_dots[3], base_dots[0]);
  for(let i = 0; i < base_lines.length; i++){
    SDUDocument.addElement(Line2D.TAG, base_lines[i], true);
    base_lines[i] = base_lines[i].id;
  }
  let dependent_dots = [[],[],[],[]], dependent_lines = [[],[]];
  for(let i = 0; i < x - 1; i++){
    let dot1 = DotFactory.makeObject(page, Dot2D.Type.DEPENDENT, base_lines[0], (1 / x * (i + 1)));
    let dot2 = DotFactory.makeObject(page, Dot2D.Type.DEPENDENT, base_lines[2], 1 - (1 / x * (i + 1)));
    SDUDocument.addElement(Dot2D.TAG, dot1, true);
    SDUDocument.addElement(Dot2D.TAG, dot2, true);
    dependent_dots[0].push(dot1.id);
    dependent_dots[2].push(dot2.id);
    let line = LineFactory.makeObject(page, dot1.id, dot2.id);
    SDUDocument.addElement(Line2D.TAG, line, true);
    dependent_lines[0].push(line.id);
  }
  for(let i = 0; i < y - 1; i++){
    let dot1 = DotFactory.makeObject(page, Dot2D.Type.DEPENDENT, base_lines[1], (1 / y * (i + 1)));
    let dot2 = DotFactory.makeObject(page, Dot2D.Type.DEPENDENT, base_lines[3], 1 - (1 / y * (i + 1)));
    SDUDocument.addElement(Dot2D.TAG, dot1, true);
    SDUDocument.addElement(Dot2D.TAG, dot2, true);
    dependent_dots[1].push(dot1.id);
    dependent_dots[3].push(dot2.id);
    let line = LineFactory.makeObject(page, dot1.id, dot2.id);
    SDUDocument.addElement(Line2D.TAG, line, true);
    dependent_lines[1].push(line.id);
  }
  let intersection_dots = [];
  for(let i = 0; i < y - 1; i++){
    intersection_dots.push([]);
    for(let j = 0; j < x - 1; j++){
      let dot = DotFactory.makeObject(page, Dot2D.Type.INTERSECTION, dependent_lines[0][j], dependent_lines[1][i]);
      SDUDocument.addElement(Dot2D.TAG, dot, true);
      intersection_dots[i].push(dot.id);
    }
  }
  let dot_map = [];
  dot_map.push([base_dots[0]].concat(dependent_dots[0]).concat([base_dots[1]]));
  for(let i = 0; i < y - 1; i++){
    dot_map.push([dependent_dots[3][i]].concat(intersection_dots[i]).concat([dependent_dots[1][i]]));
  }
  dot_map.push([base_dots[3]].concat(dependent_dots[2]).concat([base_dots[2]]));
  for(let i = 0; i < y; i++){
    for(let j = 0; j < x; j++){
      let points = [dot_map[i][j], dot_map[i][j + 1], dot_map[i + 1][j + 1], dot_map[i + 1][j]];
      let polygon = PolygonFactory.makeObject(page, points);
      SDUDocument.addElement(Polygon2D.TAG, polygon, true);
    }
  }
  SDUDocument.updateCurrentPageData();
  Graphics.refresh();
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
  let pages = SDUDocument.getElements(Page.TAG);
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
  return SDUDocument.getCurrentPageId();
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
  this.clearHistory();
  this.push();
}
DocumentManager.load = async function(json, filename){
  let name = filename.split('.')
  await name.pop()
  this._filename = name.join('.');
  await SDUDocument.loadJson(json);
  this.updateList();
  this.clearHistory();
  this.push();
}
DocumentManager.save = function(){
  return [this.getSaveFilename(), SDUDocument.saveJson()];
}
DocumentManager.export = function(){
  return [this.getExportFilename(), SDUDocument.exportJson()];
}
// --------------------------------------------------------------------------------
DocumentManager.clearHistory = function(){
  this._history = []
  this._now_history = 0;
}
DocumentManager.push = function(){
  this._history.splice(++ this._now_history, this._history.length - this._now_history);
  this._history.push([SDUDocument.saveJson(), SDUDocument.getCurrentPage()]);
  if(this._history.length >= this.MAX_HISTORY){
    this._history.shift();
  }
  this._now_history = this._history.length - 1;
  SDUDocument.updateCurrentPageData();
}
DocumentManager.undo = async function(){
  if(this._now_history > 0){
    let index = -- this._now_history;
    await SDUDocument.loadJson(this._history[index][0]);
    await SDUDocument.setCurrentPage(this._history[index][1]);
    this.updateList();
  }
}
DocumentManager.redo = async function(){
  if(this._now_history < this._history.length - 1){
    let index = ++ this._now_history;
    await SDUDocument.loadJson(this._history[index][0]);
    await SDUDocument.setCurrentPage(this._history[index][1]);
    this.updateList();
  }
}
// ================================================================================
