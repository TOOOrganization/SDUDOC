
// ================================================================================
// * Register Tool
// ================================================================================
ToolManager.addTool(new Tool("new_document", "新建文档", "mdi-file-plus-outline", Tool.Type.DOCUMENT, "", function(){
  Engine.alert("您真的要新建文档吗？未保存的数据将全部丢失。", function(){
    Engine.owner.alert_dialog = false;
    DocumentManager.newDocument();
  });
}));
ToolManager.addTool(new Tool("open_document", "打开文档", "mdi-file-multiple-outline", Tool.Type.DOCUMENT, "", function(){

}));
ToolManager.addTool(new Tool("save_document", "保存", "mdi-content-save", Tool.Type.DOCUMENT, "", function(){

}));
// ================================================================================
