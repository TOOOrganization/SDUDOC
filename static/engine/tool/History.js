// ================================================================================
// * History <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/31 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.ToolTip, id: 'tool-tooltip-undo', dictionary:[
      { id: 'zh-cn', text: ['撤销 (Ctrl+Z)'] },
      { id: 'zh-tw', text: ['撤銷 (Ctrl+Z)'] },
      { id: 'en-us', text: ['Undo (Ctrl+Z)'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-redo', dictionary:[
      { id: 'zh-cn', text: ['重做 (Ctrl+Y)'] },
      { id: 'zh-tw', text: ['重做 (Ctrl+Y)'] },
      { id: 'en-us', text: ['Redo (Ctrl+Y)'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('undo', 'tool-tooltip-undo', 'mdi-undo-variant', Tool.Slot.HISTORY,
  async function(){
    await HistoryManager.undo();
  })
);
ToolManager.addTool(new Tool('redo', 'tool-tooltip-redo', 'mdi-redo-variant', Tool.Slot.HISTORY,
  async function(){
    await HistoryManager.redo();
  })
);
// ToolManager.addTool(new Tool('copy', '复制(Ctrl+C)', 'mdi-content-copy', Tool.Slot.HISTORY, function(){
//
// }));
// ToolManager.addTool(new Tool('paste', '粘贴(Ctrl+V)', 'mdi-clipboard-file-outline', Tool.Slot.HISTORY, function(){
//
// }));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('_document.undo', 'key_down', 'Z', Engine,
  async function(event){
    if(event.ctrlKey){
      await HistoryManager.undo();
    }
  })
);
ToolManager.addHandler(new Handler('_document.redo', 'key_down', 'Y', Engine,
  async function(event){
    if(event.ctrlKey){
      await HistoryManager.redo();
    }
  })
);
// ================================================================================
