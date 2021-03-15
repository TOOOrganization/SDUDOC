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
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
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
// * Register Tools
// ================================================================================
ToolManager.addTool(new Tool("新建页面", "mdi-card-plus-outline", Tool.Type.PAGE, "", async function(){
  await Engine.readImage(this,function(src){
    DocumentManager.newPage(src);
  });
}));
ToolManager.addTool(new Tool("前移一页", "mdi-arrow-left-bold", Tool.Type.PAGE, "", function(){

}));
ToolManager.addTool(new Tool("设定页码", "mdi-counter", Tool.Type.PAGE, "", function(){

}));
ToolManager.addTool(new Tool("后移一页", "mdi-arrow-right-bold", Tool.Type.PAGE, "", function(){

}));
ToolManager.addTool(new Tool("删除页面", "mdi-close", Tool.Type.PAGE, "", function(){

}));
// ================================================================================
