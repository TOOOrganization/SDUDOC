// ================================================================================
// * Sentence <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/04/21 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Sentence
// --------------------------------------------------------------------------------
function Sentence(){
  this.initialize.apply(this, arguments);
}
Sentence.prototype = Object.create(PolygonGroup.prototype);
Sentence.prototype.constructor = Sentence;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Sentence.TAG = "Sentence";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Sentence.prototype._line_width = 0;
Sentence.prototype._line_scale = 0;
Sentence.prototype._color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Sentence.prototype.initialize = function(id, page){
  PolygonGroup.prototype.initialize.call(this);

  this._line_width = 2;
  this._line_scale = 9;
  this._color = 'rgba(0, 255, 0, 0.8)';

  this._id = id;
  this._pages = [page];
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Sentence.prototype.setColor = function(color){
  this._color = color;
}
// --------------------------------------------------------------------------------
Sentence.prototype.getObject = function(){
  return new Sentence("", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Sentence.prototype.callFatherCalcPoints = function(){
  if(this._father){
    SDUDocument.getElement(Paragraph.TAG, this._father).calcPoints();
  }
};
Sentence.prototype.callFatherCalcPages = function(){
  if(this._father){
    SDUDocument.getElement(Paragraph.TAG, this._father).calcPages();
  }
};
// --------------------------------------------------------------------------------
Sentence.prototype.getMergePoints = function(){
  let points = [];
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = []
  }
  for(let i = 0; i < this._children.length; i++){
    let word = SDUDocument.getElement(Word.TAG, this._children[i]);
    if(word){
      for(let page in word.points){
        points[page] = points[page].concat(word.points[page]);
      }
    }
  }
  return points;
};
Sentence.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let word = SDUDocument.getElement(Word.TAG, this._children[i]);
    if(word){
      pages.push(word.pages)
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
Sentence.prototype.render = function(ctx){
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
Sentence.prototype.renderCollide = function(ctx){

};
// --------------------------------------------------------------------------------
Sentence.prototype.onDelete = function(){

};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Sentence.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(SDUDocument.getElement(Word.TAG, this._children[i]).getExportString());
  }
  return str.join('');
}
Sentence.prototype.getExportStringArray = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(SDUDocument.getElement(Word.TAG, this._children[i]).getExportStringArray());
  }
  return str;
}
// --------------------------------------------------------------------------------
Sentence.prototype.loadJson = function(json){
  this._id = json._id;
  this._pages = json._pages;
  this._children = json._children;
  this._father = json._father;
  this._points = json._points;
}
Sentence.prototype.saveJson = function(){
  return {
    _id: this._id,
    _pages: this._pages,
    _children: this._children,
    _father: this._father,
    _points: this._points
  }
}
Sentence.prototype.exportJson = function(){
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
// * SentenceFactory
// --------------------------------------------------------------------------------
function SentenceFactory(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
SentenceFactory.makeObject = function(page){
  return new Sentence(this.getNextIndex(), page);
};
SentenceFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Sentence.TAG);
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool("sentence", "句子工具", "mdi-text", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
  Engine.setTodo(LanguageManager.TOOL_SENTENCE);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("sentence.onLeftClick", "left_click", false, SentenceFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      let word = SDUDocument.getCurrentPageElement(Character.TAG, character).father;
      if(word){
        let word_object = SDUDocument.getCurrentPageElement(Word.TAG, word);
        if(word_object.father){
          SelectManager.selectId(word_object.father);
        }else{
          if(SelectManager.isType(Sentence.TAG)){
            let sentence_object = SDUDocument.getElement(Sentence.TAG, SelectManager.getObject());
            sentence_object.append(word_object);
            DocumentManager.push();
          }else{
            let sentence_object = SentenceFactory.makeObject(DocumentManager.getCurrentPageId());
            sentence_object.append(word_object);
            DocumentManager.addElement(Sentence.TAG, sentence_object);
            SelectManager.selectId(sentence_object.id);
            return;
          }
        }
      }
    }
  }
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("sentence.onRightClick", "right_click", false, SentenceFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      let word = SDUDocument.getCurrentPageElement(Character.TAG, character).father;
      if(word){
        let word_object = SDUDocument.getCurrentPageElement(Word.TAG, word);
        let sentence = word_object.father;
        if(sentence){
          if(!SelectManager.isType(Sentence.TAG) || sentence === SelectManager.getObject()){
            let sentence_object = SDUDocument.getCurrentPageElement(Sentence.TAG, sentence);
            sentence_object.remove(word_object);
            if(sentence_object.isEmpty()){
              DocumentManager.deleteElement(Sentence.TAG, sentence);
              SelectManager.unSelect();
            }else{
              SelectManager.selectId(sentence);
              DocumentManager.push();
            }
            Graphics.refresh();
            return;
          }
        }
      }
    }
  }
  SelectManager.unSelect();
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("sentence.onMouseMove", "mousemove", false, SentenceFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("sentence.onMouseOut", "mouseout", false, SentenceFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("sentence.doc.normal", 7, SentenceFactory, function(ctx){
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
RenderManager.addRenderer(new Renderer("sentence.polygon.collide", 6, SentenceFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
// ================================================================================
