// ================================================================================
// * Check <SDUDOC Engine>
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
    type: Language.Type.ToolTip, id: 'tool-tooltip-update-element', dictionary:[
      { id: 'zh-cn', text: ['强制更新所选文档组件（请先备份）'] },
      { id: 'zh-tw', text: ['強製更新所選文檔組件（請先備份）'] },
      { id: 'en-us', text: ['Force update element (Please backup first)'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Tool
// ================================================================================
ToolManager.addTool(new Tool('update-element', 'tool-tooltip-update-element', 'mdi-upload', Tool.Slot.CHECK, {
  on_click : async function(){
    let id = Engine.getApp().getRouterComponent().check_id;
    let info = Engine.getApp().getRouterComponent().check_info;
    if(!id || !info) return;

    let old_document = JSON.stringify(DocumentManager.saveJson());
    await DocumentManager.updateElement(id.split(ElementManager.SAPARATOR)[0], id, info);
    let new_document = JSON.stringify(DocumentManager.saveJson());
    await HistoryManager.push([new History(async function(){
      DocumentManager.loadJson(JSON.parse(old_document));
      await DocumentManager.afterChangePage();
    }, async function(){
      DocumentManager.loadJson(JSON.parse(new_document));
      await DocumentManager.afterChangePage();
    })], true);
    DocumentManager.afterChangeElement();
  }
}));
// ================================================================================
