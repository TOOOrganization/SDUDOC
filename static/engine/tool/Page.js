// ================================================================================
// * Page <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/06/05 - Version 1.0.0
//     - Initial
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Text, id: 'alert-title-remove-page', dictionary:[
      { id: 'zh-cn', text: ['您确认要移除页面吗？该页面上的数据将会全部移除。'] },
      { id: 'zh-tw', text: ['您確認要移除頁面嗎？該頁面上的數據將會全部移除。'] },
      { id: 'en-us', text: ['Do you really want to remove current page? All data on current page will be lost.'] }
    ]
  }, {
    type: Language.Type.Text, id: 'prompt-title-move-page-set', dictionary:[
      { id: 'zh-cn', text: ['移动当前页面'] },
      { id: 'zh-tw', text: ['移動當前頁面'] },
      { id: 'en-us', text: ['Move current page'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'prompt-tooltip-move-page-set', dictionary:[
      { id: 'zh-cn', text: ['目标页码'] },
      { id: 'zh-tw', text: ['目標頁碼'] },
      { id: 'en-us', text: ['Target page'] }
    ]
  }, {
    type: Language.Type.Text, id: 'prompt-title-module-page', dictionary:[
      { id: 'zh-cn', text: ['格式化当前页面'] },
      { id: 'zh-tw', text: ['格式化當前頁面'] },
      { id: 'en-us', text: ['Formatting current page'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'prompt-tooltip-module-page-horizontal', dictionary:[
      { id: 'zh-cn', text: ['水平分割数'] },
      { id: 'zh-tw', text: ['水平分割數'] },
      { id: 'en-us', text: ['Number(s) of horizontal divisions'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'prompt-tooltip-module-page-vertical', dictionary:[
      { id: 'zh-cn', text: ['垂直分割数'] },
      { id: 'zh-tw', text: ['垂直分割數'] },
      { id: 'en-us', text: ['Number(s) of vertical divisions'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-new-page', dictionary:[
      { id: 'zh-cn', text: ['新建页面'] },
      { id: 'zh-tw', text: ['新建文檔'] },
      { id: 'en-us', text: ['New Page'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-move-page-forward', dictionary:[
      { id: 'zh-cn', text: ['向前移动当前页面'] },
      { id: 'zh-tw', text: ['向前移動當前頁面'] },
      { id: 'en-us', text: ['Move Forward Current Page'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-move-page-set', dictionary:[
      { id: 'zh-cn', text: ['移动当前页面'] },
      { id: 'zh-tw', text: ['移動當前頁面'] },
      { id: 'en-us', text: ['Move Current Page'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-move-page-backward', dictionary:[
      { id: 'zh-cn', text: ['向后移动当前页面'] },
      { id: 'zh-tw', text: ['向後移動當前頁面'] },
      { id: 'en-us', text: ['Move Backward Current Page'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-remove-page', dictionary:[
      { id: 'zh-cn', text: ['移除当前页面'] },
      { id: 'zh-tw', text: ['移除當前頁面'] },
      { id: 'en-us', text: ['Remove Current Page'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'tool-tooltip-module-page', dictionary:[
      { id: 'zh-cn', text: ['格式化当前页面'] },
      { id: 'zh-tw', text: ['格式化當前頁面'] },
      { id: 'en-us', text: ['Formatting Current Page'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('new-page', 'tool-tooltip-new-page', 'mdi-card-plus-outline', Tool.Slot.PAGE, {
  on_click: async function() {
    await Engine.readImage(Engine, async function (filename, src) {
      let old_document = JSON.stringify(DocumentManager.saveJson());
      await DocumentManager.addAfterCurrentPage(filename, src);
      let new_document = JSON.stringify(DocumentManager.saveJson());
      await HistoryManager.push([new History(async function(){
        DocumentManager.loadJson(JSON.parse(old_document));
        await DocumentManager.afterChangePage();
      }, async function(){
        DocumentManager.loadJson(JSON.parse(new_document));
        await DocumentManager.afterChangePage();
      })], true);
    });
  }
}));
ToolManager.addTool(new Tool('move-page-forward', 'tool-tooltip-move-page-forward', 'mdi-arrow-left-bold', Tool.Slot.PAGE, {
  on_click: async function() {
    if (DocumentManager.getCurrentPage() <= 0) return;
    let old_document = JSON.stringify(this._page_array.saveJson());
    await DocumentManager.moveCurrentPageForward();
    let new_document = JSON.stringify(this._page_array.saveJson());
    await HistoryManager.push([new History(async function(){
      DocumentManager.page_array.loadJson(JSON.parse(old_document));
      await DocumentManager.afterChangePage();
    }, async function(){
      DocumentManager.page_array.loadJson(JSON.parse(new_document));
      await DocumentManager.afterChangePage();
    })], true);
  }
}));
ToolManager.addTool(new Tool('move-page-set', 'tool-tooltip-move-page-set', 'mdi-counter', Tool.Slot.PAGE, {
  on_click: async function() {
    if (DocumentManager.getCurrentPage() <= 0) return;
    await Engine.prompt(Engine, 'prompt-title-move-page-set', [
        Language.get(Language.Type.ToolTip, 'prompt-tooltip-move-page-set')
      ], [DocumentManager.getCurrentPage()], async function(text_array) {
        let old_document = JSON.stringify(this._page_array.saveJson());
        await DocumentManager.moveCurrentPageTo(Number(text_array[0]));
        let new_document = JSON.stringify(this._page_array.saveJson());
        await HistoryManager.push([new History(async function(){
          DocumentManager.page_array.loadJson(JSON.parse(old_document));
          await DocumentManager.afterChangePage();
        }, async function(){
          DocumentManager.page_array.loadJson(JSON.parse(new_document));
          await DocumentManager.afterChangePage();
        })], true);
      }
    );
  }
}));
ToolManager.addTool(new Tool('move-page-backward', 'tool-tooltip-move-page-backward', 'mdi-arrow-right-bold', Tool.Slot.PAGE, {
  on_click: async function(){
    if (DocumentManager.getCurrentPage() <= 0) return;
    let old_document = JSON.stringify(this._page_array.saveJson());
    await DocumentManager.moveCurrentPageBackward();
    let new_document = JSON.stringify(this._page_array.saveJson());
    await HistoryManager.push([new History(async function(){
      DocumentManager.page_array.loadJson(JSON.parse(old_document));
      await DocumentManager.afterChangePage();
    }, async function(){
      DocumentManager.page_array.loadJson(JSON.parse(new_document));
      await DocumentManager.afterChangePage();
    })], true);
  }
}));
ToolManager.addTool(new Tool('remove-page', 'tool-tooltip-remove-page', 'mdi-close', Tool.Slot.PAGE, {
  on_click: async function() {
    if (DocumentManager.getCurrentPage() <= 0) return;
    await Engine.alert(Engine, 'alert-title-remove-page', async function () {
      let old_document = JSON.stringify(DocumentManager.saveJson());
      await DocumentManager.removeCurrentPage();
      let new_document = JSON.stringify(DocumentManager.saveJson());
      await HistoryManager.push([new History(async function(){
        DocumentManager.loadJson(JSON.parse(old_document));
        await DocumentManager.afterChangePage();
      }, async function(){
        DocumentManager.loadJson(JSON.parse(new_document));
        await DocumentManager.afterChangePage();
      })], true);
    });
  }
}));
ToolManager.addTool(new Tool('module-page', 'tool-tooltip-module-page', 'mdi-view-compact-outline', Tool.Slot.PAGE, {
  on_click: async function() {
    if (DocumentManager.getCurrentPage() <= 0) return;
    await Engine.prompt(Engine, 'prompt-title-module-page', [
        Language.get(Language.Type.ToolTip, 'prompt-tooltip-module-page-horizontal'),
        Language.get(Language.Type.ToolTip, 'prompt-tooltip-module-page-vertical')
      ], [5, 5], async function (text_array) {
        let old_document = JSON.stringify(DocumentManager.saveJson());
        await DocumentManager.createModulePage(Number(text_array[0]), Number(text_array[1]),
          {'left': 0, 'right': 0, 'top': 0, 'bottom': 0});
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
// ================================================================================
