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
//   2021/06/05 - Version 1.0.0
//     - Initial
// ================================================================================

// ================================================================================
// * Register Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('new-page', '新建页面', 'mdi-card-plus-outline', Tool.Slot.PAGE, {
  on_click: async function() {
    await Engine.readImage(Engine, async function (src, filename) {
      await DocumentManager.addAfterCurrentPage(src, filename);
    });
  }
}));
ToolManager.addTool(new Tool('move-page-minus', '前移一页', 'mdi-arrow-left-bold', Tool.Slot.PAGE, {
  on_click: async function() {
    if (DocumentManager.getCurrentPage() <= 0) return;
    await DocumentManager.moveCurrentPageMinus();
  }
}));
ToolManager.addTool(new Tool('move-page-set', '设定页码', 'mdi-counter', Tool.Slot.PAGE, {
  on_click: async function() {
    if (DocumentManager.getCurrentPage() <= 0) return;
    await Engine.prompt(Engine, '输入目标页码', ['请输入要移动到的页码'], [DocumentManager.getCurrentPage()],
      async function(text_array) {
        await DocumentManager.moveCurrentPageTo(Number(text_array[0]));
      }
    );
  }
}));
ToolManager.addTool(new Tool('move-page-add', '后移一页', 'mdi-arrow-right-bold', Tool.Slot.PAGE, {
  on_click: async function(){
    if (DocumentManager.getCurrentPage() <= 0) return;
    await DocumentManager.moveCurrentPagePlus();
  }
}));
ToolManager.addTool(new Tool('remove-page', '移除页面', 'mdi-close', Tool.Slot.PAGE, {
  on_click: async function() {
    if (DocumentManager.getCurrentPage() <= 0) return;
    await Engine.alert(Engine, '您确认要移除页面吗？', async function () {
      await DocumentManager.removeCurrentPage();
    });
  }
}));
ToolManager.addTool(new Tool('module-page', '以模板切割页面', 'mdi-view-compact-outline', Tool.Slot.PAGE, {
  on_click: async function() {
    if (DocumentManager.getCurrentPage() <= 0) return;
    await Engine.prompt(Engine, '输入模板分割数', ['请输入横向分割数', '请输入纵向分割数'], [5, 5],
      function (text_array) {
        DocumentManager.createModulePage(Number(text_array[0]), Number(text_array[1]),
          {'left': 0, 'right': 0, 'top': 0, 'bottom': 0}, function (polygon) {});
      }
    );
  }
}));
// ================================================================================
