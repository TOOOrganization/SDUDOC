// ================================================================================
// * Word <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/04/20 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Word
// --------------------------------------------------------------------------------
function Word(){
  this.initialize.apply(this, arguments);
}
Word.prototype = Object.create(PolygonGroup.prototype);
Word.prototype.constructor = Word;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Word.TAG = "Word";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Word.prototype._id = "";
Word.prototype._page = "";
// --------------------------------------------------------------------------------
Word.prototype._line_width = 0;
Word.prototype._color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Word.prototype.initialize = function(id, page){
  PolygonGroup.prototype.initialize.call(this);

  this._line_width = 10 * 2;
  this._color = 'rgba(255, 255, 0, 0.5)';

  this._id = id;
  this._page = page;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Word.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Word.prototype, 'page', {
  get: function() {
    return this._page;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Word.prototype.setColor = function(color){
  this._color = color;
}
// --------------------------------------------------------------------------------
Word.prototype.getObject = function(){
  return new Word("", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Word.prototype.getMergePoints = function(){
  let points = [];
  for(let i = 0; i < this._children.length; i++){
    let character = SDUDocument.getCurrentPageElement(Character.TAG, this._children[i]);
    if(character){
      let polygon = SDUDocument.getCurrentPageElement(Polygon2D.TAG, character.polygon);
      points.push(polygon.points);
    }
  }
  return points;
};
// --------------------------------------------------------------------------------
Word.prototype.render = function(ctx){
  for(let i = 0; i < this._points.length; i++){
    let points = [];
    for(let j = 0; j < this._points[i].length; j++){
      points[j] = SDUDocument.getCurrentPageElement(Dot2D.TAG, this._points[i][j]);
    }
    PolygonGroup.prototype.strokeCanvas.call(new Polygon(points), ctx, this._line_width, this._color);
  }
};
Word.prototype.renderCollide = function(ctx){

};
// --------------------------------------------------------------------------------
Word.prototype.onDelete = function(){

};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Word.prototype.getExportCharacters = function(){
  let characters = [];
  for(let i = 0; i < this._children.length; i++){
    characters[i] = SDUDocument.getCurrentPageElement(Character.TAG, this._children[i]);
  }
  return characters;
}
// --------------------------------------------------------------------------------
Word.prototype.loadJson = function(json){
  this._id = json._id;
  this._page = json._page;
  this._children = json._children;
  this._points = json._points;
}
Word.prototype.saveJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _children: this._children,
    _points: this._points
  }
}
Word.prototype.exportJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _characters: this.getExportCharacters(),
    _points: this._points
  }
}
// ================================================================================

// ================================================================================
// * WordFactory
// --------------------------------------------------------------------------------
function WordFactory(){
  throw new Error('This is a static class');
}
WordFactory._currentWord = null;
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
WordFactory.getCurrentWord = function(){
  return this._currentWord;
};
WordFactory.setCurrentWord = function(id){
  this._currentWord = id;
};
WordFactory.clearCurrentWord = function(){
  this._currentWord = null;
};
WordFactory.makeObject = function(page){
  return new Word(this.getNextIndex(), page);
};
WordFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Word.TAG);
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool("word", "词汇工具", "mdi-file-word-box", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("word.onLeftClick", "left_click", false, WordFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      let character_object = SDUDocument.getCurrentPageElement(Character.TAG, character);
      if(character_object.word){
        WordFactory.setCurrentWord(character_object.word);
      }else{
        if(WordFactory.getCurrentWord()){
          let word_object = SDUDocument.getCurrentPageElement(Word.TAG, WordFactory.getCurrentWord());
          word_object.append(character);
          character_object.word = word_object.id;
          DocumentManager.push();
        }else{
          let word_object = WordFactory.makeObject(DocumentManager.getCurrentPageId());
          word_object.append(character);
          character_object.word = word_object.id;
          WordFactory.setCurrentWord(word_object.id);
          DocumentManager.addElement(Word.TAG, word_object);
          return;
        }
      }
    }
  }
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("word.onRightClick", "right_click", false, WordFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      let character_object = SDUDocument.getCurrentPageElement(Character.TAG, character);
      let word = character_object.word;
      if(word){
        if(!WordFactory.getCurrentWord() || word === WordFactory.getCurrentWord()){
          let word_object = SDUDocument.getCurrentPageElement(Word.TAG, word);
          character_object.word = '';
          word_object.remove(character);
          if(word_object.isEmpty()){
            DocumentManager.deleteElement(Word.TAG, word);
            WordFactory.clearCurrentWord();
          }else{
            WordFactory.setCurrentWord(word);
            DocumentManager.push();
          }
          Graphics.refresh();
          return;
        }
      }
    }
  }
  WordFactory.clearCurrentWord();
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("word.onMouseMove", "mousemove", false, WordFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("word.onMouseOut", "mouseout", false, WordFactory, function(event){
  WordFactory.clearCurrentWord();
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("word.normal", 7, WordFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let words = SDUDocument.getCurrentPageElements(Word.TAG);
  for(let i in words){
    words[i].render(ctx);
  }
}));
RenderManager.addRenderer(new Renderer("word.character.normal", 20, WordFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let characters = SDUDocument.getCurrentPageElements(Character.TAG);
  for(let i in characters){
    characters[i].render(ctx);
  }
}));
RenderManager.addRenderer(new Renderer("word.polygon.collide", 6, WordFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
// ================================================================================
