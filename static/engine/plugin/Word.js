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
//   2021/04/20 - Version 1.0.0
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
Word.TAG = 'Word';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Word.prototype.initialize = function(id, pages){
  PolygonGroup.prototype.initialize.call(this, id, pages);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Word.prototype.newElement = function(){
  return new Word('', []);
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Word.prototype.onAwake = function(){
  PolygonGroup.prototype.onAwake.call(this);
};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Word.prototype.onUpdate = function(){

};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Word.prototype.onRemove = function(){

};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Word.prototype.checkCollide = function(point){
  return -1;
};
// --------------------------------------------------------------------------------
// * Polygon Group
// --------------------------------------------------------------------------------
Word.prototype.callFatherCalcPoints = function(){
  if(this._father){
    ElementManager.getElement(Sentence.TAG, this._father).calcPoints();
  }
};
Word.prototype.callFatherCalcPages = function(){
  if(this._father){
    ElementManager.getElement(Sentence.TAG, this._father).calcPages();
  }
};
// --------------------------------------------------------------------------------
// * Merge
// --------------------------------------------------------------------------------
Word.prototype.getMergePoints = function(){
  let points = {};
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = []
  }
  for(let i = 0; i < this._children.length; i++){
    let character_object = ElementManager.getElement(Character.TAG, this._children[i]);
    if(character_object){
      let polygon_object = ElementManager.getElement(Polygon2D.TAG, character_object.polygon);
      points[character_object.pages[0]].push(polygon_object.points);
    }
  }
  return points;
};
Word.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let character_object = ElementManager.getElement(Character.TAG, this._children[i]);
    if(character_object){
      pages.push(character_object.pages);
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Word.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Character.TAG, this._children[i]).char);
  }
  return str.join('');
};
Word.prototype.getExportStringArray = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(ElementManager.getElement(Character.TAG, this._children[i]).char);
  }
  return str;
};
// --------------------------------------------------------------------------------
Word.prototype.loadJson = function(json_object){
  PolygonGroup.prototype.loadJson.call(this, json_object);
};
Word.prototype.saveJson = function(){
  return PolygonGroup.prototype.saveJson.call(this);
};
Word.prototype.exportJson = function(){
  return PolygonGroup.prototype.exportJson.call(this);
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Todo, id: 'plugin-todo-word', dictionary:[
      { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增字符】左键单击一个没有字符的多边形。【修改字符】左键单击一个已有字符的多边形。【移除字符】右键单击一个已有字符的多边形。'] },
      { id: 'zh-tw', text: ['【移動】按下中鍵+拖動。【縮放】滾動鼠標中鍵。【新增字符】左鍵單擊一個沒有字符的多邊形。【修改字符】左鍵單擊一個已有字符的多邊形。【移除字符】右鍵單擊一個已有字符的多邊形。'] },
      { id: 'en-us', text: ['[Move]: Press & Drag. [Scale]: Mousewheel.'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'plugin-tooltip-word', dictionary:[
      { id: 'zh-cn', text: ['词汇工具'] },
      { id: 'zh-tw', text: ['詞匯工具'] },
      { id: 'en-us', text: ['Word Tool'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('word', 'plugin-tooltip-word', 'mdi-file-word-box', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-todo-word');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('word.onMouseLeftClick', 'left_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length > 0){
      let character = ElementManager.getFilteredElement(Polygon2D.TAG, collide_list[0]).character;
      if(character){
        let character_object = ElementManager.getFilteredElement(Character.TAG, character);
        if(character_object.father){
          SelectManager.selectId(character_object.father);
        }else{
          if(SelectManager.isSelectedType(Word.TAG)){
            let word_object = SelectManager.getSelectedObject();
            word_object.append(character_object);
            /* History */
          }else{
            let word_object = ElementManager.makeElement(Word.TAG, []);
            word_object.append(character_object);
            SelectManager.selectObject(word_object);
            DocumentManager.addElementWithUpdate(Word.TAG, word_object);
            return;
          }
        }
      }
    }
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('word.onMouseRightClick', 'right_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length > 0){
      let character = ElementManager.getFilteredElement(Polygon2D.TAG, collide_list[0]).character;
      if(character){
        let character_object = ElementManager.getFilteredElement(Character.TAG, character);
        let word = character_object.father;
        if(word){
          if(!SelectManager.isSelectedType(Word.TAG) || word === SelectManager.getSelectedId()){
            let word_object = ElementManager.getFilteredElement(Word.TAG, word);
            word_object.remove(character_object);
            if(word_object.isEmpty()){
              SelectManager.unSelect();
              DocumentManager.removeElementWithUpdate(Word.TAG, word);
            }else{
              Graphics.refresh();
              SelectManager.selectId(word);
              /* History */
            }
            return;
          }
        }
      }
    }
    SelectManager.unSelect();
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('word.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('word.onMouseOut', 'mouseout', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
Graphics.renderWordObjectNormal = function(word_object){
  let line_scale = 11;
  let line_color = ColorManager.RGBToHex(255, 255, 0);
  let polygons = word_object.getPolyGonList();
  for(let i = 0; i < polygons.length; i++){
    Graphics.strokePolygon(Graphics.getRenderPolygon(polygons[i]).getScaledPolygon(line_scale),
      2, line_color, 0.8);
  }
};
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('word.doc.all', '', 30, function(ctx){
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
RenderManager.addRenderer(new Renderer('word.polygon.collide', '', 21, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let polygon_object = ElementManager.getElement(Polygon2D.TAG, collide_list[0]);
    Graphics.renderPolygonCollide(Graphics.getRenderPolygon(polygon_object.getPolygon()));
  }
}));
// ================================================================================
