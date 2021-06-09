// ================================================================================
// * SDUDOC Engine
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Core of SDUDOC Engine.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/11 - Version 1.0.1
//     - Decoupling functions to plugins.
// --------------------------------------------------------------------------------
//   Update history:
//   2021/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Engine
// --------------------------------------------------------------------------------
function Engine(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Engine.VERSION = '2.0.5';
// --------------------------------------------------------------------------------
// * App - Property
// --------------------------------------------------------------------------------
Engine._current_loading_id = '';
Engine._current_loading_text = '';
// --------------------------------------------------------------------------------
Engine._app_element = null;
Engine._packages = {};
// --------------------------------------------------------------------------------
Engine._notice_in_process = null;
Engine._notice_list = [];
// --------------------------------------------------------------------------------
Engine._todo = null;
// --------------------------------------------------------------------------------
// * App - Getter & Setter
// --------------------------------------------------------------------------------
Engine.setApp = function(element){
  this._app_element = element;
};
Engine.setPackages = function(packages){
  this._packages = packages;
};
// --------------------------------------------------------------------------------
Engine.getApp = function(){
  return this._app_element;
};
Engine.getPackages = function(){
  return this._packages;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Engine, 'app', {
  get: function() {
    return this.getApp();
  },
  configurable: true
});
Object.defineProperty(Engine, 'packages', {
  get: function() {
    return this.getPackages();
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * App - Functions
// --------------------------------------------------------------------------------
Engine.checkRouter = function(name){
  return this._app_element.getRouterComponent() &&
    this._app_element.getRouterComponent().$options.name === name;
};
// --------------------------------------------------------------------------------
Engine.setCurrentLanguage = function(id){
   Language.setCurrentLanguage(id);
  this.updateAllData();
};
Engine.setCurrentTodo = function(id){
  Language.setCurrentTodo(id);
  this._app_element.setTodo(Language.getCurrentTodo());
};
Engine.setCurrentLoadingProcess = function(id, text){
  this._current_loading_id = id;
  this._current_loading_text = text;
  this.updateLoadingProcessData();
};
// --------------------------------------------------------------------------------
Engine.updateAllData = function(){
  this.updateAppData();
  this.updateLoadingData();
  this.updateIndexData();
  this.updateEditorData()
};
// --------------------------------------------------------------------------------
// * App - PageData - App
// --------------------------------------------------------------------------------
Engine.getAppInitializeData = function(){
  return {
    engine_version: this.VERSION
  };
};
Engine.getAppLanguageData = function(){
  return {
    language_selector :Language.get(Language.Type.System, 'app-language-selector'),
    language_list: Language.getLanguageList(),
    current_language: Language.getCurrentLanguage()
  }
};
Engine.getAppElementData = function(){
  return {
    todo_default : Language.get(Language.Type.Todo, 'default'),
    todo_text : Language.getCurrentTodo(),

    alert_title: Language.get(Language.Type.System, 'app-alert-title'),
    confirm_text: Language.get(Language.Type.System, 'app-pop-confirm'),
    cancel_text: Language.get(Language.Type.System, 'app-pop-cancel'),
  }
};
// --------------------------------------------------------------------------------
Engine.updateAppData = function(){
  this.updateAppInitializeData();
  this.updateAppLanguageData();
  this.updateAppElementData();
};
// --------------------------------------------------------------------------------
Engine.updateAppInitializeData = function(){
  this._app_element.updateInitializeData();
};
Engine.updateAppLanguageData = function(){
  this._app_element.updateLanguageData();
};
Engine.updateAppElementData = function(){
  this._app_element.updateElementData();
};
// --------------------------------------------------------------------------------
// * App - PageData - Loading
// --------------------------------------------------------------------------------
Engine.getLoadingLabelData = function(){
  return {
    label_text: Language.get(Language.Type.System, 'loading-label'),
  };
};
Engine.getLoadingProcessData = function(){
  let loading = Language.get(Language.Type.System, this._current_loading_id);
  return {
    process_text: (loading ? loading : '') + this._current_loading_text
  };
};
// --------------------------------------------------------------------------------
Engine.updateLoadingData = function(){
  this.updateLoadingLabelData();
  this.updateLoadingProcessData();
};
// --------------------------------------------------------------------------------
Engine.updateLoadingLabelData = function(){
  if(this.checkRouter('Loading')){
    this._app_element.getRouterComponent().updateLabelData();
  }
};
Engine.updateLoadingProcessData = function(){
  if(this.checkRouter('Loading')){
    this._app_element.getRouterComponent().updateProcessData();
  }
};
// --------------------------------------------------------------------------------
// *  App - PageData - Index
// --------------------------------------------------------------------------------
Engine.getIndexTextData = function(){
  return {
    main_text: Language.get(Language.Type.System, 'index-main'),
    sub_text: Language.get(Language.Type.System, 'index-sub')
  };
};
// --------------------------------------------------------------------------------
Engine.updateIndexData = function(){
  this.updateIndexTextData();
};
// --------------------------------------------------------------------------------
Engine.updateIndexTextData = function(){
  if(this.checkRouter('Index')){
    this._app_element.getRouterComponent().updateTextData();
  }
};
// --------------------------------------------------------------------------------
// *  App - PageData - Editor
// --------------------------------------------------------------------------------
Engine.getEditorToolData = function(){
  return {
    tools: ToolManager.calcToolList(),
    tool_labels:  ToolManager.getToolLabels(),
  };
};
Engine.getEditorPageData = function(){
  return {
    page_list: DocumentManager.getPageList(),
    current_page: DocumentManager.getCurrentPage() - 1
  };
};
Engine.getEditorCheckData = function(){
  return {
    check_id: SelectManager.getSelectedId(),
    check_info: SelectManager.extractElementObject(SelectManager.getSelectedObject())
  };
};
// --------------------------------------------------------------------------------
Engine.updateEditorData = function(){
  this.updateEditorToolData();
  this.updateEditorPageData();
  this.updateEditorCheckData();
};
// --------------------------------------------------------------------------------
Engine.updateEditorToolData = function(){
  if(this.checkRouter('Editor')){
    this._app_element.getRouterComponent().updateToolData();
  }
};
Engine.updateEditorPageData = function(){
  if(this.checkRouter('Editor')){
    this._app_element.getRouterComponent().updatePageData();
  }
};
Engine.updateEditorCheckData = function(){
  if(this.checkRouter('Editor')){
    this._app_element.getRouterComponent().updateCheckData();
  }
};
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Engine._input = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Engine.initialize = function(){
  this.createHandler();
  this.createInputBox();

  Input.initialize();
  MouseInput.initialize();
  Language.initialize();
  Graphics.initialize();

  ToolManager.initialize();
  RenderManager.initialize();
  CollideManager.initialize();
  ElementManager.initialize();
  DocumentManager.initialize();
  SelectManager.initialize();
  HistoryManager.initialize();
};
Engine.initializeEditor = function(){
  if(!this.checkRouter('Editor')) return;

  let editor = this._app_element.getRouterComponent();
  MouseInput.initializeEditor(editor);
  Graphics.initializeEditor(editor);
  ToolManager.initializeEditor(editor);
};
// --------------------------------------------------------------------------------
Engine.createHandler = function(){
  MouseInput.addHandler(new Handler('engine.onMouseMove', 'mousemove', false, Engine,
    function(event){
      if(MouseInput.isPressed(MouseInput.Mouse.MIDDLE)) {
        let distance = new Point(event.layerX, event.layerY).minus(MouseInput.getMousePoint());
        Graphics.moveOrigin(distance.x, distance.y);
      }
    })
  );
  MouseInput.addHandler(new Handler('engine.onMouseWheel', 'wheel', false, Engine,
    function(event){
      let scale = 1 - event.deltaY / 1200;
      let oldScale = Graphics.scale;
      Graphics.multiScale(scale);
      let real_scale = Graphics.scale / oldScale;
      let distance = new Point(event.layerX, event.layerY).minus(Graphics.origin).multiply(1 - real_scale);
      Graphics.moveOrigin(distance.x, distance.y)
    })
  );
};
Engine.createInputBox = function(){
  this._input = document.createElement('input');
  this._input.setAttribute('accept', 'image/*');
  this._input.setAttribute('id','file_input');
  this._input.setAttribute('type','file');
  this._input.setAttribute('style','visibility:hidden; display:none');
  this._input._reader = new FileReader();
  this._input._file = null;
  this._input._readAsText = false;
  this._input.addEventListener('change', function(event){
    this._file = event.target.files[0];
    if(this._file){
      if(this._readAsText){
        this._reader.readAsText(event.target.files[0], 'UTF-8');
      }else{
        this._reader.readAsDataURL(event.target.files[0]);
      }
    }
    this.value = null;
  }.bind(this._input));
  document.body.appendChild(this._input);
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Engine.clearToolTemp = function(){
  SelectManager.unSelect();
  Graphics.update();
}
// --------------------------------------------------------------------------------
Engine.loadImage = async function(from, file, callback){
  if (!file) return;
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = async function(event){
      await callback.call(from, file.name, event.target.result);
      resolve();
    }
    reader.readAsDataURL(file);
  });
}
Engine.loadFile = async function(from, file, callback){
  if (!file) return;
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = async function(event){
      await callback.call(from, file.name, event.target.result);
      resolve();
    }
    reader.readAsText(file, 'UTF-8');
  });
}
// --------------------------------------------------------------------------------
Engine.readImage = function(from, callback){
  return new Promise((resolve) => {
    this._input.setAttribute('accept', 'image/*');
    this._input._readAsText = false;
    this._input._reader.onload = async function(event){
      await callback.call(from, Engine._input._file.name, event.target.result);
      resolve();
    }
    this._input.click();
  });
}
Engine.readJson = function(from, callback){
  return new Promise((resolve) => {
    this._input.setAttribute('accept', '.sjs');
    this._input._readAsText = true;
    this._input._reader.onload = function(event){
      callback.call(from, Engine._input._file.name, event.target.result);
      resolve();
    }
    this._input.click();
  });
}
Engine.saveFile = function(filename, content){
  const blob = new Blob([content], {type: 'text/plain;charset=UTF-8'})
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    let aTag = document.createElement('a');
    aTag.download = filename;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(aTag.href);
  }
}
// --------------------------------------------------------------------------------
// * Application Interaction
// --------------------------------------------------------------------------------
Engine.alert = function(owner, title, callback_ok, callback_cancel){
  return new Promise((resolve) => {
    this._app_element.alert({
      title: Language.get(Language.Type.Text, title) || title,
      callback_ok: async function(){
        await callback_ok.call(owner);
        Engine.getApp().alert_dialog = false;
        resolve(true);
      },
      callback_cancel: async function(){
        if(callback_cancel) await callback_cancel.call(owner);
        Engine.getApp().alert_dialog = false;
        resolve(false);
      }
    });
  });
}
Engine.prompt = function(owner, title, tooltip, default_text, callback_ok, callback_cancel){
  return new Promise((resolve) => {
    this._app_element.prompt({
      title: Language.get(Language.Type.Text, title) || title,
      callback_ok: async function(){
        await callback_ok.call(owner, Engine.getApp().prompt_text);
        Engine.getApp().prompt_dialog = false;
        resolve();
      },
      callback_cancel: async function(){
        if(callback_cancel) await callback_cancel.call(owner);
        Engine.getApp().prompt_dialog = false;
        resolve();
      },
      tooltip: tooltip,
      default_text: default_text
    });
  });
}
Engine.notice = function(text, icon, color, deny_repeat){
  if(text){
    if(this._notice_in_process && text === this._notice_in_process.text && deny_repeat) return;
    let notice_text = Language.get(Language.Type.Notice, text) || text;
    this._notice_list.push({
      text: text,
      notice_text: notice_text,
      notice_icon: icon,
      notice_color: color
    });
    if(this._notice_in_process){
      return;
    }
  }
  if(this._notice_list.length === 0){
    this._notice_in_process = null;
    return;
  }
  this._notice_in_process = this._notice_list.shift();
  this._app_element.notice(this._notice_in_process);
  setTimeout(Engine.notice.bind(Engine), 2200);
}
Engine.progress = function(value){
  this._app_element.progress({
    progress_value: value
  });
}
Engine.progressAuto = function(){
  let value = this._app_element.progress_value;
  if(value < 0){
    this._app_element.progress({
      progress_value: 0
    });
  }else if(value < 100){
    this._app_element.progress({
      progress_value: value + (100 - value) * 0.1
    });
  }else{
    return;
  }
  setTimeout(Engine.progressAuto.bind(Engine), 200);
}
// --------------------------------------------------------------------------------
Engine.noticeDefault = function(text, deny_repeat){
  this.notice(text, null, 'black', deny_repeat);
}
Engine.noticeHint = function(text, deny_repeat){
  this.notice(text, 'mdi-alert-circle-outline', 'black', deny_repeat);
}
Engine.noticeWarning = function(text, deny_repeat){
  this.notice(text, 'mdi-close-circle-outline', 'red', deny_repeat);
}
Engine.noticeSuccess = function(text, deny_repeat){
  this.notice(text, 'mdi-check-circle-outline', 'green', deny_repeat);
}
// ================================================================================
