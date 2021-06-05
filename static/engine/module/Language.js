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
  ToolTip: 'tooltip',
  Todo: 'todo',
  System: 'system',
  Text: 'text'
};
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Language.DEFAULT_LANGUAGES = [
  { id: 'zh-cn', name: '简体中文(中国)' },
  { id: 'zh-tw', name: '繁體中文(中國-臺灣)'},
  { id: 'en-us', name: 'English(United States)'}
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
      { id: 'zh-cn', text: ['正在加载引擎 休息一下吧'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-engine', dictionary:[
      { id: 'zh-cn', text: ['正在加载引擎'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-core', dictionary:[
      { id: 'zh-cn', text: ['正在加载核心组件'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-object', dictionary:[
      { id: 'zh-cn', text: ['正在加载数据对象'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-manager', dictionary:[
      { id: 'zh-cn', text: ['正在加载管理器'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-tool', dictionary:[
      { id: 'zh-cn', text: ['正在加载系统工具'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-plugin', dictionary:[
      { id: 'zh-cn', text: ['正在加载插件'] }
    ]
  }, {
    type: Language.Type.System, id: 'loading-complete', dictionary:[
      { id: 'zh-cn', text: ['加载完成'] }
    ]
  }, {
    type: Language.Type.System, id: 'index-main', dictionary:[
      { id: 'zh-cn', text: ['欢迎使用，您要做些什么？'] },
      { id: 'zh-tw', text: ['歡迎使用，您要做些什麽？'] },
      { id: 'en-us', text: ['Welcome! Just Enjoy.'] }
    ]
  }, {
    type: Language.Type.System, id: 'index-sub', dictionary:[
      { id: 'zh-cn', text: ['我们列出了一些常用功能，希望对您有所帮助：'] }
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
