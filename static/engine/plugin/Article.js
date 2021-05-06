// ================================================================================
// * Article <SDUDOC Engine Plugin>
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
// * Article
// --------------------------------------------------------------------------------
function Article(){
  this.initialize.apply(this, arguments);
}
Article.prototype = Object.create(PolygonGroup.prototype);
Article.prototype.constructor = Article;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Article.TAG = "Article";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Article.prototype._id = "";
Article.prototype._page = "";
// --------------------------------------------------------------------------------
Article.prototype._line_width = 0;
Article.prototype._color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Article.prototype.initialize = function(id, page){
  PolygonGroup.prototype.initialize.call(this);

  this._line_width = 4 * 2;
  this._color = 'rgba(255, 0, 0, 0.5)';

  this._id = id;
  this._page = page;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Article.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Article.prototype, 'page', {
  get: function() {
    return this._page;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Article.prototype.setColor = function(color){
  this._color = color;
}
// --------------------------------------------------------------------------------
Article.prototype.getObject = function(){
  return new Article("", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Article.prototype.callFatherCalcPoints = function(){

};
// --------------------------------------------------------------------------------
Article.prototype.getMergePoints = function(){
  let points = [];
  for(let i = 0; i < this._children.length; i++){
    let paragraph = SDUDocument.getCurrentPageElement(Paragraph.TAG, this._children[i]);
    if(paragraph){
      points = points.concat(paragraph.points);
    }
  }
  return points;
};
// --------------------------------------------------------------------------------
Article.prototype.render = function(ctx){
  for(let i = 0; i < this._points.length; i++){
    let points = [];
    for(let j = 0; j < this._points[i].length; j++){
      points[j] = SDUDocument.getCurrentPageElement(Dot2D.TAG, this._points[i][j]);
    }
    PolygonGroup.prototype.strokeCanvas.call(new Polygon(points), ctx, this._line_width, this._color);
  }
};
Article.prototype.renderCollide = function(ctx){

};
// --------------------------------------------------------------------------------
Article.prototype.onDelete = function(){

};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Article.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(SDUDocument.getCurrentPageElement(Paragraph.TAG, this._children[i]).getExportString());
  }
  return str;
}
// --------------------------------------------------------------------------------
Article.prototype.loadJson = function(json){
  this._id = json._id;
  this._page = json._page;
  this._children = json._children;
  this._father = json._father;
  this._points = json._points;
}
Article.prototype.saveJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _children: this._children,
    _father: this._father,
    _points: this._points
  }
}
Article.prototype.exportJson = function(){
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
// * ArticleFactory
// --------------------------------------------------------------------------------
function ArticleFactory(){
  throw new Error('This is a static class');
}
ArticleFactory._currentArticle = null;
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
ArticleFactory.getCurrentArticle = function(){
  return this._currentArticle;
};
ArticleFactory.setCurrentArticle = function(id){
  this._currentArticle = id;
};
ArticleFactory.clearCurrentArticle = function(){
  this._currentArticle = null;
};
ArticleFactory.makeObject = function(page){
  return new Article(this.getNextIndex(), page);
};
ArticleFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Article.TAG);
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool("article", "文章工具", "mdi-text-box", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("article.onLeftClick", "left_click", false, ArticleFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      let word = SDUDocument.getCurrentPageElement(Character.TAG, character).father;
      if(word){
        let sentence = SDUDocument.getCurrentPageElement(Word.TAG, word).father;
        if(sentence){
          let sentence_object = SDUDocument.getCurrentPageElement(Sentence.TAG, sentence);
          if(sentence_object.father){
            ParagraphFactory.setCurrentParagraph(sentence_object.father);
          }else{
            if(ParagraphFactory.getCurrentParagraph()){
              let paragraph_object = SDUDocument.getCurrentPageElement(Paragraph.TAG, ParagraphFactory.getCurrentParagraph());
              paragraph_object.append(sentence_object);
              DocumentManager.push();
            }else{
              let paragraph_object = ParagraphFactory.makeObject(DocumentManager.getCurrentPageId());
              paragraph_object.append(sentence_object);
              ParagraphFactory.setCurrentParagraph(paragraph_object.id);
              DocumentManager.addElement(Paragraph.TAG, paragraph_object);
              return;
            }
          }
        }
      }
    }
  }
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("article.onRightClick", "right_click", false, ArticleFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      let word = SDUDocument.getCurrentPageElement(Character.TAG, character).father;
      if(word){
        let sentence = SDUDocument.getCurrentPageElement(Word.TAG, word).father;
        if(sentence){
          let sentence_object = SDUDocument.getCurrentPageElement(Sentence.TAG, sentence);
          let paragraph = sentence_object.father;
          if(paragraph){
            if(!ParagraphFactory.getCurrentParagraph() || paragraph === ParagraphFactory.getCurrentParagraph()){
              let paragraph_object = SDUDocument.getCurrentPageElement(Paragraph.TAG, paragraph);
              paragraph_object.remove(sentence_object);
              if(paragraph_object.isEmpty()){
                DocumentManager.deleteElement(Paragraph.TAG, paragraph);
                ParagraphFactory.clearCurrentParagraph();
              }else{
                ParagraphFactory.setCurrentParagraph(paragraph);
                DocumentManager.push();
              }
              Graphics.refresh();
              return;
            }
          }
        }
      }
    }
  }
  ParagraphFactory.clearCurrentParagraph();
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("article.onMouseMove", "mousemove", false, ArticleFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("article.onMouseOut", "mouseout", false, ArticleFactory, function(event){
  ArticleFactory.clearCurrentParagraph();
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("article.doc.normal", 7, ArticleFactory, function(ctx){
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
RenderManager.addRenderer(new Renderer("article.polygon.collide", 6, ArticleFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
// ================================================================================
