// ================================================================================
// * Header <SDUDOC Engine>
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
// * Header
// --------------------------------------------------------------------------------
function Header(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
Header.prototype._data = {
  title:   { language_id: 'prompt-tooltip-header-title',   value: '' },
  author:  { language_id: 'prompt-tooltip-header-author',  value: '' },
  book:    { language_id: 'prompt-tooltip-header-book',    value: '' },
  dynasty: { language_id: 'prompt-tooltip-header-dynasty', value: '' }
};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Header.prototype.initialize = function(){
  this._data = {
    title:   { language_id: 'prompt-tooltip-header-title',   value: '' },
    author:  { language_id: 'prompt-tooltip-header-author',  value: '' },
    book:    { language_id: 'prompt-tooltip-header-book',    value: '' },
    dynasty: { language_id: 'prompt-tooltip-header-dynasty', value: '' }
  }
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Header.prototype, 'title', {
  get: function() {
    return this._data.title.value;
  },
  set: function(value) {
    this._data.title.value = value;
  },
  configurable: true
});
Object.defineProperty(Header.prototype, 'author', {
  get: function() {
    return this._data.author.value;
  },
  set: function(value) {
    this._data.author.value = value;
  },
  configurable: true
});
Object.defineProperty(Header.prototype, 'book', {
  get: function() {
    return this._data.book.value;
  },
  set: function(value) {
    this._data.book.value = value;
  },
  configurable: true
});
Object.defineProperty(Header.prototype, 'dynasty', {
  get: function() {
    return this._data.dynasty.value;
  },
  set: function(value) {
    this._data.dynasty.value = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Header.prototype.getTextArray = function(){
  return [
    Language.get(Language.Type.ToolTip, this._data.title.language_id),
    Language.get(Language.Type.ToolTip, this._data.author.language_id),
    Language.get(Language.Type.ToolTip, this._data.book.language_id),
    Language.get(Language.Type.ToolTip, this._data.dynasty.language_id)
  ];
};
// --------------------------------------------------------------------------------
Header.prototype.getDataArray = function(){
  return [
    this._data.title.value,
    this._data.author.value,
    this._data.book.value,
    this._data.dynasty.value
  ];
};
Header.prototype.setDataArray = function(data){
  this._data.title.value   = data[0];
  this._data.author.value  = data[1];
  this._data.book.value    = data[2];
  this._data.dynasty.value = data[3];
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Header.prototype.loadJson = function(json_object){
  this._data.title.value   = json_object._title   || this._data.title.value;
  this._data.author.value  = json_object._author  || this._data.author.value;
  this._data.book.value    = json_object._book    || this._data.book.value;
  this._data.dynasty.value = json_object._dynasty || this._data.dynasty.value;
};
Header.prototype.saveJson = function(){
  let output = {};
  output._title   = this._data.title.value;
  output._author  = this._data.author.value;
  output._book    = this._data.book.value;
  output._dynasty = this._data.dynasty.value;
  return output;
};
Header.prototype.exportJson = function(){
  let output = {};
  output.title   = this._data.title.value;
  output.author  = this._data.author.value;
  output.book    = this._data.book.value;
  output.dynasty = this._data.dynasty.value;
  return output;
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.ToolTip, id: 'prompt-tooltip-header-title', dictionary:[
      { id: 'zh-cn', text: ['文章标题'] },
      { id: 'zh-tw', text: ['文章標題'] },
      { id: 'en-us', text: ['Title'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'prompt-tooltip-header-author', dictionary:[
      { id: 'zh-cn', text: ['文章作者'] },
      { id: 'zh-tw', text: ['文章作者'] },
      { id: 'en-us', text: ['Author'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'prompt-tooltip-header-book', dictionary:[
      { id: 'zh-cn', text: ['所属书名'] },
      { id: 'zh-tw', text: ['所屬書名'] },
      { id: 'en-us', text: ['Book name'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'prompt-tooltip-header-dynasty', dictionary:[
      { id: 'zh-cn', text: ['作者朝代'] },
      { id: 'zh-tw', text: ['作者朝代'] },
      { id: 'en-us', text: ['Dynasty'] }
    ]
  }
]);
// ================================================================================
