// ================================================================================
// * Dev <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Initial
// ================================================================================

// ================================================================================
// * Register Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('auto-book', '自动生成文档', 'mdi-book', Tool.Slot.DEV, {
  on_click: function () {
    Engine.prompt(Engine, '输入书籍字符', ['请输入字符'], [null], async function (text_array) {
      if (text_array[0]) {
        await DocumentManager.generateDocumentByText(1750, 2479, 10, 16,
          {'left': 150, 'right': 150, 'top': 130, 'bottom': 130}, text_array[0]);
      }
    });
  }
}));
// ================================================================================
