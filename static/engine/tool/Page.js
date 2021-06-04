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
ToolManager.addTool(new Tool("new_page", "新建页面", "mdi-card-plus-outline", Tool.Slot.PAGE, {
  on_click: async function() {
    await Engine.readImage(this, async function (src, filename) {
      await DocumentManager.addAfterCurrentPage(src);//DocumentManager.newWebPage(src, filename);
    });
  }
}));
ToolManager.addTool(new Tool("move_page_minus", "前移一页", "mdi-arrow-left-bold", Tool.Slot.PAGE, {
  on_click: async function() {
    await DocumentManager.moveCurrentPageMinus();
  }
}));
ToolManager.addTool(new Tool("move_page_set", "设定页码", "mdi-counter", Tool.Slot.PAGE, {
  on_click: function() {
    Engine.prompt("输入目标页码", ["请输入要移动到的页码"], [DocumentManager.getCurrentPage()], async function() {
      Engine.getApp().prompt_dialog = false;
      await DocumentManager.moveCurrentPageTo(Number(Engine.getApp().prompt_text[0]));
    });
  }
}));
ToolManager.addTool(new Tool("move_page_add", "后移一页", "mdi-arrow-right-bold", Tool.Slot.PAGE, {
  on_click: async function(){
    await DocumentManager.moveCurrentPagePlus();
  }
}));
ToolManager.addTool(new Tool("remove_page", "移除页面", "mdi-close", Tool.Slot.PAGE, {
  on_click: function() {
    if (DocumentManager.getCurrentPage() <= 0) return;
    Engine.alert("您确认要移除页面吗？", async function () {
      Engine.getApp().alert_dialog = false;
      await DocumentManager.removeCurrentPage();
    });
  }
}));
ToolManager.addTool(new Tool("module_page", "以模板切割页面", "mdi-view-compact-outline", Tool.Slot.PAGE, function(){
  if(SDUDocument.current_page <= 0) return;
  Engine.prompt("输入模板分割数", ["请输入横向分割数", "请输入纵向分割数"], [5, 5],function(){
    Engine.owner.prompt_dialog = false;
    DocumentManager.createModulePage(Number(Engine.owner.prompt_text[0]), Number(Engine.owner.prompt_text[1]),
      {'left': 0, 'right':0, 'top':0, 'bottom':0}, function(polygon){})
  });
}));
// ================================================================================
