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
//   2021/04/20 - Version 1.0.0
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
Article.prototype._line_width = 0;
Article.prototype._line_scale = 0;
Article.prototype._color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Article.prototype.initialize = function(id, page){
  PolygonGroup.prototype.initialize.call(this);

  this._line_width = 2;
  this._line_scale = 5;
  this._color = 'rgba(0, 255, 255, 0.8)';

  this._id = id;
  this._pages = [page];
};
// --------------------------------------------------------------------------------
// * Getter & Setter
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
  if(this._father){
    SDUDocument.getElement(Book.TAG, this._father).calcPoints();
  }
};
Article.prototype.callFatherCalcPages = function(){
  if(this._father){
    SDUDocument.getElement(Book.TAG, this._father).calcPages();
  }
};
// --------------------------------------------------------------------------------
Article.prototype.getMergePoints = function(){
  let points = {};
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = []
  }
  for(let i = 0; i < this._children.length; i++){
    let paragraph = SDUDocument.getElement(Paragraph.TAG, this._children[i]);
    if(paragraph){
      for(let page in paragraph.points){
        points[page] = points[page].concat(paragraph.points[page]);
      }
    }
  }
  return points;
};
Article.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let paragraph = SDUDocument.getElement(Paragraph.TAG, this._children[i]);
    if(paragraph){
      pages.push(paragraph.pages)
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
Article.prototype.render = function(ctx){
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
    str.push(SDUDocument.getElement(Paragraph.TAG, this._children[i]).getExportString());
  }
  return str.join('\n');
}
Article.prototype.getExportStringArray = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(SDUDocument.getElement(Paragraph.TAG, this._children[i]).getExportStringArray());
  }
  return str;
}
// --------------------------------------------------------------------------------
Article.prototype.loadJson = function(json){
  this._id = json._id;
  this._pages = json._pages;
  this._children = json._children;
  this._father = json._father;
  this._points = json._points;
}
Article.prototype.saveJson = function(){
  return {
    _id: this._id,
    _pages: this._pages,
    _children: this._children,
    _father: this._father,
    _points: this._points
  }
}
Article.prototype.exportJson = function(){
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
// * ArticleFactory
// --------------------------------------------------------------------------------
function ArticleFactory(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
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
ToolManager.addTool(new Tool("article", "文章工具", "mdi-file-document-outline", Tool.Slot.PLUGIN, function(id){
  ToolManager.setCurrentPlugin(id);
  Engine.setTodo(LanguageManager.TOOL_ARTICLE);
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
          let paragraph = SDUDocument.getCurrentPageElement(Sentence.TAG, sentence).father;
          if(paragraph){
            let paragraph_object = SDUDocument.getCurrentPageElement(Paragraph.TAG, paragraph);
            if(paragraph_object.father){
              SelectManager.selectId(paragraph_object.father);
            }else{
              if(SelectManager.isType(Article.TAG)){
                let article_object = SDUDocument.getElement(Article.TAG, SelectManager.getObject());
                article_object.append(paragraph_object);
                DocumentManager.push();
              }else{
                let article_object = ArticleFactory.makeObject(DocumentManager.getCurrentPageId());
                article_object.append(paragraph_object);
                DocumentManager.addElement(Article.TAG, article_object);
                SelectManager.selectId(article_object.id);
                return;
              }
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
          let paragraph = SDUDocument.getCurrentPageElement(Sentence.TAG, sentence).father;
          if(paragraph){
            let paragraph_object = SDUDocument.getCurrentPageElement(Paragraph.TAG, paragraph);
            let article = paragraph_object.father;
            if(article){
              if(!SelectManager.isType(Article.TAG) || article === SelectManager.getObject()){
                let article_object = SDUDocument.getCurrentPageElement(Article.TAG, article);
                article_object.remove(paragraph_object);
                if(article_object.isEmpty()){
                  DocumentManager.deleteElement(Article.TAG, article);
                  SelectManager.unSelect();
                }else{
                  SelectManager.selectId(article)
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
  }
  SelectManager.unSelect();
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("article.onMouseMove", "mousemove", false, ArticleFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("article.onMouseOut", "mouseout", false, ArticleFactory, function(event){
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
  let articles = SDUDocument.getCurrentPageElements(Article.TAG);
  for(let i in articles){
    articles[i].render(ctx);
  }
  let books = SDUDocument.getCurrentPageElements(Book.TAG);
  for(let i in books){
    books[i].render(ctx);
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
