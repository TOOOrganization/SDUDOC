// ================================================================================
// * Document <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/06/04 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Register Tool
// ================================================================================
ToolManager.addTool(new Tool("new_document", "新建文档", "mdi-file-plus-outline", Tool.Slot.DOCUMENT, {
  on_click: function(){
    Engine.alert(Engine, "您真的要新建文档吗？未保存的数据将全部丢失。", function(){
      DocumentManager.newDocument();
    });
  }
}));
ToolManager.addTool(new Tool("edit_info", "编辑文档信息", "mdi-circle-edit-outline", Tool.Slot.DOCUMENT, {
  on_click: function(){
    Engine.prompt(Engine, "编辑文档信息", DocumentManager.getHeaderTooltip(), DocumentManager.getHeaderData(),
      function(text_array){
        DocumentManager.setHeaderData(text_array);
      }
    );
  }
}));
ToolManager.addTool(new Tool("open_json", "打开文档", "mdi-file-outline", Tool.Slot.DOCUMENT, {
  on_click: async function(){
    await Engine.readJson(Engine, function(filename, src){
      DocumentManager.load(filename, src);
    });
  }
}));
ToolManager.addTool(new Tool("save_json", "保存", "mdi-content-save", Tool.Slot.DOCUMENT, {
  on_click: function(){
    Engine.saveFile(DocumentManager.getSaveFilename(), DocumentManager.save());
  }
}));
ToolManager.addTool(new Tool("export_document", "导出", "mdi-export", Tool.Slot.DOCUMENT, {
  on_click: function(){
    Engine.saveFile(DocumentManager.getExportFilename(), DocumentManager.export());
  }
}));
// ================================================================================
