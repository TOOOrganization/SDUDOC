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
// * Functions
// --------------------------------------------------------------------------------
DocumentManager.clear = function(){
  SDUDocument.clear();
  Engine.owner.page_list = [];
  Engine.owner.current_page = 0;
}
DocumentManager.updateList = function(){
  Engine.owner.page_list = this.getPageList();
  Engine.owner.current_page = SDUDocument.current_page - 1;
}
DocumentManager.newPage = async function(src){
  await SDUDocument.addPage(PageFactory.makeObject(src));
  this.updateList();
}
DocumentManager.deletePage = async function(){
  await SDUDocument.deletePage();
  this.updateList();
}
DocumentManager.movePagePlus = async function(){
  await SDUDocument.movePagePlus();
  this.updateList();
}
DocumentManager.movePageMinus = async function(){
  await SDUDocument.movePageMinus();
  this.updateList();
}
DocumentManager.movePage = async function(target){
  await SDUDocument.movePage(target);
  this.updateList();
}
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
DocumentManager.newDocument = function(){
  this.clear();
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
// ================================================================================
