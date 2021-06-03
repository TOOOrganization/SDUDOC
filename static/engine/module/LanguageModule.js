// ================================================================================
// * LanguageModule <SDUDOC Engine>
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
// * LanguageModule
// --------------------------------------------------------------------------------
function LanguageModule() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
LanguageModule.Type = {
  ToolTip: 'tooltip',
  Todo: 'todo',
  System: 'system'
};
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
LanguageModule.DEFAULT_LANGUAGES = [
  { id: 'zh-cn', name: '简体中文(中国)' },
  { id: 'zh-tw', name: '繁體中文(中國-臺灣)'},
  { id: 'en-us', name: 'English(United States)'}
];
LanguageModule.DEFAULT_LANGUAGE = 'zh-cn';
LanguageModule.DEFAULT_DICTIONARY = [
  {
    type: LanguageModule.Type.System, id: 'app-language-selector', dictionary:[
      { id: 'zh-cn', text: ['选择语言'] },
      { id: 'zh-tw', text: ['選擇語言'] },
      { id: 'en-us', text: ['Language'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'app-alert-title', dictionary:[
      { id: 'zh-cn', text: ['提示'] },
      { id: 'zh-tw', text: ['提示'] },
      { id: 'en-us', text: ['Alert'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'app-pop-confirm', dictionary:[
      { id: 'zh-cn', text: ['确认'] },
      { id: 'zh-tw', text: ['確定'] },
      { id: 'en-us', text: ['Confirm'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'app-pop-cancel', dictionary:[
      { id: 'zh-cn', text: ['取消'] },
      { id: 'zh-tw', text: ['取消'] },
      { id: 'en-us', text: ['Cancel'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'loading-label', dictionary:[
      { id: 'zh-cn', text: ['正在加载引擎 休息一下吧'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'loading-engine', dictionary:[
      { id: 'zh-cn', text: ['正在加载引擎'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'loading-core', dictionary:[
      { id: 'zh-cn', text: ['正在加载核心模组'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'loading-manager', dictionary:[
      { id: 'zh-cn', text: ['正在加载文档模组'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'loading-tool', dictionary:[
      { id: 'zh-cn', text: ['正在加载系统工具'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'loading-plugin', dictionary:[
      { id: 'zh-cn', text: ['正在加载插件'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'loading-complete', dictionary:[
      { id: 'zh-cn', text: ['加载完成'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'index-main', dictionary:[
      { id: 'zh-cn', text: ['欢迎使用，您要做些什么？'] },
      { id: 'en-us', text: ['Welcome! Just Enjoy.'] }
    ]
  }, {
    type: LanguageModule.Type.System, id: 'index-sub', dictionary:[
      { id: 'zh-cn', text: ['我们列出了一些常用功能，希望对您有所帮助：'] }
    ]
  }, {
    type: LanguageModule.Type.Todo, id: 'default', dictionary:[
      { id: 'zh-cn', text: ['请等待'] },
    ]
  }, {
    type: LanguageModule.Type.Todo, id: 'loading', dictionary:[
      { id: 'zh-cn', text: ['请等待引擎加载完成...'] },
      { id: 'zh-tw', text: ['請等待引擎加載完成...'] },
      { id: 'en-us', text: ['Loading for Engine...'] }
    ]
  },
];
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
LanguageModule._add_languages = [];
LanguageModule._add_dictionary = [];
// --------------------------------------------------------------------------------
LanguageModule._languages = [];
LanguageModule._dictionary = {};
LanguageModule._current_language = 'zh-cn';
LanguageModule._current_todo = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
LanguageModule.initialize = function (){
  this.clear();
  this.loadDefault();
};
LanguageModule.clear = function (){
  this._languages = [];
  this._dictionary = {};
  this._current_language = this.DEFAULT_LANGUAGE;
};
// --------------------------------------------------------------------------------
LanguageModule.loadDefault = function (){
  this.loadDefaultLanguages();
  this.loadDefaultDictionary();
};
LanguageModule.loadAdded = function (){
  this.loadAddedLanguages();
  this.loadAddedDictionary();
};
// --------------------------------------------------------------------------------
LanguageModule.loadDefaultLanguages = function (){
  for(let i = 0; i < this.DEFAULT_LANGUAGES.length; i++)
    this._languages.push(this.DEFAULT_LANGUAGES[i]);
};
LanguageModule.loadDefaultDictionary = function (){
  for (let key in this.Type)
    if (this.Type.hasOwnProperty(key))
      this._dictionary[this.Type[key]] = {};
  for(let i = 0; i < this.DEFAULT_DICTIONARY.length; i++)
    this.appendDictionary(this.DEFAULT_DICTIONARY[i]);
};
// --------------------------------------------------------------------------------
LanguageModule.loadAddedLanguages = function (){
  for(let i = 0; i < this._add_languages.length; i++)
    this._languages.push(this._add_languages[i]);
};
LanguageModule.loadAddedDictionary = function (){
  for(let i = 0; i < this._add_dictionary.length; i++)
    this.appendDictionary(this._add_dictionary[i]);
};
// --------------------------------------------------------------------------------
LanguageModule.appendDictionary = function (json){
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
Object.defineProperty(LanguageModule, 'current_language', {
  get: function() {
    return this.getCurrentLanguage();
  },
  configurable: true
});
Object.defineProperty(LanguageModule, 'current_todo', {
  get: function() {
    return this.getCurrentTodo();
  },
  configurable: true
});
Object.defineProperty(LanguageModule, 'language_list', {
  get: function() {
    return this.getLanguageList();
  },
  configurable: true
});
// --------------------------------------------------------------------------------
LanguageModule.getCurrentLanguage = function (){
  return this._current_language;
};
LanguageModule.getCurrentTodo = function (){
  return this._current_todo;
};
// --------------------------------------------------------------------------------
LanguageModule.setCurrentLanguage = function (id){
  let list = this.getLanguageList().id;
  if (list.indexOf(id) >= 0)
    this._current_language = id;
};
// --------------------------------------------------------------------------------
LanguageModule.setCurrentTodo = function (id){
  this._current_todo = this.get(this.Type.Todo, id);
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
LanguageModule.addLanguage = function (id, name){
  if (name){
    this._add_languages.push({
      id: id, name: name
    });
  } else {
    this._add_languages.push(id);
  }
};
LanguageModule.addDictionary = function (json){
  this._add_dictionary.push(json);
};
// --------------------------------------------------------------------------------
LanguageModule.getLanguageList = function (){
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
LanguageModule.get = function (type, id){
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
