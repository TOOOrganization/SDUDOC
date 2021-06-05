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
// * Register Tool
// ================================================================================
ToolManager.addTool(new Tool("undo", "撤销(Ctrl+Z)", "mdi-undo-variant", Tool.Slot.HISTORY, "", async function(){
  await DocumentManager.undo();
}));
ToolManager.addTool(new Tool("redo", "重做(Ctrl+Y)", "mdi-redo-variant", Tool.Slot.HISTORY, "", async function(){
  await DocumentManager.redo();
}));
// ToolManager.addTool(new Tool("copy", "复制(Ctrl+C)", "mdi-content-copy", Tool.Slot.HISTORY, function(){
//
// }));
// ToolManager.addTool(new Tool("paste", "粘贴(Ctrl+V)", "mdi-clipboard-file-outline", Tool.Slot.HISTORY, function(){
//
// }));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("_document.undo", "key_down", "Z", ToolManager, async function(event){
  if(event.ctrlKey){
    Engine.clearFactory();
    await DocumentManager.undo();
  }
}));
ToolManager.addHandler(new Handler("_document.redo", "key_down", "Y", ToolManager, async function(event){
  if(event.ctrlKey){
    Engine.clearFactory();
    await DocumentManager.redo();
  }
}));
// ================================================================================
