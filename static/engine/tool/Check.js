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
// * Register Tool
// ================================================================================
ToolManager.addTool(new Tool("update", "合并修改", "mdi-upload", Tool.Slot.CHECK, {
  on_click : function(){
    let id = Engine.getApp().check_id;
    let info = Engine.getApp().check_info;
    DocumentManager.updateElementWithUpdate(id.split(ElementManager.SAPARATOR)[0], id, info);
  }
}));
// ================================================================================
