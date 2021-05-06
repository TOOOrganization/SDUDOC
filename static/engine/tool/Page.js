// ================================================================================
// * Page <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/10 - Version 1.0.0
//     - Initial
// ================================================================================

// ================================================================================
// * Page
// ================================================================================
function Page(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Page.TAG = "Page";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Page._id = "";
Page._src = "";
// --------------------------------------------------------------------------------
Page._width = 0;
Page._height = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Page.prototype.initialize = function(id, src){
  this._id = id;
  this._src = src;
  this._width = 0;
  this._height = 0;
}
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Page.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Page.prototype, 'src', {
  get: function() {
    return this._src;
  },
  set: function(value) {
    this._src = value;
  },
  configurable: true
});
Object.defineProperty(Page.prototype, 'width', {
  get: function() {
    return this._width;
  },
  set: function(value) {
    this._width = value;
  },
  configurable: true
});
Object.defineProperty(Page.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(value) {
    this._height = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Page.prototype.setData = function(id, src){
  this._id = id;
  this._src = src;
}
// --------------------------------------------------------------------------------
Page.prototype.setSize = function(width, height){
  this._width = width;
  this._height = height;
}
// --------------------------------------------------------------------------------
Page.prototype.getObject = function(){
  return new Page("", "");
}
// --------------------------------------------------------------------------------
Page.prototype.onDelete = function(){
  let dots = SDUDocument.getCurrentPageElements(Dot2D.TAG);
  for(let i in dots){
    if(SDUDocument.getElement(Dot2D.TAG, i)) {
      SDUDocument.deleteElement(Dot2D.TAG, i);
    }
  }
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Page.prototype.loadJson = function(json){
  this._id = json._id;
  this._src = json._src;
  this._width = json._width;
  this._height = json._height;
}
Page.prototype.saveJson = function(){
  return {
    _id: this._id,
    _src: this._src,
    _width: this._width,
    _height: this._height
  }
}
Page.prototype.exportJson = function(){
  return {
    id: this._id,
    src: this._src,
    width: this._width,
    height: this._height
  }
}
// ================================================================================

// ================================================================================
// * PageFactory
// ================================================================================
function PageFactory(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
PageFactory.makeObject = function(src){
  return new Page(this.getNextIndex(), src);
}
PageFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Page.TAG);
}
// ================================================================================

// ================================================================================
// * Register Tool
// ================================================================================
ToolManager.addTool(new Tool("new_page", "新建页面", "mdi-card-plus-outline", Tool.Type.PAGE, "", async function(){
  await Engine.readImage(this,function(src){
    DocumentManager.newPage(src);
  });
}));
ToolManager.addTool(new Tool("move_page_minus", "前移一页", "mdi-arrow-left-bold", Tool.Type.PAGE, "", async function(){
  await DocumentManager.movePageMinus();
}));
ToolManager.addTool(new Tool("move_page_set", "设定页码", "mdi-counter", Tool.Type.PAGE, "", function(){
  Engine.prompt("输入目标页码", ["请输入要移动到的页码"], [SDUDocument.current_page],async function(){
    Engine.owner.prompt_dialog = false;
    await DocumentManager.movePage(Number(Engine.owner.prompt_text[0]));
  });
}));
ToolManager.addTool(new Tool("move_page_add", "后移一页", "mdi-arrow-right-bold", Tool.Type.PAGE, "", async function(){
  await DocumentManager.movePagePlus();
}));
ToolManager.addTool(new Tool("delete_page", "删除页面", "mdi-close", Tool.Type.PAGE, "", function(){
  if(SDUDocument.current_page <= 0) return;
  Engine.alert("您确认要删除页面吗？", async function(){
    Engine.owner.alert_dialog = false;
    await DocumentManager.deletePage();
  });
}));
ToolManager.addTool(new Tool("module_page", "以模板切割页面", "mdi-view-compact-outline", Tool.Type.PAGE, "", function(){
  if(SDUDocument.current_page <= 0) return;
  Engine.prompt("输入模板分割数", ["请输入横向分割数", "请输入纵向分割数"], [5, 5],function(){
    Engine.owner.prompt_dialog = false;
    DocumentManager.createModulePage(Number(Engine.owner.prompt_text[0]), Number(Engine.owner.prompt_text[1]))
  });
}));

// ================================================================================
