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
Article.TAG = 'Article';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Article.prototype.initialize = function(id, pages){
  PolygonGroup.prototype.initialize.call(this, id, pages);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Article.prototype.newElement = function(){
  return new Article('', []);
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Article.prototype.onAwake = function(){
  PolygonGroup.prototype.onAwake.call(this);
};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Article.prototype.onUpdate = function(){

};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Article.prototype.onRemove = function(){

};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Article.prototype.checkCollide = function(point){
  return -1;
};
// --------------------------------------------------------------------------------
// * Polygon Group
// --------------------------------------------------------------------------------
Article.prototype.callFatherCalcPoints = function(){
  if(this._father){
    ElementManager.getElement(Book.TAG, this._father).calcPoints();
  }
};
Article.prototype.callFatherCalcPages = function(){
  if(this._father){
    ElementManager.getElement(Book.TAG, this._father).calcPages();
  }
};
// --------------------------------------------------------------------------------
// * Merge
// --------------------------------------------------------------------------------
Article.prototype.getMergePoints = function(){
  let points = {};
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = [];
  }
  for(let i = 0; i < this._children.length; i++){
    let paragraph_object = ElementManager.getElement(Paragraph.TAG, this._children[i]);
    if(paragraph_object){
      for(let page in paragraph_object.points){
        points[page] = points[page].concat(paragraph_object.points[page]);
      }
    }
  }
  return points;
};
Article.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let paragraph_object = ElementManager.getElement(Paragraph.TAG, this._children[i]);
    if(paragraph_object){
      pages.push(paragraph_object.pages);
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Article.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Paragraph.TAG, this._children[i]).getExportString());
  }
  return str.join('\n');
};
Article.prototype.getExportStringArray = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Paragraph.TAG, this._children[i]).getExportStringArray());
  }
  return str;
};
// --------------------------------------------------------------------------------
Article.prototype.loadJson = function(json_object){
  PolygonGroup.prototype.loadJson.call(this, json_object);
};
Article.prototype.saveJson = function(){
  return PolygonGroup.prototype.saveJson.call(this);
};
Article.prototype.exportJson = function(){
  return PolygonGroup.prototype.exportJson.call(this);
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Todo, id: 'plugin-todo-article', dictionary:[
      { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增文章】左键单击多边形。【选中文章】左键单击多边形。【取消选中文章】右键单击空白处或其他多边形。【移除文章】右键单击多边形。'] },
      { id: 'zh-tw', text: ['【移動】按下中鍵+拖動。【縮放】滾動鼠標中鍵。【新增文章】左鍵單擊多邊形。【選中文章】左鍵單擊多邊形。【取消選中文章】右鍵單擊空白處或其他多邊形。【移除文章】右鍵單擊多邊形。'] },
      { id: 'en-us', text: ['[Move]: Press & Drag. [Scale]: Mousewheel.'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'plugin-tooltip-article', dictionary:[
      { id: 'zh-cn', text: ['文章工具'] },
      { id: 'zh-tw', text: ['文章工具'] },
      { id: 'en-us', text: ['Article Tool'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('article', 'plugin-tooltip-article', 'mdi-file-document-outline', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-todo-article');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('article.onMouseLeftClick', 'left_click', false, Engine,
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
              let paragraph_object = ElementManager.getFilteredElement(Paragraph.TAG, paragraph);
              if(paragraph_object.father){
                SelectManager.selectId(paragraph_object.father);
              }else{
                if(SelectManager.isSelectedType(Article.TAG)){
                  let article_object = SelectManager.getSelectedObject();
                  article_object.append(paragraph_object);
                  /* History */
                }else{
                  let article_object = ElementManager.makeElement(Article.TAG, []);
                  article_object.append(paragraph_object);
                  SelectManager.selectObject(article_object);
                  DocumentManager.addElementWithUpdate(Article.TAG, article_object);
                  return;
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
ToolManager.addHandler(new Handler('article.onMouseRightClick', 'right_click', false, Engine,
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
              let paragraph_object = ElementManager.getFilteredElement(Paragraph.TAG, paragraph);
              let article = paragraph_object.father;
              if(article){
                if(!SelectManager.isSelectedType(Article.TAG) || article === SelectManager.getSelectedId()){
                  let article_object = ElementManager.getFilteredElement(Article.TAG, article);
                  article_object.remove(paragraph_object);
                  if(article_object.isEmpty()){
                    SelectManager.unSelect();
                    DocumentManager.removeElementWithUpdate(Article.TAG, article);
                  }else{
                    SelectManager.selectId(article);
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
    SelectManager.unSelect();
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('article.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('article.onMouseOut', 'mouseout', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
Graphics.renderArticleObjectNormal = function(article_object){
  let line_scale = 5;
  let line_color = ColorManager.RGBToHex(0, 255, 255);
  let polygons = article_object.getPolyGonList();
  for(let i = 0; i < polygons.length; i++){
    Graphics.strokePolygon(Graphics.getRenderPolygon(polygons[i]).getScaledPolygon(line_scale),
      2, line_color, 0.8);
  }
};
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('article.doc.normal', '', 30, function(ctx){
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
RenderManager.addRenderer(new Renderer('article.polygon.collide', '', 21, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let polygon_object = ElementManager.getElement(Polygon2D.TAG, collide_list[0]);
    Graphics.renderPolygonCollide(Graphics.getRenderPolygon(polygon_object.getPolygon()));
  }
}));
// ================================================================================
