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
//   2020/04/20 - Version 1.0.0
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
Paragraph.TAG = "Paragraph";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Paragraph.prototype._line_width = 0;
Paragraph.prototype._line_scale = 0;
Paragraph.prototype._color = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Paragraph.prototype.initialize = function(id, page){
  PolygonGroup.prototype.initialize.call(this);

  this._line_width = 2;
  this._line_scale = 7;
  this._color = 'rgba(255, 0, 0, 0.8)';

  this._id = id;
  this._pages = [page];
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Paragraph.prototype.setColor = function(color){
  this._color = color;
}
// --------------------------------------------------------------------------------
Paragraph.prototype.getObject = function(){
  return new Paragraph("", "");
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Paragraph.prototype.callFatherCalcPoints = function(){
  if(this._father){
    SDUDocument.getElement(Article.TAG, this._father).calcPoints();
  }
};
Paragraph.prototype.callFatherCalcPages = function(){
  if(this._father){
    SDUDocument.getElement(Article.TAG, this._father).calcPages();
  }
};
// --------------------------------------------------------------------------------
Paragraph.prototype.getMergePoints = function(){
  let points = {};
  for(let i = 0; i < this._pages.length; i++){
    points[this._pages[i]] = []
  }
  for(let i = 0; i < this._children.length; i++){
    let sentence = SDUDocument.getElement(Sentence.TAG, this._children[i]);
    if(sentence){
      for(let page in sentence.points){
        points[page] = points[page].concat(sentence.points[page]);
      }
    }
  }
  return points;
};
Paragraph.prototype.getMergePages = function(){
  let pages = [];
  for(let i = 0; i < this._children.length; i++){
    let sentence = SDUDocument.getElement(Sentence.TAG, this._children[i]);
    if(sentence){
      pages.push(sentence.pages)
    }
  }
  return pages;
};
// --------------------------------------------------------------------------------
Paragraph.prototype.render = function(ctx){
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
Paragraph.prototype.renderCollide = function(ctx){

};
// --------------------------------------------------------------------------------
Paragraph.prototype.onDelete = function(){

};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Paragraph.prototype.getExportString = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(SDUDocument.getElement(Sentence.TAG, this._children[i]).getExportString());
  }
  return str.join(' ');
}
Paragraph.prototype.getExportStringArray = function(){
  let str = [];
  for(let i = 0; i < this._children.length; i++){
    str.push(SDUDocument.getElement(Sentence.TAG, this._children[i]).getExportStringArray());
  }
  return str;
}
// --------------------------------------------------------------------------------
Paragraph.prototype.loadJson = function(json){
  this._id = json._id;
  this._pages = json._pages;
  this._children = json._children;
  this._father = json._father;
  this._points = json._points;
}
Paragraph.prototype.saveJson = function(){
  return {
    _id: this._id,
    _pages: this._pages,
    _children: this._children,
    _father: this._father,
    _points: this._points
  }
}
Paragraph.prototype.exportJson = function(){
  return {
    id: this._id,
    pages: this._pages,
    children: this._children,
    father: this._father,
    string: this.getExportStringArray(),
    points: this.getExportPoints()
  }
}
// ================================================================================

// ================================================================================
// * ParagraphFactory
// --------------------------------------------------------------------------------
function ParagraphFactory(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
ParagraphFactory.makeObject = function(page){
  return new Paragraph(this.getNextIndex(), page);
};
ParagraphFactory.getNextIndex = function(){
  return DocumentManager.getNextIndex(Paragraph.TAG);
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool("paragraph", "段落工具", "mdi-format-align-left", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
  Engine.setTodo(LanguageManager.TOOL_PARAGRAPH);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("paragraph.onLeftClick", "left_click", false, ParagraphFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      let word = SDUDocument.getCurrentPageElement(Character.TAG, character).father;
      if(word){
        let sentence = SDUDocument.getCurrentPageElement(Word.TAG, word).father;
        if(sentence){
          let sentence_object = SDUDocument.getCurrentPageElement(Sentence.TAG, sentence);
          if(sentence_object.father){
            SelectManager.selectId(sentence_object.father);
          }else{
            if(SelectManager.isType(Paragraph.TAG)){
              let paragraph_object = SDUDocument.getElement(Paragraph.TAG, SelectManager.getObject());
              paragraph_object.append(sentence_object);
              DocumentManager.push();
            }else{
              let paragraph_object = ParagraphFactory.makeObject(DocumentManager.getCurrentPageId());
              paragraph_object.append(sentence_object);
              DocumentManager.addElement(Paragraph.TAG, paragraph_object);
              SelectManager.selectId(paragraph_object.id);
              return;
            }
          }
        }
      }
    }
  }
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("paragraph.onRightClick", "right_click", false, ParagraphFactory, function(event){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let character = SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).character;
    if(character){
      let word = SDUDocument.getCurrentPageElement(Character.TAG, character).father;
      if(word){
        let sentence = SDUDocument.getCurrentPageElement(Word.TAG, word).father;
        if(sentence){
          let sentence_object = SDUDocument.getCurrentPageElement(Sentence.TAG, sentence);
          let paragraph = sentence_object.father;
          if(paragraph){
            if(!SelectManager.isType(Paragraph.TAG) || paragraph === SelectManager.getObject()){
              let paragraph_object = SDUDocument.getCurrentPageElement(Paragraph.TAG, paragraph);
              paragraph_object.remove(sentence_object);
              if(paragraph_object.isEmpty()){
                DocumentManager.deleteElement(Paragraph.TAG, paragraph);
                SelectManager.unSelect();
              }else{
                SelectManager.selectId(paragraph);
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
  SelectManager.unSelect();
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("paragraph.onMouseMove", "mousemove", false, ParagraphFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("paragraph.onMouseOut", "mouseout", false, ParagraphFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("paragraph.doc.normal", 7, ParagraphFactory, function(ctx){
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
RenderManager.addRenderer(new Renderer("paragraph.polygon.collide", 6, ParagraphFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    SDUDocument.getCurrentPageElement(Polygon2D.TAG, collide_list[0]).renderCollide(ctx);
  }
}));
// ================================================================================
