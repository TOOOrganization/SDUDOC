// ================================================================================
// * Language <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/06/03 - Version 2.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
function Language() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
Language.Type = {
  Todo: 'todo',
  Text: 'text',
  Label: 'Label',
  System: 'system',
  Notice: 'notice',
  Option: 'option',
  ToolTip: 'tooltip'
};
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Language.DEFAULT_LANGUAGES = [
  { id: 'zh-cn', name: '简体中文(中国)' },
  { id: 'zh-tw', name: '繁體中文(中國)' },
  { id: 'en-us', name: 'English(United States)' }
];
Language.DEFAULT_LANGUAGE = 'zh-cn';
Language.DEFAULT_DICTIONARY = [
  {
    type: Language.Type.System, id: 'app-language-selector', dictionary:[
      { id: 'zh-cn', text: ['选择语言'] },
      { id: 'zh-tw', text: ['選擇語言'] },
      { id: 'en-us', text: ['Language'] }
    ]
  }, {
    type: Language.Type.System, id: 'graphics-error', dictionary:[
      { id: 'zh-cn', text: ['渲染时出现错误，已经为您自动回退到上一个可用版本，请将以下信息截图发送给开发者：'] },
      { id: 'zh-tw', text: ['渲染時出現錯誤，已經為您自動回退到上一個可用版本，請將以下信息截圖發送給開發者：'] },
      { id: 'en-us', text: ['An error occurred during rendering, and it has been automatically rolled back to the last available version for you. Please send a screenshot of the following information to the developer:'] }
    ]
  }, {
    type: Language.Type.System, id: 'app-alert-title', dictionary:[
      { id: 'zh-cn', text: ['提示'] },
      { id: 'zh-tw', text: ['提示'] },
      { id: 'en-us', text: ['Alert'] }
    ]
  }, {
    type: Language.Type.System, id: 'app-pop-confirm', dictionary:[
      { id: 'zh-cn', text: ['确认'] },
      { id: 'zh-tw', text: ['確定'] },
      { id: 'en-us', text: ['Confirm'] }
    ]
  }, {
    type: Language.Type.System, id: 'app-pop-cancel', dictionary:[
      { id: 'zh-cn', text: ['取消'] },
      { id: 'zh-tw', text: ['取消'] },
      { id: 'en-us', text: ['Cancel'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-label', dictionary:[
      { id: 'zh-cn', text: ['正在加载引擎 休息一下吧'] },
      { id: 'zh-tw', text: ['正在加載引擎 休息一下吧'] },
      { id: 'en-us', text: ['Now Loading. Please wait'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-engine', dictionary:[
      { id: 'zh-cn', text: ['正在加载引擎'] },
      { id: 'zh-tw', text: ['正在加載引擎'] },
      { id: 'en-us', text: ['Loading Engine'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-core', dictionary:[
      { id: 'zh-cn', text: ['正在加载核心组件'] },
      { id: 'zh-tw', text: ['正在加載核心組件'] },
      { id: 'en-us', text: ['Loading Core Object'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-object', dictionary:[
      { id: 'zh-cn', text: ['正在加载数据对象'] },
      { id: 'zh-tw', text: ['正在加載數據對象'] },
      { id: 'en-us', text: ['Loading Data Object'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-manager', dictionary:[
      { id: 'zh-cn', text: ['正在加载管理器'] },
      { id: 'zh-tw', text: ['正在加載管理器'] },
      { id: 'en-us', text: ['Loading Manager'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-tool', dictionary:[
      { id: 'zh-cn', text: ['正在加载系统工具'] },
      { id: 'zh-tw', text: ['正在加載系統工具'] },
      { id: 'en-us', text: ['Loading System Tool'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-plugin', dictionary:[
      { id: 'zh-cn', text: ['正在加载插件'] },
      { id: 'zh-tw', text: ['正在加載插件'] },
      { id: 'en-us', text: ['Loading Plugin'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-complete', dictionary:[
      { id: 'zh-cn', text: ['加载完成'] },
      { id: 'zh-tw', text: ['加載完成'] },
      { id: 'en-us', text: ['Loading Success'] }
    ]
  }, {
    type: Language.Type.System, id: 'index-text-main', dictionary:[
      { id: 'zh-cn', text: ['欢迎使用，您要做些什么？'] },
      { id: 'zh-tw', text: ['歡迎使用，您要做些什麽？'] },
      { id: 'en-us', text: ['Welcome! Just Enjoy.'] }
    ]
  }, {
    type: Language.Type.System, id: 'index-text-go-editor', dictionary:[
      { id: 'zh-cn', text: ['开始使用编辑器'] },
      { id: 'zh-tw', text: ['開始使用編輯器'] },
      { id: 'en-us', text: ['Go To Editor'] }
    ]
  }, {
    type: Language.Type.System, id: 'index-text-sub', dictionary:[
      { id: 'zh-cn', text: ['我们列出了一些常用功能，希望对您有所帮助：'] },
      { id: 'zh-tw', text: ['我們列出了一些常用功能，希望對您有所幫助：'] },
      { id: 'en-us', text: ['Here are useful features:'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-login', dictionary:[
      { id: 'zh-cn', text: ['登录'] },
      { id: 'zh-tw', text: ['登錄'] },
      { id: 'en-us', text: ['Login'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-logout', dictionary:[
      { id: 'zh-cn', text: ['登出'] },
      { id: 'zh-tw', text: ['登出'] },
      { id: 'en-us', text: ['Logout'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-dev', dictionary:[
      { id: 'zh-cn', text: ['实验性工具还在开发中，具有不稳定性，可能对文档造成不可逆的损坏。请在使用时先保存备份，谨慎处理。'] },
      { id: 'zh-tw', text: ['實驗性工具還在開發中，具有不穩定性，可能對文檔造成不可逆的損壞。請在使用時先保存備份，謹慎處理。'] },
      { id: 'en-us', text: ['Development tools now under test. Please save your document before use.'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-need-login', dictionary:[
      { id: 'zh-cn', text: ['您需要登录才能使用'] },
      { id: 'zh-tw', text: ['您需要登錄才能使用'] },
      { id: 'en-us', text: ['Login first please'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-username', dictionary:[
      { id: 'zh-cn', text: ['用户名'] },
      { id: 'zh-tw', text: ['用戶名'] },
      { id: 'en-us', text: ['Username'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-password', dictionary:[
      { id: 'zh-cn', text: ['密码'] },
      { id: 'zh-tw', text: ['密碼'] },
      { id: 'en-us', text: ['Password'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-need-username', dictionary:[
      { id: 'zh-cn', text: ['请填写用户名'] },
      { id: 'zh-tw', text: ['請填寫用戶名'] },
      { id: 'en-us', text: ['Need username'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-need-password', dictionary:[
      { id: 'zh-cn', text: ['请填写密码'] },
      { id: 'zh-tw', text: ['請填寫密碼'] },
      { id: 'en-us', text: ['Need password'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-password-min', dictionary:[
      { id: 'zh-cn', text: ['密码最少需要8个字符'] },
      { id: 'zh-tw', text: ['密碼最少需要8個字符'] },
      { id: 'en-us', text: ['Password more then 8 characters'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-tab-user', dictionary:[
      { id: 'zh-cn', text: ['用户菜单'] },
      { id: 'zh-tw', text: ['用戶菜單'] },
      { id: 'en-us', text: ['User'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-tab-cloud', dictionary:[
      { id: 'zh-cn', text: ['云功能菜单'] },
      { id: 'zh-tw', text: ['雲功能菜單'] },
      { id: 'en-us', text: ['Cloud Sync'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-tab-page', dictionary:[
      { id: 'zh-cn', text: ['页面菜单'] },
      { id: 'zh-tw', text: ['頁面菜單'] },
      { id: 'en-us', text: ['Page'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-tab-check', dictionary:[
      { id: 'zh-cn', text: ['检查菜单'] },
      { id: 'zh-tw', text: ['檢查菜單'] },
      { id: 'en-us', text: ['Check'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-tab-option', dictionary:[
      { id: 'zh-cn', text: ['设置菜单'] },
      { id: 'zh-tw', text: ['設置菜單'] },
      { id: 'en-us', text: ['Option'] }
    ]
  }, {
    type: Language.Type.System, id: 'editor-text-tab-dev', dictionary:[
      { id: 'zh-cn', text: ['实验性功能菜单'] },
      { id: 'zh-tw', text: ['實驗性功能菜單'] },
      { id: 'en-us', text: ['Development'] }
    ]
  }, {
    type: Language.Type.Todo, id: 'default', dictionary:[
      { id: 'zh-cn', text: ['Loading...'] },
    ]
  }, {
    type: Language.Type.Todo, id: 'engine-loading', dictionary:[
      { id: 'zh-cn', text: ['请等待引擎加载完成...'] },
      { id: 'zh-tw', text: ['請等待引擎加載完成...'] },
      { id: 'en-us', text: ['Loading for Engine...'] }
    ]
  }, {
    type: Language.Type.Todo, id: 'engine-ready', dictionary:[
      { id: 'zh-cn', text: ['欢迎使用！'] },
      { id: 'zh-tw', text: ['歡迎使用！'] },
      { id: 'en-us', text: ['Just Enjoy!'] }
    ]
  }, {
    type: Language.Type.Notice, id: 'need-login', dictionary:[
      { id: 'zh-cn', text: ['请先登录'] },
      { id: 'zh-tw', text: ['請先登錄'] },
      { id: 'en-us', text: ['Please login'] }
    ]
  },
];
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Language._add_languages = [];
Language._add_dictionary = [];
// --------------------------------------------------------------------------------
Language._languages = [];
Language._dictionary = {};
Language._current_language = 'zh-cn';
Language._current_todo = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Language.initializeOnLoad = function (){
  this.clear();
  this.loadDefault();
};
Language.initialize = function (){
  this.loadAdded();
};
Language.clear = function (){
  this._languages = [];
  this._dictionary = {};
  this._current_language = this.DEFAULT_LANGUAGE;
};
// --------------------------------------------------------------------------------
Language.loadDefault = function (){
  this.loadDefaultLanguages();
  this.loadDefaultDictionary();
};
Language.loadAdded = function (){
  this.loadAddedLanguages();
  this.loadAddedDictionary();
};
// --------------------------------------------------------------------------------
Language.loadDefaultLanguages = function (){
  for(let i = 0; i < this.DEFAULT_LANGUAGES.length; i++)
    this._languages.push(this.DEFAULT_LANGUAGES[i]);
};
Language.loadDefaultDictionary = function (){
  for (let key in this.Type)
    if (this.Type.hasOwnProperty(key))
      this._dictionary[this.Type[key]] = {};
  for(let i = 0; i < this.DEFAULT_DICTIONARY.length; i++)
    this.appendDictionary(this.DEFAULT_DICTIONARY[i]);
};
// --------------------------------------------------------------------------------
Language.loadAddedLanguages = function (){
  for(let i = 0; i < this._add_languages.length; i++)
    this._languages.push(this._add_languages[i]);
};
Language.loadAddedDictionary = function (){
  for(let i = 0; i < this._add_dictionary.length; i++)
    this.appendDictionary(this._add_dictionary[i]);
};
// --------------------------------------------------------------------------------
Language.appendDictionary = function (json){
  if(this._dictionary.hasOwnProperty(json.type)){
    if(!this._dictionary[json.type].hasOwnProperty(json.id)){
      this._dictionary[json.type][json.id] = {}
    }
    for(let i = 0; i < json.dictionary.length; i++){
      if(!this._dictionary[json.type][json.id].hasOwnProperty(json.dictionary[i].id)){
        this._dictionary[json.type][json.id][json.dictionary[i].id] = json.dictionary[i].text;
      }
    }
  }
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Language, 'current_language', {
  get: function() {
    return this.getCurrentLanguage();
  },
  configurable: true
});
Object.defineProperty(Language, 'current_todo', {
  get: function() {
    return this.getCurrentTodo();
  },
  configurable: true
});
Object.defineProperty(Language, 'language_list', {
  get: function() {
    return this.getLanguageList();
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Language.getCurrentLanguage = function (){
  return this._current_language;
};
Language.getCurrentTodo = function (){
  return this.get(this.Type.Todo, this._current_todo);
};
// --------------------------------------------------------------------------------
Language.setCurrentLanguage = function (id){
  let list = this.getLanguageList().id;
  if (list.indexOf(id) >= 0)
    this._current_language = id;
};
// --------------------------------------------------------------------------------
Language.setCurrentTodo = function (id){
  this._current_todo = id;
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Language.addLanguage = function (id, name){
  if (name){
    this._add_languages.push({
      id: id, name: name
    });
  } else {
    this._add_languages.push(id);
  }
};
Language.addDictionary = function (json){
  this._add_dictionary.push(json);
};
Language.addDictionaryList = function (json_array){
  for(let i = 0; i < json_array.length; i++){
    this._add_dictionary.push(json_array[i]);
  }
};
// --------------------------------------------------------------------------------
Language.getLanguageList = function (){
  let output = {
    id: [],
    name: []
  };
  for(let i = 0; i < this._languages.length; i++){
    output.id.push(this._languages[i].id);
    output.name.push(this._languages[i].name);
  }
  return output;
};
// --------------------------------------------------------------------------------
Language.get = function (type, id){
  if(this._dictionary.hasOwnProperty(type)) {
    if (this._dictionary[type].hasOwnProperty(id)) {
      if (this._dictionary[type][id].hasOwnProperty(this._current_language)) {
        if (this._dictionary[type][id][this._current_language].length > 1) {
          return this._dictionary[type][id][this._current_language]
            [Math.floor(Math.random() * this._dictionary[type][id][this._current_language].length)];
        } else {
          return this._dictionary[type][id][this._current_language][0];
        }
      } else if (this._dictionary[type][id].hasOwnProperty(this.DEFAULT_LANGUAGE)) {
        if (this._dictionary[type][id][this.DEFAULT_LANGUAGE].length > 1) {
          return this._dictionary[type][id][this.DEFAULT_LANGUAGE]
            [Math.floor(Math.random() * this._dictionary[type][id][this.DEFAULT_LANGUAGE].length)];
        } else {
          return this._dictionary[type][id][this.DEFAULT_LANGUAGE][0];
        }
      } else {
        for (let key in this._dictionary[type][id]) {
          if (this._dictionary[type][id].hasOwnProperty(key)) {
            if (this._dictionary[type][id][key].length > 1) {
              return this._dictionary[type][id][key]
                [Math.floor(Math.random() * this._dictionary[type][id][key].length)];
            } else {
              return this._dictionary[type][id][key][0];
            }
          }
        }
      }
    }
  }
  return null;
};
// ================================================================================
