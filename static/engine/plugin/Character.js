// ================================================================================
// * Character <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/19 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Character
// --------------------------------------------------------------------------------
function Character(){
  this.initialize.apply(this, arguments);
}
Character.prototype = Object.create(Element.prototype);
Character.prototype.constructor = Character;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Character.TAG = 'Character';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Character.prototype._char = '';
Character.prototype._remark = '';
// --------------------------------------------------------------------------------
Character.prototype._polygon = '';
Character.prototype._father = '';
// --------------------------------------------------------------------------------
Character.prototype._background_color = '';
Character.prototype._text_color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Character.prototype.initialize = function(id, pages, polygon, char, remark){
  Element.prototype.initialize.call(this, id, pages);

  this._polygon = polygon;
  this._char = char;
  this._remark = remark;

  this._father = '';
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Character.prototype, 'polygon', {
  get: function() {
    return this._polygon;
  },
  configurable: true
});
Object.defineProperty(Character.prototype, 'char', {
  get: function() {
    return this._char;
  },
  set: function(value) {
    this._char = value;
  },
  configurable: true
});
Object.defineProperty(Character.prototype, 'remark', {
  get: function() {
    return this._remark;
  },
  set: function(value) {
    this._remark = value;
  },
  configurable: true
});
Object.defineProperty(Character.prototype, 'father', {
  get: function() {
    return this._father;
  },
  set: function(value) {
    this._father = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Get Base Object
// --------------------------------------------------------------------------------
Character.prototype.getPoint = function(){
  let polygon = ElementManager.getFilteredElement(Polygon2D.TAG, this._polygon).getPolygon();
  return polygon.getCorePoint();
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Character.prototype.newElement = function(){
  return new Character('', [], '', '', '');
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
Character.prototype.onAwake = function(){
  Element.prototype.onAwake.call(this);
};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
Character.prototype.onUpdate = function(){
  Element.prototype.onUpdate.call(this);
};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
Character.prototype.onRemove = function(){
  Element.prototype.onRemove.call(this);
  let polygon_object = ElementManager.getFilteredElement(Polygon2D.TAG, this._polygon);
  if(polygon_object) polygon_object.character = '';
  let word_object = ElementManager.getFilteredElement(Word.TAG, this._father);
  if(word_object) word_object.remove(this._id);
};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
Character.prototype.checkCollide = function(point){
  return -1;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Character.prototype.getExportPoints = function(){
  let temp = [];
  let points = ElementManager.getElement(Polygon2D.TAG, this._polygon).getPolygon().points;
  for(let i = 0; i < points.length; i++){
    temp.push([points[i].x.toFixed(2), points[i].y.toFixed(2)]);
  }
  return temp;
};
// --------------------------------------------------------------------------------
Character.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._char    = json_object._char    === undefined ? this._char    : json_object._char;
  this._remark  = json_object._remark  === undefined ? this._remark  : json_object._remark;
  this._father  = json_object._father  === undefined ? this._father  : json_object._father;
  this._polygon = json_object._polygon === undefined ? this._polygon : json_object._polygon;
};
Character.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._char    = this._char;
  output._remark  = this._remark;
  output._father  = this._father;
  output._polygon = this._polygon;
  return output;
};
Character.prototype.exportJson = function(){
  let output = Element.prototype.exportJson.call(this);
  output.string = this._char;
  output.remark = this._remark;
  output.father = this._father;
  output.points = this.getExportPoints();
  return output;
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Todo, id: 'plugin-todo-character', dictionary:[
      { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增词】左键单击多边形。【选中词】左键单击多边形。【取消选中词】右键单击空白处或其他多边形。【移除词】右键单击多边形。'] },
      { id: 'zh-tw', text: ['【移動】按下中鍵+拖動。【縮放】滾動鼠標中鍵。【新增詞】左鍵單擊多邊形。【選中詞】左鍵單擊多邊形。【取消選中詞】右鍵單擊空白處或其他多邊形。【移除詞】右鍵單擊多邊形。'] },
      { id: 'en-us', text: ['[Move]: Press & Drag. [Scale]: Mousewheel. [Add Character]: Left click polygon. [Cancel]: Right click. [Remove Character]:Right click.'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'plugin-tooltip-character', dictionary:[
      { id: 'zh-cn', text: ['文字工具'] },
      { id: 'zh-tw', text: ['文字工具'] },
      { id: 'en-us', text: ['Character Tool'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('character', 'plugin-tooltip-character', 'mdi-format-text-variant', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-todo-character');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('character.onMouseLeftClick', 'left_click', false, Engine, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = ElementManager.getFilteredElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      if(SelectManager.isSelectedType(Character.TAG) && SelectManager.getSelectedId() === character){
        let selected_character = SelectManager.getSelectedObject();
        Engine.prompt(Engine, '修改文字', ['新文字', '备注（可不填）'],
          [selected_character.char, selected_character.remark], function(text_array){
            if(text_array[0]){
              selected_character.char = text_array[0];
              selected_character.remark = text_array[1] || '';
              if (selected_character._renderBuffer){
                delete selected_character._renderBuffer;
              }
              SelectManager.updateCheckData();
              Graphics.refresh();
            }
          }
        );
        return;
      }
      SelectManager.selectId(character);
      Graphics.refresh();
    }else{
      Engine.prompt(Engine, '输入文字', ['请输入该多边形包含的文字', '备注（可不填）'], [null, null], function(text_array){
        if(text_array[0]){
          let character_object = ElementManager.makeElement(Character.TAG, [DocumentManager.getCurrentPageId()],
            collide_list[0], text_array[0], text_array[1] || '')
          ElementManager.getFilteredElement(Polygon2D.TAG, collide_list[0]).character = character_object.id;
          SelectManager.selectObject(character_object);
          DocumentManager.addElementWithUpdate(Character.TAG, character_object);
        }
      });
    }
  }
}));
ToolManager.addHandler(new Handler('character.onMouseRightClick', 'right_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;

    if(SelectManager.isSelectedType(Character.TAG)){
      SelectManager.unSelect();
      Graphics.refresh();
      return;
    }
    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length > 0){
      let character = ElementManager.getFilteredElement(Polygon2D.TAG, collide_list[0]).character;
      if(character){
        DocumentManager.removeElementWithUpdate(Character.TAG, character);
      }
    }
  })
);
ToolManager.addHandler(new Handler('character.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('character.onMouseOut', 'mouseout', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
Graphics.renderCharacterObjectNormal = function(character_object){
  // let background_color = ColorManager.RGBToHex(255, 255, 255);
  // let text_color = 'black';
  // let point = this.getRenderPoint(character_object.getPoint());
  // // if (!character_object._renderBuffer){
  //   character_object._renderBuffer = Graphics.calcTextRenderBuffer(character_object.char, '12px', text_color, 'center');
  // }
  // this.drawTextWithBuffer(character_object._renderBuffer, point.x, point.y, 0, 'center', 'center',
  //   background_color, 0.8, 0, 0, 0);

  let background_color = 'rgba(255, 255, 255, 0.8)';
  let text_color = 'rgba(0, 0, 0, 1)';
  let point = this.getRenderPoint(character_object.getPoint());
  this.drawTextCanvas(character_object.char, point.x, point.y, 0, '12px', text_color, 'center', 'center',
    background_color, 0, 'rgba(0, 0, 0, 0)');
};
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('character.character.all', '', 90, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let characters = ElementManager.getFilteredElements(Character.TAG);
  for(let id in characters){
    Graphics.renderCharacterObjectNormal(characters[id]);
  }
}));
RenderManager.addRenderer(new Renderer('!character.character.all', '', 90, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let characters = ElementManager.getFilteredElements(Character.TAG);
  for(let id in characters){
    Graphics.renderCharacterObjectNormal(characters[id]);
  }
}));
RenderManager.addRenderer(new Renderer('character.doc.all', '', 30, function(ctx){
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
RenderManager.addRenderer(new Renderer('character.polygon.collide', '', 21, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let polygon_object = ElementManager.getElement(Polygon2D.TAG, collide_list[0]);
    Graphics.renderPolygonCollide(Graphics.getRenderPolygon(polygon_object.getPolygon()));
  }
}));
// ================================================================================
