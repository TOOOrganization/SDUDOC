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
//   2020/03/19 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Polygon2D
// ================================================================================
function Word(){
  this.initialize.apply(this, arguments);
}
Word.prototype = Object.create(Point.prototype);
Word.prototype.constructor = Word;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Word.prototype._id = "";
Word.prototype._page = "";
Word.prototype._word = "";
// --------------------------------------------------------------------------------
Word.prototype._polygon = "";
// --------------------------------------------------------------------------------
Word.prototype._background_color = '';
Word.prototype._text_color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Word.prototype.initialize = function(id, page, x, y, polygon, word){
  Point.prototype.initialize.call(this, x, y);

  this._color = 'rgba(0, 0, 255, 0.3)';
  this._collide_color = 'rgba(255, 0, 0, 0.3)';

  this._id = id;
  this._page = page;

  this._polygon = polygon;
  this._word = word;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Word.prototype, 'id', {
  get: function() {
    return this._id;
  },
  configurable: true
});
Object.defineProperty(Word.prototype, 'page', {
  get: function() {
    return this._page;
  },
  configurable: true
});
Object.defineProperty(Word.prototype, 'polygon', {
  get: function() {
    return this._polygon;
  },
  configurable: true
});
Object.defineProperty(Word.prototype, 'word', {
  get: function() {
    return this._word;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
Word.prototype.setColor = function(background_color, text_color){
  this._background_color = background_color;
  this._text_color = text_color;
}
// --------------------------------------------------------------------------------
Word.prototype.getObject = function(){
  return new Word("", "", 0, 0, "", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Word.prototype.checkCollide = function(point){
  return SDUDocument.data["Polygon2D"][this._polygon].checkCollide(point);
};
// --------------------------------------------------------------------------------
Word.prototype.render = function(ctx){
  this.fillCanvas(ctx, 8, 'rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 1)');
};
Word.prototype.renderCollide = function(ctx){

};
// --------------------------------------------------------------------------------
Word.prototype.fillCanvas = function(ctx, radius, background_color, text_color){
  this.fill(ctx, radius, background_color, text_color, Graphics.getRenderPoint(this), this._word);
};
Word.prototype.fill = function(ctx, radius, background_color, text_color, point, text){
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
Word.prototype.onDelete = function(){

};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Word.prototype.getExportPoints = function(){
  let temp = [];
  let points = SDUDocument.data["Polygon2D"][this._polygon].points;
  for(let i in points){
    let point = SDUDocument.data["Dot2D"][points[i]];
    temp.push([point.x, point.y]);
  }
  return temp;
}
// --------------------------------------------------------------------------------
Word.prototype.loadJson = function(json){
  this._id = json._id;
  this._page = json._page;
  this._x = json._x;
  this._y = json._y;
  this._word = json._word;
  this._polygon = json._polygon;
}
Word.prototype.saveJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _x: this._x,
    _y: this._y,
    _word: this._word,
    _polygon: this._polygon
  }
}
Word.prototype.exportJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _x: this._x,
    _y: this._y,
    _word: this._word,
    _points: this.getExportPoints()
  }
}
// ================================================================================

// ================================================================================
// * WordFactory
// ================================================================================
function WordFactory(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
WordFactory.makeObject = function(page, x, y, polygon, word){
  return new Word(this.getNextIndex(), page, x, y, polygon, word);
};
WordFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex("Word");
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// ================================================================================
ToolManager.addTool(new Tool("word", "文字工具", "mdi-format-text-variant", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("word.onLeftClick", "left_click", false, WordFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Polygon2D", 1);
  if(collide_list.length > 0){
    let point = Graphics.getGridPoint(new Point(event.layerX, event.layerY));
    Engine.prompt("输入文字", ["请输入该多边形包含的文字"], [null], function(){
      Engine.owner.prompt_dialog = false;
      DocumentManager.addElement("Word", WordFactory.makeObject(DocumentManager.getCurrentPageId(),
        point.x, point.y, collide_list[0], Engine.owner.prompt_text[0]));
    })
  }
}));
ToolManager.addHandler(new Handler("word.onRightClick", "right_click", false, WordFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("word.onMouseMove", "mousemove", false, WordFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("word.onMouseOut", "mouseout", false, WordFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("_word.normal", 20, PolygonFactory, function(ctx){
  if(SDUDocument.getCurrentPage() <= 0) return;
  let current_page = DocumentManager.getCurrentPageId();
  for(let i in SDUDocument.data["Word"]){
    if(SDUDocument.data["Word"][i].page === current_page){
      SDUDocument.data["Word"][i].render(ctx);
    }
  }
}));
RenderManager.addRenderer(new Renderer("word.polygon.collide", 6, WordFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Polygon2D", 1);
  for(let i in SDUDocument.data["Polygon2D"]){
    if(collide_list.indexOf(i) !== -1){
      SDUDocument.data["Polygon2D"][i].renderCollide(ctx);
    }
  }
}));
// ================================================================================
