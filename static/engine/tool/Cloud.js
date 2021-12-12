// ================================================================================
// * Cloud <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/05/23 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.ToolTip, id: 'tool-tooltip-update-cloud-document-list', dictionary:[
      { id: 'zh-cn', text: ['更新云端文档列表'] },
      { id: 'zh-tw', text: ['更新雲端文檔列表'] },
      { id: 'en-us', text: ['Update Cloud Document List'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Tool
// ================================================================================
ToolManager.addTool(new Tool('update-cloud-document-list', 'tool-tooltip-update-cloud-document-list', 'mdi-refresh', Tool.Slot.CLOUD, {
  on_click : function(){
    CloudManager.updateCloudDocumentData();
  }
}));
// ================================================================================
