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
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Text, id: 'alert-title-new-document', dictionary:[
      { id: 'zh-cn', text: ['您确认要新建文档吗？未保存的数据将全部丢失。'] },
      { id: 'zh-tw', text: ['您確認要新建文檔嗎？未保存的數據將全部丟失。'] },
      { id: 'en-us', text: ['Do you really want to create a new document? All unsaved data will be lost.'] }
    ]
  }, {
    type: Language.Type.Text, id: 'alert-title-open-document', dictionary:[
      { id: 'zh-cn', text: ['您确认要打开文档吗？未保存的数据将全部丢失。'] },
      { id: 'zh-tw', text: ['您確認要打開文檔嗎？未保存的數據將全部丟失。'] },
      { id: 'en-us', text: ['Do you really want to open document? All unsaved data will be lost.'] }
    ]
  }, {
    type: Language.Type.Text, id: 'prompt-title-new-document', dictionary:[
      { id: 'zh-cn', text: ['编辑文档信息'] },
      { id: 'zh-tw', text: ['編輯文檔信息'] },
      { id: 'en-us', text: ['Edit Header'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-new-document', dictionary:[
      { id: 'zh-cn', text: ['新建文档'] },
      { id: 'zh-tw', text: ['新建文檔'] },
      { id: 'en-us', text: ['New Document'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-edit-header', dictionary:[
      { id: 'zh-cn', text: ['编辑文档信息'] },
      { id: 'zh-tw', text: ['編輯文檔信息'] },
      { id: 'en-us', text: ['Edit Header'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-open-document', dictionary:[
      { id: 'zh-cn', text: ['打开文档'] },
      { id: 'zh-tw', text: ['打開文檔'] },
      { id: 'en-us', text: ['Open Document'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-save-document', dictionary:[
      { id: 'zh-cn', text: ['保存文档'] },
      { id: 'zh-tw', text: ['保存文檔'] },
      { id: 'en-us', text: ['Save Document'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-export-document', dictionary:[
      { id: 'zh-cn', text: ['导出文档'] },
      { id: 'zh-tw', text: ['導出文檔'] },
      { id: 'en-us', text: ['Export Document'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-export-document-old-version', dictionary:[
      { id: 'zh-cn', text: ['导出文档（旧版本）'] },
      { id: 'zh-tw', text: ['導出文檔（舊版本）'] },
      { id: 'en-us', text: ['Export Document (Old version)'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-upload-document', dictionary:[
      { id: 'zh-cn', text: ['上传文档'] },
      { id: 'zh-tw', text: ['上傳文檔'] },
      { id: 'en-us', text: ['Upload Document'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('new-document', 'tool-tooltip-new-document', 'mdi-file-plus-outline', Tool.Slot.DOCUMENT, {
  on_click: function(){
    Engine.alert(Engine, 'alert-title-new-document', function(){
      HistoryManager.clear();
      DocumentManager.newDocument();
    });
  }
}));
ToolManager.addTool(new Tool('edit-info', 'tool-tooltip-edit-header', 'mdi-circle-edit-outline', Tool.Slot.DOCUMENT, {
  on_click: function(){
    Engine.prompt(Engine, 'prompt-title-new-document', DocumentManager.getHeaderTooltip(), DocumentManager.getHeaderData(),
      async function(text_array){
        let old_document = JSON.stringify(DocumentManager.saveJson());
        await DocumentManager.setHeaderData(text_array);
        let new_document = JSON.stringify(DocumentManager.saveJson());
        await HistoryManager.push([new History(async function(){
          DocumentManager.loadJson(JSON.parse(old_document));
          await DocumentManager.afterChangePage();
        }, async function(){
          DocumentManager.loadJson(JSON.parse(new_document));
          await DocumentManager.afterChangePage();
        })], true);
      }
    );
  }
}));
ToolManager.addTool(new Tool('open-json', 'tool-tooltip-open-document', 'mdi-file-outline', Tool.Slot.DOCUMENT, {
  on_click: async function(){
    await Engine.alert(Engine, 'alert-title-open-document', async function(){
      await Engine.readJson(Engine, async function(filename, src){
        HistoryManager.clear();
        await DocumentManager.load(filename, src);
      });
    });
  }
}));
ToolManager.addTool(new Tool('save-json', 'tool-tooltip-save-document', 'mdi-content-save', Tool.Slot.DOCUMENT, {
  on_click: function(){
    Engine.saveFile(DocumentManager.getSaveFilename(), DocumentManager.save());
  }
}));
ToolManager.addTool(new Tool('export-document', 'tool-tooltip-export-document', 'mdi-export', Tool.Slot.DOCUMENT, {
  on_click: function(){
    Engine.saveFile(DocumentManager.getExportFilename(), DocumentManager.export());
  }
}));
ToolManager.addTool(new Tool('export-document-old', 'tool-tooltip-export-document-old-version', 'mdi-swap-vertical', Tool.Slot.DOCUMENT, {
  on_click: function(){
    Engine.saveFile(DocumentManager.getExportFilename(), DocumentManager.exportOldVersion());
  }
}));
ToolManager.addTool(new Tool('upload-document', 'tool-tooltip-upload-document', 'mdi-cloud-upload-outline', Tool.Slot.DOCUMENT, {
  on_click: async function(){
    await HttpRequest.upLoadDocument(DocumentManager.exportOldVersion());
  }
}));
// ================================================================================
