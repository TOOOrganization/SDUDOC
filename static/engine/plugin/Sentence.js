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
//   2021/04/21 - Version 1.0.0
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
Sentence.TAG = 'Sentence';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Sentence.prototype.initialize = function(id, pages){
  PolygonGroup.prototype.initialize.call(this, id, pages);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Sentence.prototype.newElement = function(){
  return new Sentence('', []);
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Sentence.prototype.onAwake = function(){

};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Sentence.prototype.onUpdate = function(){

};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Sentence.prototype.onRemove = function(){

};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Sentence.prototype.checkCollide = function(point){
  return -1;
};
// --------------------------------------------------------------------------------
// * Polygon Group
// --------------------------------------------------------------------------------
Sentence.prototype.callFatherCalcPoints = function(){
  if(this._father){
    ElementManager.getElement(Paragraph.TAG, this._father).calcPoints();
  }
};
Sentence.prototype.callFatherCalcPages = function(){
  if(this._father){
    ElementManager.getElement(Paragraph.TAG, this._father).calcPages();
  }
};
// --------------------------------------------------------------------------------
// * Merge
// --------------------------------------------------------------------------------
Sentence.prototype.getMergePoints = function(){
  let points = [];
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = []
  }
  for(let i = 0; i < this._children.length; i++){
    let word_object = ElementManager.getElement(Word.TAG, this._children[i]);
    if(word_object){
      for(let page in word_object.points){
        points[page] = points[page].concat(word_object.points[page]);
      }
    }
  }
  return points;
};
Sentence.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let word_object = ElementManager.getElement(Word.TAG, this._children[i]);
    if(word_object){
      pages.push(word_object.pages);
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Sentence.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Word.TAG, this._children[i]).getExportString());
  }
  return str.join('');
};
Sentence.prototype.getExportStringArray = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Word.TAG, this._children[i]).getExportStringArray());
  }
  return str;
};
// --------------------------------------------------------------------------------
Sentence.prototype.loadJson = function(json_object){
  PolygonGroup.prototype.loadJson.call(this, json_object);
};
Sentence.prototype.saveJson = function(){
  return PolygonGroup.prototype.saveJson.call(this);
};
Sentence.prototype.exportJson = function(){
  return PolygonGroup.prototype.exportJson.call(this);
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionary({
  type: Language.Type.Todo, id: 'plugin-sentence', dictionary:[
    { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增句子】左键单击多边形。【选中句子】左键单击多边形。【取消选中句子】右键单击空白处或其他多边形。【删除句子】右键单击多边形。'] }
  ]
});
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('sentence', '句子工具', 'mdi-text', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-sentence');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('sentence.onMouseLeftClick', 'left_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length > 0){
      let character = ElementManager.getFilteredElement(Polygon2D.TAG, collide_list[0]).character;
      if(character){
        let word = ElementManager.getFilteredElement(Character.TAG, character).father;
        if(word){
          let word_object = ElementManager.getFilteredElement(Word.TAG, word);
          if(word_object.father){
            SelectManager.selectId(word_object.father);
          }else{
            if(SelectManager.isSelectedType(Sentence.TAG)){
              let sentence_object = SelectManager.getSelectedObject();
              sentence_object.append(word_object);
              /* History */
            }else{
              let sentence_object = ElementManager.makeElement(Sentence.TAG, []);
              sentence_object.append(word_object);
              SelectManager.selectObject(sentence_object);
              DocumentManager.addElementWithUpdate(Sentence.TAG, sentence_object);
              return;
            }
          }
        }
      }
    }
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('sentence.onMouseRightClick', 'right_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length > 0){
      let character = ElementManager.getFilteredElement(Polygon2D.TAG, collide_list[0]).character;
      if(character){
        let word = ElementManager.getFilteredElement(Character.TAG, character).father;
        if(word){
          let word_object = ElementManager.getFilteredElement(Word.TAG, word);
          let sentence = word_object.father;
          if(sentence){
            if(!SelectManager.isSelectedType(Sentence.TAG) || sentence === SelectManager.getSelectedId()){
              let sentence_object = ElementManager.getFilteredElement(Sentence.TAG, sentence);
              sentence_object.remove(word_object);
              if(sentence_object.isEmpty()){
                SelectManager.unSelect();
                DocumentManager.removeElementWithUpdate(Sentence.TAG, sentence);
              }else{
                SelectManager.selectId(sentence);
                Graphics.refresh();
                /* History */
              }
              return;
            }
          }
        }
      }
    }
    SelectManager.unSelect();
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('sentence.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('sentence.onMouseOut', 'mouseout', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
Graphics.renderSentenceObjectNormal = function(sentence_object){
  let line_scale = 9;
  let line_color = ColorManager.RGBToHex(0, 255, 0);
  let polygons = sentence_object.getPolyGonList();
  for(let i = 0; i < polygons.length; i++){
    Graphics.strokePolygon(Graphics.getRenderPolygon(polygons[i]).getScaledPolygon(line_scale),
      2, line_color, 0.8);
  }
};
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('sentence.doc.normal', '', 30, function(ctx){
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
RenderManager.addRenderer(new Renderer('sentence.polygon.collide', '', 21, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let polygon_object = ElementManager.getElement(Polygon2D.TAG, collide_list[0]);
    Graphics.renderPolygonCollide(Graphics.getRenderPolygon(polygon_object.getPolygon()));
  }
}));
// ================================================================================
