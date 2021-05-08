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
Word.prototype._line_width = 0;
Word.prototype._line_scale = 0;
Word.prototype._color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Word.prototype.initialize = function(id, page){
  PolygonGroup.prototype.initialize.call(this);

  this._line_width = 2;
  this._line_scale = 11;
  this._color = 'rgba(255, 255, 0, 0.8)';

  this._id = id;
  this._pages = [page];
};
// --------------------------------------------------------------------------------
// * Getter & Setter
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
Word.prototype.callFatherCalcPoints = function(){
  if(this._father){
    SDUDocument.getElement(Sentence.TAG, this._father).calcPoints();
  }
};
Word.prototype.callFatherCalcPages = function(){
  if(this._father){
    SDUDocument.getElement(Sentence.TAG, this._father).calcPages();
  }
};
// --------------------------------------------------------------------------------
Word.prototype.getMergePoints = function(){
  let points = {};
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = []
  }
  for(let i = 0; i < this._children.length; i++){
    let character = SDUDocument.getElement(Character.TAG, this._children[i]);
    if(character){
      let polygon = SDUDocument.getElement(Polygon2D.TAG, character.polygon);
      points[character.page].push(polygon.points);
    }
  }
  return points;
};
Word.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let character = SDUDocument.getElement(Character.TAG, this._children[i]);
    if(character){
      pages.push([character.page])
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
Word.prototype.render = function(ctx){
  let point_list = this._points[SDUDocument.getCurrentPageId()]
  for(let i = 0; i < point_list.length; i++){
    let points = [];
    for(let j = 0; j < point_list[i].length; j++){
      points[j] = Graphics.getRenderPoint(SDUDocument.getCurrentPageElement(Dot2D.TAG, point_list[i][j]));
    }
    let polygon = new Polygon(points).getScaledPolygon(this._line_scale);
    PolygonGroup.prototype.strokeCanvas.call(polygon, ctx, this._line_width, this._color);
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
Word.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(SDUDocument.getElement(Character.TAG, this._children[i]).char);
  }
  return str.join('');
}
Word.prototype.getExportStringArray = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(SDUDocument.getElement(Character.TAG, this._children[i]).char);
  }
  return str;
}
// --------------------------------------------------------------------------------
Word.prototype.loadJson = function(json){
  this._id = json._id;
  this._pages = json._pages;
  this._children = json._children;
  this._father = json._father;
  this._points = json._points;
}
Word.prototype.saveJson = function(){
  return {
    _id: this._id,
    _pages: this._pages,
    _children: this._children,
    _father: this._father,
    _points: this._points
  }
}
Word.prototype.exportJson = function(){
  return {
    id: this._id,
    pages: this._pages,
    children: this._children,
    father: this._father,
    string: this.getExportStringArray(),
    points: this.getExportPoints()
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
      if(character_object.father){
        WordFactory.setCurrentWord(character_object.father);
      }else{
        if(WordFactory.getCurrentWord()){
          let word_object = SDUDocument.getElement(Word.TAG, WordFactory.getCurrentWord());
          word_object.append(character_object);
          DocumentManager.push();
        }else{
          let word_object = WordFactory.makeObject(DocumentManager.getCurrentPageId());
          word_object.append(character_object);
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
      let word = character_object.father;
      if(word){
        if(!WordFactory.getCurrentWord() || word === WordFactory.getCurrentWord()){
          let word_object = SDUDocument.getCurrentPageElement(Word.TAG, word);
          word_object.remove(character_object);
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
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("word.doc.normal", 7, WordFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let words = SDUDocument.getCurrentPageElements(Word.TAG);
  for(let i in words){
    words[i].render(ctx);
  }
  let sentences = SDUDocument.getCurrentPageElements(Sentence.TAG);
  for(let i in sentences){
    sentences[i].render(ctx);
  }
  let paragraphs = SDUDocument.getCurrentPageElements(Paragraph.TAG);
  for(let i in paragraphs){
    paragraphs[i].render(ctx);
  }
  let articles = SDUDocument.getCurrentPageElements(Article.TAG);
  for(let i in articles){
    articles[i].render(ctx);
  }
  let books = SDUDocument.getCurrentPageElements(Book.TAG);
  for(let i in books){
    books[i].render(ctx);
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
