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
Sentence.prototype._id = "";
Sentence.prototype._page = "";
// --------------------------------------------------------------------------------
Sentence.prototype._line_width = 0;
Sentence.prototype._color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Sentence.prototype.initialize = function(id, page){
  PolygonGroup.prototype.initialize.call(this);

  this._line_width = 7 * 2;
  this._color = 'rgba(0, 255, 0, 0.5)';

  this._id = id;
  this._page = page;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Sentence.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Sentence.prototype, 'page', {
  get: function() {
    return this._page;
  },
  configurable: true
});
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
    SDUDocument.getCurrentPageElement(Paragraph.TAG, this._father).calcPoints();
  }
};
// --------------------------------------------------------------------------------
Sentence.prototype.getMergePoints = function(){
  let points = [];
  for(let i = 0; i < this._children.length; i++){
    let word = SDUDocument.getCurrentPageElement(Word.TAG, this._children[i]);
    if(word){
      points = points.concat(word.points);
    }
  }
  return points;
};
// --------------------------------------------------------------------------------
Sentence.prototype.render = function(ctx){
  for(let i = 0; i < this._points.length; i++){
    let points = [];
    for(let j = 0; j < this._points[i].length; j++){
      points[j] = SDUDocument.getCurrentPageElement(Dot2D.TAG, this._points[i][j]);
    }
    PolygonGroup.prototype.strokeCanvas.call(new Polygon(points), ctx, this._line_width, this._color);
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
    str.push(SDUDocument.getCurrentPageElement(Word.TAG, this._children[i]).getExportString());
  }
  return str;
}
// --------------------------------------------------------------------------------
Sentence.prototype.loadJson = function(json){
  this._id = json._id;
  this._page = json._page;
  this._children = json._children;
  this._father = json._father;
  this._points = json._points;
}
Sentence.prototype.saveJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _children: this._children,
    _father: this._father,
    _points: this._points
  }
}
Sentence.prototype.exportJson = function(){
  return {
    id: this._id,
    page: this._page,
    children: this._children,
    father: this._father,
    string: this.getExportString(),
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
SentenceFactory._currentSentence = null;
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
SentenceFactory.getCurrentSentence = function(){
  return this._currentSentence;
};
SentenceFactory.setCurrentSentence = function(id){
  this._currentSentence = id;
};
SentenceFactory.clearCurrentSentence = function(){
  this._currentSentence = null;
};
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
          SentenceFactory.setCurrentSentence(word_object.father);
        }else{
          if(SentenceFactory.getCurrentSentence()){
            let sentence_object = SDUDocument.getCurrentPageElement(Sentence.TAG, SentenceFactory.getCurrentSentence());
            sentence_object.append(word_object);
            DocumentManager.push();
          }else{
            let sentence_object = SentenceFactory.makeObject(DocumentManager.getCurrentPageId());
            sentence_object.append(word_object);
            SentenceFactory.setCurrentSentence(sentence_object.id);
            DocumentManager.addElement(Sentence.TAG, sentence_object);
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
          if(!SentenceFactory.getCurrentSentence() || sentence === SentenceFactory.getCurrentSentence()){
            let sentence_object = SDUDocument.getCurrentPageElement(Sentence.TAG, sentence);
            sentence_object.remove(word_object);
            if(sentence_object.isEmpty()){
              DocumentManager.deleteElement(Sentence.TAG, sentence);
              SentenceFactory.clearCurrentSentence();
            }else{
              SentenceFactory.setCurrentSentence(sentence);
              DocumentManager.push();
            }
            Graphics.refresh();
            return;
          }
        }
      }
    }
  }
  SentenceFactory.clearCurrentSentence();
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("sentence.onMouseMove", "mousemove", false, SentenceFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("sentence.onMouseOut", "mouseout", false, SentenceFactory, function(event){
  SentenceFactory.clearCurrentSentence();
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
}));
RenderManager.addRenderer(new Renderer("sentence.polygon.collide", 6, SentenceFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
// ================================================================================
