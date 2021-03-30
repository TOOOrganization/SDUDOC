// ================================================================================
// * Document <SDUDOC Engine>
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
ToolManager.addTool(new Tool("new_document", "新建文档", "mdi-file-plus-outline", Tool.Type.DOCUMENT, "", function(){
  Engine.alert("您真的要新建文档吗？未保存的数据将全部丢失。", function(){
    Engine.owner.alert_dialog = false;
    DocumentManager.new();
  });
}));
ToolManager.addTool(new Tool("edit_info", "编辑文档信息", "mdi-circle-edit-outline", Tool.Type.DOCUMENT, "", function(){

}));
ToolManager.addTool(new Tool("open_json", "打开文档", "mdi-file-outline", Tool.Type.DOCUMENT, "", async function(){
  await Engine.readJson(this,function(src, filename){
    DocumentManager.load(src, filename);
  });
}));
ToolManager.addTool(new Tool("save_json", "保存", "mdi-content-save", Tool.Type.DOCUMENT, "", function(){
  let json = DocumentManager.save();
  Engine.saveFile(json[0], json[1]);
}));
ToolManager.addTool(new Tool("export_document", "导出", "mdi-export", Tool.Type.DOCUMENT, "", function(){
  let doc = DocumentManager.export();
  Engine.saveFile(doc[0], doc[1]);
}));
// ================================================================================
