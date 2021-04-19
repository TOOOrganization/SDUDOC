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
//   2020/03/19 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Polygon2D
// ================================================================================
function Character(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Character.prototype._id = "";
Character.prototype._page = "";
Character.prototype._character = "";
// --------------------------------------------------------------------------------
Character.prototype._polygon = "";
// --------------------------------------------------------------------------------
Character.prototype._background_color = '';
Character.prototype._text_color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Character.prototype.initialize = function(id, page, polygon, character){

  this._color = 'rgba(0, 0, 255, 0.3)';
  this._collide_color = 'rgba(255, 0, 0, 0.3)';

  this._id = id;
  this._page = page;

  this._polygon = polygon;
  this._character = character;
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
Object.defineProperty(Character.prototype, 'character', {
  get: function() {
    return this._character;
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
  return new Character("", "", 0, 0, "", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Character.prototype.checkCollide = function(point){
  return SDUDocument.getCurrentPageElement("Polygon2D", this._polygon).checkCollide(point);
};
// --------------------------------------------------------------------------------
Character.prototype.render = function(ctx){
  this.fillCanvas(ctx, 8, 'rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 1)');
};
Character.prototype.renderCollide = function(ctx){

};
// --------------------------------------------------------------------------------
Character.prototype.fillCanvas = function(ctx, radius, background_color, text_color){
  let polygon = SDUDocument.getCurrentPageElement("Polygon2D", this._polygon);
  this.fill(ctx, radius, background_color, text_color, Graphics.getRenderPoint(polygon.getCorePoint()), this._character);
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

};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Character.prototype.getExportPoints = function(){
  let temp = [];
  let points = SDUDocument.getElement("Polygon2D", this._polygon).points;
  for(let i in points){
    let point = SDUDocument.getElement("Dot2D", points[i]);
    temp.push([point.x, point.y]);
  }
  return temp;
}
// --------------------------------------------------------------------------------
Character.prototype.loadJson = function(json){
  this._id = json._id;
  this._page = json._page;
  this._character = json._character;
  this._polygon = json._polygon;
}
Character.prototype.saveJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _character: this._character,
    _polygon: this._polygon
  }
}
Character.prototype.exportJson = function(){
  return {
    _id: this._id,
    _page: this._page,
    _character: this._character,
    _points: this.getExportPoints()
  }
}
// ================================================================================

// ================================================================================
// * CharacterFactory
// ================================================================================
function CharacterFactory(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
CharacterFactory.makeObject = function(page, polygon, character){
  return new Character(this.getNextIndex(), page, polygon, character);
};
CharacterFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex("Character");
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// ================================================================================
ToolManager.addTool(new Tool("character", "文字工具", "mdi-format-text-variant", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("character.onLeftClick", "left_click", false, CharacterFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Polygon2D", 1);
  if(collide_list.length > 0){
    let point = Graphics.getGridPoint(new Point(event.layerX, event.layerY));
    Engine.prompt("输入文字", ["请输入该多边形包含的文字"], [null], function(){
      Engine.owner.prompt_dialog = false;
      DocumentManager.addElement("Character", CharacterFactory.makeObject(DocumentManager.getCurrentPageId(),
        collide_list[0], Engine.owner.prompt_text[0]));
    })
  }
}));
ToolManager.addHandler(new Handler("character.onRightClick", "right_click", false, CharacterFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("character.onMouseMove", "mousemove", false, CharacterFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("character.onMouseOut", "mouseout", false, CharacterFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("_character.normal", 20, PolygonFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let characters = SDUDocument.getCurrentPageElements("Character");
  for(let i in characters){
    characters[i].render(ctx);
  }
}));
RenderManager.addRenderer(new Renderer("character.polygon.collide", 6, CharacterFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Polygon2D", 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement("Polygon2D", collide_list[0]).renderCollide(ctx);
  }
}));
// ================================================================================
