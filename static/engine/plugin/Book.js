// ================================================================================
// * Book <SDUDOC Engine Plugin>
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
// * Book
// --------------------------------------------------------------------------------
function Book(){
  this.initialize.apply(this, arguments);
}
Book.prototype = Object.create(PolygonGroup.prototype);
Book.prototype.constructor = Book;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Book.TAG = "Book";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Book.prototype._line_width = 0;
Book.prototype._line_scale = 0;
Book.prototype._color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Book.prototype.initialize = function(id, page){
  PolygonGroup.prototype.initialize.call(this);

  this._line_width = 2;
  this._line_scale = 3;
  this._color = 'rgba(255, 0, 255, 0.8)';

  this._id = id;
  this._pages = [page];
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Book.prototype.setColor = function(color){
  this._color = color;
}
// --------------------------------------------------------------------------------
Book.prototype.getObject = function(){
  return new Book("", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Book.prototype.callFatherCalcPoints = function(){

};
Book.prototype.callFatherCalcPages = function(){

};
// --------------------------------------------------------------------------------
Book.prototype.getMergePoints = function(){
  let points = {};
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = []
  }
  for(let i = 0; i < this._children.length; i++){
    let article = SDUDocument.getElement(Article.TAG, this._children[i]);
    if(article){
      for(let page in article.points){
        points[page] = points[page].concat(article.points[page]);
      }
    }
  }
  return points;
};
Book.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let article = SDUDocument.getElement(Article.TAG, this._children[i]);
    if(article){
      pages.push(article.pages)
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
Book.prototype.render = function(ctx){
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
Book.prototype.renderCollide = function(ctx){

};
// --------------------------------------------------------------------------------
Book.prototype.onDelete = function(){

};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Book.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(SDUDocument.getElement(Article.TAG, this._children[i]).getExportString());
  }
  return str;
}
// --------------------------------------------------------------------------------
Book.prototype.loadJson = function(json){
  this._id = json._id;
  this._pages = json._pages;
  this._children = json._children;
  this._father = json._father;
  this._points = json._points;
}
Book.prototype.saveJson = function(){
  return {
    _id: this._id,
    _pages: this._pages,
    _children: this._children,
    _father: this._father,
    _points: this._points
  }
}
Book.prototype.exportJson = function(){
  return {
    id: this._id,
    pages: this._pages,
    children: this._children,
    father: this._father,
    string: this.getExportString(),
    points: this.getExportPoints()
  }
}
// ================================================================================

// ================================================================================
// * BookFactory
// --------------------------------------------------------------------------------
function BookFactory(){
  throw new Error('This is a static class');
}
BookFactory._currentBook = null;
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
BookFactory.getCurrentBook = function(){
  return this._currentBook;
};
BookFactory.setCurrentBook = function(id){
  this._currentBook = id;
};
BookFactory.clearCurrentBook = function(){
  this._currentBook = null;
};
BookFactory.makeObject = function(page){
  return new Book(this.getNextIndex(), page);
};
BookFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Book.TAG);
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool("book", "书籍工具", "mdi-book-open-outline", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("book.onLeftClick", "left_click", false, BookFactory, function(event){
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
            let article = SDUDocument.getCurrentPageElement(Paragraph.TAG, paragraph).father;
            if(article){
              let article_object = SDUDocument.getCurrentPageElement(Article.TAG, article);
              if(article_object.father){
                BookFactory.setCurrentBook(article_object.father);
              }else{
                if(BookFactory.getCurrentBook()){
                  let book_object = SDUDocument.getElement(Book.TAG, BookFactory.getCurrentBook());
                  book_object.append(article_object);
                  DocumentManager.push();
                }else{
                  let book_object = BookFactory.makeObject(DocumentManager.getCurrentPageId());
                  book_object.append(article_object);
                  BookFactory.setCurrentBook(book_object.id);
                  DocumentManager.addElement(Book.TAG, book_object);
                  return;
                }
              }
            }
          }
        }
      }
    }
  }
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("book.onRightClick", "right_click", false, BookFactory, function(event){
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
            let article = SDUDocument.getCurrentPageElement(Paragraph.TAG, paragraph).father;
            if(article){
              let article_object = SDUDocument.getCurrentPageElement(Article.TAG, article);
              let book = article_object.father;
              if(book){
                if(!BookFactory.getCurrentBook() || book === BookFactory.getCurrentBook()){
                  let book_object = SDUDocument.getCurrentPageElement(Book.TAG, book);
                  book_object.remove(article_object);
                  if(book_object.isEmpty()){
                    DocumentManager.deleteElement(Book.TAG, book);
                    BookFactory.clearCurrentBook();
                  }else{
                    BookFactory.setCurrentBook(book);
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
  }
  BookFactory.clearCurrentBook();
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("book.onMouseMove", "mousemove", false, BookFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("book.onMouseOut", "mouseout", false, BookFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("book.doc.normal", 7, BookFactory, function(ctx){
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
RenderManager.addRenderer(new Renderer("book.polygon.collide", 6, BookFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
// ================================================================================
