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
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Text, id: 'prompt-title-auto-generate-book', dictionary:[
      { id: 'zh-cn', text: ['输入自动生成书籍的字符集'] },
      { id: 'zh-tw', text: ['輸入自動生成書籍的字符集'] },
      { id: 'en-us', text: ['Input text for generate'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'prompt-tooltip-auto-generate-book', dictionary:[
      { id: 'zh-cn', text: ['请输入字符'] },
      { id: 'zh-tw', text: ['請輸入字符'] },
      { id: 'en-us', text: ['Input text'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-auto-generate-book', dictionary:[
      { id: 'zh-cn', text: ['自动生成文档'] },
      { id: 'zh-tw', text: ['自動生成文檔'] },
      { id: 'en-us', text: ['Auto Generate Document'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('auto-generate-book', 'tool-tooltip-auto-generate-book', 'mdi-book', Tool.Slot.DEV, {
  on_click: function () {
    Engine.prompt(Engine, 'prompt-title-auto-generate-book', [
        Language.get(Language.Type.ToolTip, 'prompt-tooltip-auto-generate-book')
      ], [null], async function (text_array) {
        if (text_array[0]) {
          await DocumentManager.generateDocumentByText(1750, 2479, 10, 16,
            {'left': 150, 'right': 150, 'top': 130, 'bottom': 130}, text_array[0]);
        }
      }
    );
  }
}));
// ================================================================================
