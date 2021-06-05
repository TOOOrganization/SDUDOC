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
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Character.TAG = "Character";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Character.prototype._id = "";
Character.prototype._page = "";
Character.prototype._char = "";
Character.prototype._remark = "";
// --------------------------------------------------------------------------------
Character.prototype._polygon = "";
Character.prototype._father = '';
// --------------------------------------------------------------------------------
Character.prototype._background_color = '';
Character.prototype._text_color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Character.prototype.initialize = function(id, page, polygon, char, remark){

  this._background_color = 'rgba(255, 255, 255, 0.8)';
  this._text_color =  'rgba(0, 0, 0, 1)';

  this._id = id;
  this._page = page;

  this._polygon = polygon;
  this._char = char;
  this._remark = remark;

  this._father = '';
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Character.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Character.prototype, 'page', {
  get: function() {
    return this._page;
  },
  configurable: true
});
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
Character.prototype.setColor = function(background_color, text_color){
  this._background_color = background_color;
  this._text_color = text_color;
}
// --------------------------------------------------------------------------------
Character.prototype.getObject = function(){
  return new Character("", "", "", "", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Character.prototype.render = function(ctx){
  this.fillCanvas(ctx, 8, this._background_color, this._text_color);
};
Character.prototype.renderCollide = function(ctx){

};
// --------------------------------------------------------------------------------
Character.prototype.fillCanvas = function(ctx, radius, background_color, text_color){
  let polygon = SDUDocument.getCurrentPageElement(Polygon2D.TAG, this._polygon);
  this.fill(ctx, radius, background_color, text_color, Graphics.getRenderPoint(polygon.getCorePoint()), this._char);
};
Character.prototype.fill = function(ctx, radius, background_color, text_color, point, text){
  ctx.save();

  ctx.font = radius / 2 * 3 + "px Arial";
  let measure = ctx.measureText(text);

  ctx.fillStyle = background_color;
  if(measure.width < radius * 2){
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius,0,360, false);
    ctx.closePath();
    ctx.fill();
  }else{
    let left_x = point.x - (measure.width / 2) + (radius / 2);
    let right_x = point.x + (measure.width / 2) - (radius / 2);
    ctx.beginPath();
    ctx.moveTo(right_x, point.y - radius);
    ctx.arc(right_x, point.y, radius, - Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(left_x, point.y + radius);
    ctx.arc(left_x, point.y, radius, Math.PI / 2, Math.PI / 2 * 3, false);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = text_color;
  ctx.fillText(text, point.x - (measure.width / 2), point.y + radius / 3 * 2 - 1);

  ctx.restore();
};
// --------------------------------------------------------------------------------
Character.prototype.onDelete = function(){
  let polygon = SDUDocument.getCurrentPageElement(Polygon2D.TAG, this._polygon);
  if(polygon) polygon.character = '';
  let word = SDUDocument.getCurrentPageElement(Word.TAG, this._father);
  if(word) word.remove(this._id);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Character.prototype.getExportPoints = function(){
  let temp = [];
  let points = SDUDocument.getElement(Polygon2D.TAG, this._polygon).points;
  for(let i in points){
    let point = SDUDocument.getElement(Dot2D.TAG, points[i]);
    temp.push([point.x.toFixed(2), point.y.toFixed(2)]);
  }
  return temp;
}
// --------------------------------------------------------------------------------
Character.prototype.loadJson = function(json){
  this._id = json._id;
  this._page = json._page;
  this._char = json._char;
  this._remark = json._remark;
  this._father = json._father;
  this._polygon = json._polygon;
}
Character.prototype.saveJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _char: this._char,
    _remark: this._remark,
    _father: this._father,
    _polygon: this._polygon
  }
}
Character.prototype.exportJson = function(){
  return {
    id: this._id,
    page: this._page,
    father: this._father,
    string: this._char,
    remark: this._remark,
    points: this.getExportPoints()
  }
}
// ================================================================================

// ================================================================================
// * CharacterFactory
// --------------------------------------------------------------------------------
function CharacterFactory(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
CharacterFactory.makeObject = function(page, polygon, char, remark){
  return new Character(this.getNextIndex(), page, polygon, char, remark);
};
CharacterFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Character.TAG);
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool("character", "文字工具", "mdi-format-text-variant", Tool.Slot.PLUGIN, function(id){
  ToolManager.setCurrentPlugin(id);
  Engine.setTodo(LanguageManager.TOOL_CHARACTER);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("character.onLeftClick", "left_click", false, CharacterFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      let character_object = SDUDocument.getCurrentPageElement(Character.TAG, character);
      Engine.prompt("更改文字", ["要更改成的文字", "备注（可不填）"],
        [character_object.char, character_object.remark], function(){
        Engine.owner.prompt_dialog = false;
        if(Engine.owner.prompt_text[0]){
          character_object.char = Engine.owner.prompt_text[0];
          character_object.remark = Engine.owner.prompt_text[1] || "";
          Graphics.refresh();
        }
      })
    }else{
      Engine.prompt("输入文字", ["请输入该多边形包含的文字", "备注（可不填）"],
        [null, null], function(){
        Engine.owner.prompt_dialog = false;
        if(Engine.owner.prompt_text[0]){
          let character = CharacterFactory.makeObject(DocumentManager.getCurrentPageId(),
            collide_list[0], Engine.owner.prompt_text[0], Engine.owner.prompt_text[1] || "")
          SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character = character.id;
          DocumentManager.addElement(Character.TAG, character);
        }
      });
    }
  }
}));
ToolManager.addHandler(new Handler("character.onRightClick", "right_click", false, CharacterFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      DocumentManager.deleteElement(Character.TAG, character);
    }
  }
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("character.onMouseMove", "mousemove", false, CharacterFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("character.onMouseOut", "mouseout", false, CharacterFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("_character.normal", 20, CharacterFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let characters = SDUDocument.getCurrentPageElements(Character.TAG);
  for(let i in characters){
    characters[i].render(ctx);
  }
}));
RenderManager.addRenderer(new Renderer("character.doc.normal", 7, CharacterFactory, function(ctx){
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
RenderManager.addRenderer(new Renderer("character.polygon.collide", 6, CharacterFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
// ================================================================================
