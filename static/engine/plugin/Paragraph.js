// ================================================================================
// * Paragraph <SDUDOC Engine Plugin>
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
// * Paragraph
// --------------------------------------------------------------------------------
function Paragraph(){
  this.initialize.apply(this, arguments);
}
Paragraph.prototype = Object.create(PolygonGroup.prototype);
Paragraph.prototype.constructor = Paragraph;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Paragraph.TAG = 'Paragraph';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Paragraph.prototype.initialize = function(id, pages){
  PolygonGroup.prototype.initialize.call(this, id, pages);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Paragraph.prototype.newElement = function(){
  return new Paragraph('', []);
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Paragraph.prototype.onAwake = function(){
  PolygonGroup.prototype.onAwake.call(this);
};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Paragraph.prototype.onUpdate = function(){

};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Paragraph.prototype.onRemove = function(){

};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Paragraph.prototype.checkCollide = function(point){
  return -1;
};
// --------------------------------------------------------------------------------
// * Polygon Group
// --------------------------------------------------------------------------------
Paragraph.prototype.callFatherCalcPoints = function(){
  if(this._father){
    ElementManager.getElement(Article.TAG, this._father).calcPoints();
  }
};
Paragraph.prototype.callFatherCalcPages = function(){
  if(this._father){
    ElementManager.getElement(Article.TAG, this._father).calcPages();
  }
};
// --------------------------------------------------------------------------------
// * Merge
// --------------------------------------------------------------------------------
Paragraph.prototype.getMergePoints = function(){
  let points = {};
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = [];
  }
  for(let i = 0; i < this._children.length; i++){
    let sentence_object = ElementManager.getElement(Sentence.TAG, this._children[i]);
    if(sentence_object){
      for(let page in sentence_object.points){
        points[page] = points[page].concat(sentence_object.points[page]);
      }
    }
  }
  return points;
};
Paragraph.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let sentence_object = ElementManager.getElement(Sentence.TAG, this._children[i]);
    if(sentence_object){
      pages.push(sentence_object.pages);
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Paragraph.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Sentence.TAG, this._children[i]).getExportString());
  }
  return str.join(' ');
};
Paragraph.prototype.getExportStringArray = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Sentence.TAG, this._children[i]).getExportStringArray());
  }
  return str;
};
// --------------------------------------------------------------------------------
Paragraph.prototype.loadJson = function(json_object){
  PolygonGroup.prototype.loadJson.call(this, json_object);
};
Paragraph.prototype.saveJson = function(){
  return PolygonGroup.prototype.saveJson.call(this);
};
Paragraph.prototype.exportJson = function(){
  return PolygonGroup.prototype.exportJson.call(this);
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Todo, id: 'plugin-todo-paragraph', dictionary:[
      { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增段落】左键单击多边形。【选中段落】左键单击多边形。【取消选中段落】右键单击空白处或其他多边形。【移除段落】右键单击多边形。'] },
      { id: 'zh-tw', text: ['【移動】按下中鍵+拖動。【縮放】滾動鼠標中鍵。【新增段落】左鍵單擊多邊形。【選中段落】左鍵單擊多邊形。【取消選中段落】右鍵單擊空白處或其他多邊形。【移除段落】右鍵單擊多邊形。'] },
      { id: 'en-us', text: ['[Move]: Press & Drag. [Scale]: Mousewheel.'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'plugin-tooltip-paragraph', dictionary:[
      { id: 'zh-cn', text: ['段落工具'] },
      { id: 'zh-tw', text: ['段落工具'] },
      { id: 'en-us', text: ['Paragraph Tool'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('paragraph', 'plugin-tooltip-paragraph', 'mdi-format-align-left', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-todo-paragraph');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('paragraph.onMouseLeftClick', 'left_click', false, Engine,
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
            let sentence_object = ElementManager.getFilteredElement(Sentence.TAG, sentence);
            if(sentence_object.father){
              SelectManager.selectId(sentence_object.father);
            }else{
              if(SelectManager.isSelectedType(Paragraph.TAG)){
                let paragraph_object = SelectManager.getSelectedObject();
                paragraph_object.append(sentence_object);
                /* History */
              }else{
                let paragraph_object = ElementManager.makeElement(Paragraph.TAG, []);
                paragraph_object.append(sentence_object);
                SelectManager.selectObject(paragraph_object);
                DocumentManager.addElementWithUpdate(Paragraph.TAG, paragraph_object);
                return;
              }
            }
          }
        }
      }
    }
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('paragraph.onMouseRightClick', 'right_click', false, Engine,
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
            let sentence_object = ElementManager.getFilteredElement(Sentence.TAG, sentence);
            let paragraph = sentence_object.father;
            if(paragraph){
              if(!SelectManager.isSelectedType(Paragraph.TAG) || paragraph === SelectManager.getSelectedId()){
                let paragraph_object = ElementManager.getFilteredElement(Paragraph.TAG, paragraph);
                paragraph_object.remove(sentence_object);
                if(paragraph_object.isEmpty()){
                  SelectManager.unSelect();
                  DocumentManager.removeElementWithUpdate(Paragraph.TAG, paragraph);
                }else{
                  Graphics.refresh();
                  SelectManager.selectId(paragraph);
                  /* History */
                }
                return;
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
ToolManager.addHandler(new Handler('paragraph.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('paragraph.onMouseOut', 'mouseout', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
Graphics.renderParagraphObjectNormal = function(paragraph_object){
  let line_scale = 7;
  let line_color = ColorManager.RGBToHex(255, 0, 0);
  let polygons = paragraph_object.getPolyGonList();
  for(let i = 0; i < polygons.length; i++){
    Graphics.strokePolygon(Graphics.getRenderPolygon(polygons[i]).getScaledPolygon(line_scale),
      2, line_color, 0.8);
  }
};
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('paragraph.doc.normal', '', 30, function(ctx){
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
RenderManager.addRenderer(new Renderer('paragraph.polygon.collide', '', 21, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let polygon_object = ElementManager.getElement(Polygon2D.TAG, collide_list[0]);
    Graphics.renderPolygonCollide(Graphics.getRenderPolygon(polygon_object.getPolygon()));
  }
}));
// ================================================================================
