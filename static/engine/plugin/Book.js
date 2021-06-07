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
//   2021/04/20 - Version 1.0.0
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
Book.TAG = 'Book';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Book.prototype.initialize = function(id, pages){
  PolygonGroup.prototype.initialize.call(this, id, pages);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Book.prototype.newElement = function(){
  return new Book('', []);
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Book.prototype.onAwake = function(){

};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Book.prototype.onUpdate = function(){

};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Book.prototype.onRemove = function(){

};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Book.prototype.checkCollide = function(point){
  return -1;
};
// --------------------------------------------------------------------------------
// * Polygon Group
// --------------------------------------------------------------------------------
Book.prototype.callFatherCalcPoints = function(){

};
Book.prototype.callFatherCalcPages = function(){

};
// --------------------------------------------------------------------------------
// * Merge
// --------------------------------------------------------------------------------
Book.prototype.getMergePoints = function(){
  let points = {};
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = []
  }
  for(let i = 0; i < this._children.length; i++){
    let article_object = ElementManager.getElement(Article.TAG, this._children[i]);
    if(article_object){
      for(let page in article_object.points){
        points[page] = points[page].concat(article_object.points[page]);
      }
    }
  }
  return points;
};
Book.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let article_object = ElementManager.getElement(Article.TAG, this._children[i]);
    if(article_object){
      pages.push(article_object.pages);
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Book.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Article.TAG, this._children[i]).getExportString());
  }
  return str.join('\n\n');
};
Book.prototype.getExportStringArray = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Article.TAG, this._children[i]).getExportStringArray());
  }
  return str;
};
// --------------------------------------------------------------------------------
Book.prototype.loadJson = function(json_object){
  PolygonGroup.prototype.loadJson.call(this, json_object);
};
Book.prototype.saveJson = function(){
  return PolygonGroup.prototype.saveJson.call(this);
};
Book.prototype.exportJson = function(){
  return PolygonGroup.prototype.exportJson.call(this);
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionary({
  type: Language.Type.Todo, id: 'plugin-book', dictionary:[
    { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增书籍】左键单击多边形。【选中书籍】左键单击多边形。【取消选中书籍】右键单击空白处或其他多边形。【删除书籍】右键单击多边形。'] }
  ]
});
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('book', '书籍工具', 'mdi-book-open-outline', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-book');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('book.onMouseLeftClick', 'left_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length > 0){
      let character = ElementManager.getFilteredElement(Polygon2D.TAG, collide_list[0]).character;
      if(character){
        let word = ElementManager.getFilteredElement(Character.TAG, character).father;
        if(word){
          let sentence = ElementManager.getFilteredElement(Word.TAG, word).father;
          if(sentence){
            let paragraph = ElementManager.getFilteredElement(Sentence.TAG, sentence).father;
            if(paragraph){
              let article = ElementManager.getFilteredElement(Paragraph.TAG, paragraph).father;
              if(article){
                let article_object = ElementManager.getFilteredElement(Article.TAG, article);
                if(article_object.father){
                  SelectManager.selectId(article_object.father);
                }else{
                  if(SelectManager.isSelectedType(Book.TAG)){
                    let book_object = SelectManager.getSelectedObject();
                    book_object.append(article_object);
                    /* History */
                  }else{
                    let book_object = ElementManager.makeElement(Book.TAG, []);
                    book_object.append(article_object);
                    SelectManager.selectObject(book_object);
                    DocumentManager.addElementWithUpdate(Book.TAG, book_object);
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
  })
);
ToolManager.addHandler(new Handler('book.onMouseRightClick', 'right_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length > 0){
      let character = ElementManager.getFilteredElement(Polygon2D.TAG, collide_list[0]).character;
      if(character){
        let word = ElementManager.getFilteredElement(Character.TAG, character).father;
        if(word){
          let sentence = ElementManager.getFilteredElement(Word.TAG, word).father;
          if(sentence){
            let paragraph = ElementManager.getFilteredElement(Sentence.TAG, sentence).father;
            if(paragraph){
              let article = ElementManager.getFilteredElement(Paragraph.TAG, paragraph).father;
              if(article){
                let article_object = ElementManager.getFilteredElement(Article.TAG, article);
                let book = article_object.father;
                if(book){
                  if(!SelectManager.isSelectedType(Book.TAG) || book === SelectManager.getSelectedId()){
                    let book_object = ElementManager.getFilteredElement(Book.TAG, book);
                    book_object.remove(article_object);
                    if(book_object.isEmpty()){
                      SelectManager.unSelect();
                      DocumentManager.removeElementWithUpdate(Book.TAG, book);
                    }else{
                      SelectManager.selectId(book);
                      Graphics.refresh();
                      /* History */
                    }
                    return;
                  }
                }
              }
            }
          }
        }
      }
    }
    SelectManager.unSelect();
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('book.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('book.onMouseOut', 'mouseout', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
Graphics.renderBookObjectNormal = function(book_object){
  let line_scale = 3;
  let line_color = ColorManager.RGBToHex(255, 0, 255);
  let polygons = book_object.getPolyGonList();
  for(let i = 0; i < polygons.length; i++){
    Graphics.strokePolygon(Graphics.getRenderPolygon(polygons[i]).getScaledPolygon(line_scale),
      2, line_color, 0.8);
  }
};
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('book.doc.normal', '', 30, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let word_objects = ElementManager.getFilteredElements(Word.TAG);
  for(let key in word_objects){
    Graphics.renderWordObjectNormal(word_objects[key]);
  }
  let sentence_objects = ElementManager.getFilteredElements(Sentence.TAG);
  for(let key in sentence_objects){
    Graphics.renderSentenceObjectNormal(sentence_objects[key]);
  }
  let paragraph_objects = ElementManager.getFilteredElements(Paragraph.TAG);
  for(let key in paragraph_objects){
    Graphics.renderParagraphObjectNormal(paragraph_objects[key]);
  }
  let article_objects = ElementManager.getFilteredElements(Article.TAG);
  for(let key in article_objects){
    Graphics.renderArticleObjectNormal(article_objects[key]);
  }
  let book_objects = ElementManager.getFilteredElements(Book.TAG);
  for(let key in book_objects){
    Graphics.renderBookObjectNormal(book_objects[key]);
  }
}));
RenderManager.addRenderer(new Renderer('book.polygon.collide', '', 21, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let polygon_object = ElementManager.getElement(Polygon2D.TAG, collide_list[0]);
    Graphics.renderPolygonCollide(Graphics.getRenderPolygon(polygon_object.getPolygon()));
  }
}));
// ================================================================================
