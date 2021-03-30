// ================================================================================
// * History <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/31 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Register Tool
// ================================================================================
ToolManager.addTool(new Tool("undo", "撤销(Ctrl+Z)", "mdi-undo-variant", Tool.Type.HISTORY, "", function(){

}));
ToolManager.addTool(new Tool("redo", "重做(Ctrl+Y)", "mdi-redo-variant", Tool.Type.HISTORY, "", function(){

}));
ToolManager.addTool(new Tool("copy", "复制(Ctrl+C)", "mdi-content-copy", Tool.Type.HISTORY, "", function(){

}));
ToolManager.addTool(new Tool("paste", "粘贴(Ctrl+V)", "mdi-clipboard-file-outline", Tool.Type.HISTORY, "", function(){

}));
// ================================================================================
