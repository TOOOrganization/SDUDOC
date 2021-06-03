// ================================================================================
// * Document <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/31 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Header
// ================================================================================
function Header(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Header.TAG = "Header";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Header.TOOLTIP = ["文章标题", "文章作者", "所属书名", "作者朝代"]
// --------------------------------------------------------------------------------
Header._title = "";
Header._author = "";
Header._book = "";
Header._dynasty = "";
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Header.prototype.initialize = function(){
  this._title = "";
  this._author = "";
  this._book = "";
  this._dynasty = "";
}
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Header.prototype, 'title', {
  get: function() {
    return this._title;
  },
  set: function(value) {
    this._title = value;
  },
  configurable: true
});
Object.defineProperty(Header.prototype, 'author', {
  get: function() {
    return this._author;
  },
  set: function(value) {
    this._author = value;
  },
  configurable: true
});
Object.defineProperty(Header.prototype, 'book', {
  get: function() {
    return this._book;
  },
  set: function(value) {
    this._book = value;
  },
  configurable: true
});
Object.defineProperty(Header.prototype, 'dynasty', {
  get: function() {
    return this._dynasty;
  },
  set: function(value) {
    this._dynasty = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Header.prototype.setData = function(args){
  this._title = args[0];
  this._author = args[1];
  this._book = args[2];
  this._dynasty = args[3];
}
// --------------------------------------------------------------------------------
Header.prototype.getData = function(){
  return [this._title, this._author, this._book, this._dynasty];
}
// --------------------------------------------------------------------------------
Header.prototype.getObject = function(){
  return new Header();
}
// --------------------------------------------------------------------------------
Header.prototype.onDelete = function(){

};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Header.prototype.loadJson = function(json){
  this._title = json._title;
  this._author = json._author;
  this._book = json._book;
  this._dynasty = json._dynasty;
}
Header.prototype.saveJson = function(){
  return {
    _title: this._title,
    _author: this._author,
    _book: this._book,
    _dynasty: this._dynasty
  }
}
Header.prototype.exportJson = function(){
  return {
    title: this._title,
    author: this._author,
    book: this._book,
    dynasty: this._dynasty
  }
}
// ================================================================================

// ================================================================================
// * Register Tool
// ================================================================================
ToolManager.addTool(new Tool("new_document", "新建文档", "mdi-file-plus-outline", Tool.Type.DOCUMENT, "", function(){
  Engine.alert("您真的要新建文档吗？未保存的数据将全部丢失。", function(){
    Engine.owner.alert_dialog = false;
    DocumentManager.new();
  });
}));
ToolManager.addTool(new Tool("edit_info", "编辑文档信息", "mdi-circle-edit-outline", Tool.Type.DOCUMENT, "", function(){
  Engine.prompt("编辑文档信息", Header.TOOLTIP,
    SDUDocument.getHeader().getData(),function(){
    Engine.owner.prompt_dialog = false;
    SDUDocument.getHeader().setData(Engine.owner.prompt_text);
  });
}));
ToolManager.addTool(new Tool("open_json", "打开文档", "mdi-file-outline", Tool.Type.DOCUMENT, "", async function(){
  await Engine.readJson(this,function(src, filename){
    DocumentManager.load(src, filename);
  });
}));
ToolManager.addTool(new Tool("save_json", "保存", "mdi-content-save", Tool.Type.DOCUMENT, "", function(){
  let json = DocumentManager.save();
  Engine.saveFile(json[0], json[1]);
}));
ToolManager.addTool(new Tool("export_document", "导出", "mdi-export", Tool.Type.DOCUMENT, "", function(){
  let doc = DocumentManager.export();
  Engine.saveFile(doc[0], doc[1]);
}));
// ================================================================================
