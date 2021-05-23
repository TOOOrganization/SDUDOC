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
ToolManager.addTool(new Tool("t", "检查", "mdi-file-plus-outline", Tool.Type.CHECK, "", function(){
  DocumentManager.extractElement("Page", );
}));
ToolManager.addTool(new Tool("t2", "检查", "mdi-file-plus-outline", Tool.Type.CHECK, "", function(){
  DocumentManager.updateElement();
}));
// ================================================================================
