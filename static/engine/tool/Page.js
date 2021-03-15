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
// * Property
// --------------------------------------------------------------------------------
Page._id = "";
Page._src = "";
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Page.prototype.initialize = function(id, src){
  this._id = id;
  this._src = src;
}
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Page.prototype, 'id', {
  get: function() {
    return this._id;
  },
  set: function(value) {
    this._id = value;
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
// --------------------------------------------------------------------------------
Page.prototype.setData = function(id, src){
  this._id = id;
  this._src = src;
}
// --------------------------------------------------------------------------------
Page.prototype.getObject = function(){
  return new Page("", "");
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
  return SDUDocument.getNextIndex("Page");
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
  Engine.owner.prompt_text = SDUDocument.current_page;
  Engine.prompt("输入目标页码", async function(){
    Engine.owner.prompt_dialog = false;
    await DocumentManager.movePage(Number(Engine.owner.prompt_text));
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
// ================================================================================
