// ================================================================================
// * DocumentManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * DocumentManager
// --------------------------------------------------------------------------------
function DocumentManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
DocumentManager._filename = null;
DocumentManager._page_array = null;
DocumentManager._header = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
DocumentManager.initialize = function(){
  this._filename = null;
  this.clearData();
};
DocumentManager.clear = function(){
  this._filename = null;
  this.clearData();
  Graphics.clearImage();
};
DocumentManager.clearData = function(){
  this._page_array = new PageArray();
  this._header = new Header();
  ElementManager.clear();
  SelectManager.clear();
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(DocumentManager, 'header', {
  get: function() {
    return this._header;
  },
  configurable: true
});
Object.defineProperty(DocumentManager, 'page_array', {
  get: function() {
    return this._page_array;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Document
// --------------------------------------------------------------------------------
DocumentManager.new = function(){
  this.newDocument();
};
DocumentManager.newDocument = function(){
  this.clear();
  this.updatePageData();
}
// --------------------------------------------------------------------------------
// * Header
// --------------------------------------------------------------------------------
DocumentManager.getHeaderTooltip = function(){
  return this._header.getTextArray()
}
DocumentManager.getHeaderData = function(){
  return this._header.getDataArray()
}
DocumentManager.setHeaderData = function(data){
  this._header.setDataArray(data)
}
// --------------------------------------------------------------------------------
// * Element
// --------------------------------------------------------------------------------
DocumentManager.addElement = function(type, element){
  ElementManager.addElement(type, element);
};
DocumentManager.removeElement = function(type, id){
  ElementManager.removeElement(type, id);
};
DocumentManager.updateElement = function(type, id, data){
  SelectManager.updateElement(type, id, data);
};
// --------------------------------------------------------------------------------
DocumentManager.addElementWithUpdate = function(type, element){
  this.addElement(type, element);
  this.afterChangeElement();
};
DocumentManager.removeElementWithUpdate = function(type, id){
  this.removeElement(type, id);
  this.afterChangeElement();
};
DocumentManager.updateElementWithUpdate = function(type, id, data){
  this.updateElement(type, id, data);
  this.afterChangeElement();
};
// --------------------------------------------------------------------------------
DocumentManager.afterChangeElement = function(){
  this.updateFilteredData();
  Graphics.refresh();
};
// --------------------------------------------------------------------------------
// * Page
// --------------------------------------------------------------------------------
DocumentManager.updatePageData = function(){
  Engine.updateEditorPageData();
}
DocumentManager.updateFilteredData = function(){
  ElementManager.updateFilteredDict(this.getCurrentPageId());
}
// --------------------------------------------------------------------------------
DocumentManager.getPageList = function(){
  let pages = ElementManager.getElements(Page.TAG);
  let order = this._page_array.page_list;
  let data = [];
  for(let i = 0;i < order.length; i++){
    data.push({
      id: i + 1,
      src: pages[order[i]].src
    });
  }
  return data;
}
// --------------------------------------------------------------------------------
DocumentManager.addAfterPage = async function(index, page_object){
  this.addElement(Page.TAG, page_object);
  this._page_array.addAfterCurrentPage(page_object.id);
  await this.afterChangePage();
}
DocumentManager.clearPage = function(index){
  let page = ElementManager.getElement(Page.TAG, this._page_array.getPageId(index));
  page.onRemove.call(page);
  this.afterChangeElement();
}
DocumentManager.removePage = async function(page_id){
  this._page_array.removePage(page_id);
  this.removeElement(Page.TAG, page_id);
  await this.afterChangePage();
}
// --------------------------------------------------------------------------------
DocumentManager.addAfterCurrentPage = async function(filename, src){
  let request_src = await HttpRequest.uploadWebPage(filename, src);
  if(!request_src) return;
  let page = ElementManager.makeElement(Page.TAG, request_src);
  this.addElement(Page.TAG, page);
  this._page_array.addAfterCurrentPage(page.id);
  await this.afterChangePage();
  Engine.progress(100);
}
DocumentManager.clearCurrentPage = function(){
  let page = this.getCurrentPageObject();
  page.onRemove.call(page);
  this.afterChangeElement();
}
DocumentManager.removeCurrentPage = async function(){
  let page = this._page_array.removeCurrentPage();
  this.removeElement(Page.TAG, page);
  await this.afterChangePage();
}
// --------------------------------------------------------------------------------
DocumentManager.getCurrentPage = function(){
  return this._page_array.getCurrentPage();
}
DocumentManager.getCurrentPageId = function(){
  return this._page_array.getCurrentPageId();
}
DocumentManager.getCurrentPageObject = function(){
  return ElementManager.getElement(Page.TAG, this.getCurrentPageId());
}
// --------------------------------------------------------------------------------
DocumentManager.setCurrentPageIndex = async function(index){
  await this.setCurrentPage(index + 1);
}
DocumentManager.setCurrentPage = async function(index){
  this._page_array.setCurrentPage(index);
  await this.afterChangePage();
}
// --------------------------------------------------------------------------------
DocumentManager.moveCurrentPageForward = async function(){
  this._page_array.moveCurrentPageForward();
  await this.afterChangePage();
}
DocumentManager.moveCurrentPageBackward = async function(){
  this._page_array.moveCurrentPageBackward();
  await this.afterChangePage();
}
DocumentManager.moveCurrentPageTo = async function(target){
  this._page_array.moveCurrentPageTo(target);
  await this.afterChangePage();
}
// --------------------------------------------------------------------------------
DocumentManager.afterChangePage = async function(){
  this.updateFilteredData();
  let page_object = this.getCurrentPageObject();
  if(page_object){
    await Graphics.setImage(page_object.src);
    this.getCurrentPageObject().setSize(Graphics.image.width, Graphics.image.height)
  }else{
    Graphics.clearImage();
  }
  this.updatePageData();
}
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
DocumentManager.getSaveFilename = function(){
  return (this._filename ? this._filename : 'Untitled') + '.sjs';
};
DocumentManager.getExportFilename = function(){
  return (this._filename ? this._filename : 'Untitled') + '.sdudoc';
};
// --------------------------------------------------------------------------------
DocumentManager.getElementManagerTopElementTag = function(){
  let top_tag = Character.TAG;
  let tags = [Word.TAG, Sentence.TAG, Paragraph.TAG, Article.TAG, Book.TAG];
  for(let i = 0; i < tags.length; i++){
    let elements = ElementManager.getElements(tags[i]);
    if (elements && Object.getOwnPropertyNames(elements).length > 0){
      top_tag = tags[i];
    }
  }
  return top_tag;
};
DocumentManager.getExportDocument = function(){
  let output = []

  let top_tag = this.getElementManagerTopElementTag();
  if (top_tag === Character.TAG) {
    return output;
  }

  let elements = ElementManager.getElements(top_tag);
  for (let key in elements){
    output.push(elements[key].getExportString());
  }
  return output;
};
// --------------------------------------------------------------------------------
DocumentManager.load = async function(filename, json){
  this.clear();
  this._filename = filename.split('.');
  this._filename.pop();
  this._filename = this._filename.join('.');

  let json_object = JSON.parse(json);
  this.loadJson(json_object);
  await this.afterChangePage();
};
DocumentManager.save = function(){
  return JSON.stringify(this.saveJson());
};
DocumentManager.export = function(){
  return JSON.stringify(this.exportJson());
};
DocumentManager.exportOldVersion = function(){
  return JSON.stringify(this.exportOldVersionJson());
};
// --------------------------------------------------------------------------------
DocumentManager.loadJson = function(json_object){
  this.clearData();
  this._header.loadJson(json_object.Header);
  this._page_array.loadJson(json_object.PageList);
  ElementManager.loadJson(json_object.Elements);
};
DocumentManager.saveJson = function(){
  let output = {};
  output.Header = this._header.saveJson();
  output.PageList = this._page_array.saveJson();
  output.Elements = ElementManager.saveJson();
  return output;
};
DocumentManager.exportJson = function(){
  let output = {};
  output.Header = this._header.exportJson();
  output.Document = this.getExportDocument();
  output.PageList = this._page_array.exportJson();
  output.Elements = ElementManager.exportJson();
  return output;
};
DocumentManager.exportOldVersionJson = function(){
  let page_list = this._page_array.exportJson();
  let elements = ElementManager.exportJson();
  let pages = [];
  for(let i = 0; i < page_list.length; i++){
    for(let j = 0;j < elements[Page.TAG].length; j++){
      if(elements[Page.TAG][j].id === page_list[i]){
        pages.push(elements[Page.TAG][j]);
        break;
      }
    }
  }
  let output = {};
  output.Header = this._header.exportJson();
  output.Document = this.getExportDocument();
  output[Page.TAG] = pages;
  for(let key in elements){
    if(key !== Page.TAG){
      for (let i = 0; i < elements[key].length; i++) {
        if(elements[key][i].string_array){
          elements[key][i].string = elements[key][i].string_array;
          delete elements[key][i].string_array;
        }
      }
      output[key] = elements[key];
    }
  }
  if(output[Character.TAG]){
    for(let i = 0;i < output[Character.TAG].length; i++){
      output[Character.TAG][i].page = output[Character.TAG][i].pages[0];
      delete output[Character.TAG][i].pages;
    }
  }
  return output;
};
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
DocumentManager.createModulePage = async function(x, y, padding, polygon_callback){
  if(this.getCurrentPage() <= 0) return;
  this.clearCurrentPage();
  let width = Graphics._image.width - padding.left - padding.right;
  let height = Graphics._image.height - padding.top - padding.bottom;
  let pages = [this.getCurrentPageId()];
  let base_dots = [], base_lines = [];
  base_dots[0] = ElementManager.makeElement(Dot2D.TAG, pages, Dot2D.Type.FREE, padding.left, padding.top);
  base_dots[1] = ElementManager.makeElement(Dot2D.TAG, pages, Dot2D.Type.FREE, padding.left + width, padding.top);
  base_dots[2] = ElementManager.makeElement(Dot2D.TAG, pages, Dot2D.Type.FREE, padding.left + width, padding.top + height);
  base_dots[3] = ElementManager.makeElement(Dot2D.TAG, pages, Dot2D.Type.FREE, padding.left, padding.top + height);
  for(let i = 0; i < base_dots.length; i++){
    this.addElement(Dot2D.TAG, base_dots[i]);
    base_dots[i] = base_dots[i].id;
  }
  base_lines[0] = ElementManager.makeElement(Line2D.TAG, pages, base_dots[0], base_dots[1]);
  base_lines[1] = ElementManager.makeElement(Line2D.TAG, pages, base_dots[1], base_dots[2]);
  base_lines[2] = ElementManager.makeElement(Line2D.TAG, pages, base_dots[2], base_dots[3]);
  base_lines[3] = ElementManager.makeElement(Line2D.TAG, pages, base_dots[3], base_dots[0]);
  for(let i = 0; i < base_lines.length; i++){
    this.addElement(Line2D.TAG, base_lines[i]);
    base_lines[i] = base_lines[i].id;
  }
  let dependent_dots = [[],[],[],[]], dependent_lines = [[],[]];
  for(let i = 0; i < x - 1; i++){
    let dot1 = ElementManager.makeElement(Dot2D.TAG, pages, Dot2D.Type.DEPENDENT, base_lines[0], (1 / x * (i + 1)));
    let dot2 = ElementManager.makeElement(Dot2D.TAG, pages, Dot2D.Type.DEPENDENT, base_lines[2], 1 - (1 / x * (i + 1)));
    this.addElement(Dot2D.TAG, dot1);
    this.addElement(Dot2D.TAG, dot2);
    dependent_dots[0].push(dot1.id);
    dependent_dots[2].push(dot2.id);
    let line = ElementManager.makeElement(Line2D.TAG, pages, dot1.id, dot2.id);
    this.addElement(Line2D.TAG, line);
    dependent_lines[0].push(line.id);
  }
  for(let i = 0; i < y - 1; i++){
    let dot1 = ElementManager.makeElement(Dot2D.TAG, pages, Dot2D.Type.DEPENDENT, base_lines[1], (1 / y * (i + 1)));
    let dot2 = ElementManager.makeElement(Dot2D.TAG, pages, Dot2D.Type.DEPENDENT, base_lines[3], 1 - (1 / y * (i + 1)));
    this.addElement(Dot2D.TAG, dot1);
    this.addElement(Dot2D.TAG, dot2);
    dependent_dots[1].push(dot1.id);
    dependent_dots[3].push(dot2.id);
    let line = ElementManager.makeElement(Line2D.TAG, pages, dot1.id, dot2.id);
    this.addElement(Line2D.TAG, line);
    dependent_lines[1].push(line.id);
  }
  let intersection_dots = [];
  for(let i = 0; i < y - 1; i++){
    intersection_dots.push([]);
    for(let j = 0; j < x - 1; j++){
      let dot = ElementManager.makeElement(Dot2D.TAG, pages, Dot2D.Type.INTERSECTION, dependent_lines[0][j], dependent_lines[1][i]);
      this.addElement(Dot2D.TAG, dot);
      intersection_dots[i].push(dot.id);
    }
  }
  let dot_map = [];
  dot_map.push([base_dots[0]].concat(dependent_dots[0]).concat([base_dots[1]]));
  for(let i = 0; i < y - 1; i++){
    dot_map.push([dependent_dots[3][i]].concat(intersection_dots[i]).concat([dependent_dots[1][i]]));
  }
  dot_map.push([base_dots[3]].concat(dependent_dots[2]).concat([base_dots[2]]));
  for(let i = x - 1; i >= 0; i--){
    for(let j = 0; j < y; j++){
      let points = [dot_map[j][i], dot_map[j][i + 1], dot_map[j + 1][i + 1], dot_map[j + 1][i]];
      let polygon = ElementManager.makeElement(Polygon2D.TAG, pages, points);
      this.addElement(Polygon2D.TAG, polygon);
      if(polygon_callback) await polygon_callback.call(this, polygon);
    }
  }
  this.afterChangeElement();
}
// --------------------------------------------------------------------------------
DocumentManager.generateDocumentByText = async function(img_width, img_height, char_horizontal, char_vertical, padding, text){
  this.newDocument();
  let canvas = document.createElement('canvas');
  canvas.width = img_width;
  canvas.height = img_height;
  let ctx = canvas.getContext('2d');
  let rect = new Rectangle(0, 0, img_width, img_height);
  let max_width = img_width - padding.left - padding.right;
  let max_height = img_height - padding.top - padding.bottom;
  let max_char_width = Math.floor(max_width / char_horizontal);
  let max_char_height = Math.floor(max_height / char_vertical);
  let char_size = Math.min(max_char_width, max_char_height);
  let width = char_size * char_horizontal;
  let height = char_size * char_vertical;
  let x = (img_width - width) / 2;
  let y = (img_height - height) / 2;
  let draw_padding = {'left': x, 'right':x, 'top':y, 'bottom':y};

  let book, article, paragraph, sentence, word;

  let newPage = async function(draw_text, start_index){
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height, );
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    for(let i = 0; i <= char_horizontal; i++){
      let draw_x = x + (i * char_size);
      ctx.fillRect(draw_x - 2, y, 4, height);
    }
    ctx.fillRect(x, y - 2, width, 4);
    ctx.fillRect(x, y + height - 2, width, 4);
    ctx.font = (char_size * 0.9) + 'px 楷体';
    ctx.textBaseline = 'middle';
    let place = start_index;
    for(let i = char_horizontal - 1; i >= 0; i--){
      for(let j = 0; j < char_vertical; j++){
        let char_x = x + (i * char_size);
        let char_y = y + (j * char_size);
        if(place < draw_text.length){
          let char = text.charAt(place);
          switch (char){
            case '，': case '。': case '？': case '！': case ' ':
              place ++;
              j--;
              break;
            case '\\':
              if(text.charAt(place + 1) === 'n'){
                if(text.charAt(place + 2) === '\\' && text.charAt(place + 3) === 'n'){
                  place += 4;
                  j--;
                  break;
                }else{
                  place += 2;
                  j--;
                  break;
                }
              }
            default:
              let width = ctx.measureText(char).width;
              let draw_x = char_x + (char_size - width) / 2;
              let draw_y = char_y + (0.5 * char_size);
              ctx.fillText(char, draw_x, draw_y);
              place ++;
          }
        }
      }
    }
    ctx.restore();

    let data = canvas.toDataURL('image/jpeg');
    await DocumentManager.addAfterCurrentPage(data, String(Math.random()) + '.jpg')

    if(!book) book = ElementManager.makeElement(Book.TAG, [DocumentManager.getCurrentPageId()]);
    if(!article) article = ElementManager.makeElement(Article.TAG, [DocumentManager.getCurrentPageId()]);
    if(!paragraph) paragraph = ElementManager.makeElement(Paragraph.TAG, [DocumentManager.getCurrentPageId()]);
    if(!sentence) sentence = ElementManager.makeElement(Sentence.TAG, [DocumentManager.getCurrentPageId()]);
    if(!word) word = ElementManager.makeElement(Word.TAG, [DocumentManager.getCurrentPageId()]);

    let character_index = start_index;
    await DocumentManager.createModulePage(char_horizontal, char_vertical, draw_padding, async function(polygon){
      if(character_index < text.length){
        let char = text.charAt(character_index);
        switch (char){
          case ' ':
            DocumentManager.addElement(Word.TAG, word);
            sentence.append(word);
            word = ElementManager.makeElement(Word.TAG, [DocumentManager.getCurrentPageId()]);
            character_index ++;
            break;
          case '，': case '。': case '？': case '！':
            DocumentManager.addElement(Word.TAG, word);
            sentence.append(word);
            word = ElementManager.makeElement(Word.TAG, [DocumentManager.getCurrentPageId()]);
            DocumentManager.addElement(Sentence.TAG, sentence);
            paragraph.append(sentence);
            sentence = ElementManager.makeElement(Sentence.TAG, [DocumentManager.getCurrentPageId()]);
            character_index ++;
            break;
          case '\\':
            if(text.charAt(character_index + 1) === 'n'){
              DocumentManager.addElement(Word.TAG, word);
              sentence.append(word);
              word = ElementManager.makeElement(Word.TAG, [DocumentManager.getCurrentPageId()]);
              DocumentManager.addElement(Sentence.TAG, sentence);
              paragraph.append(sentence);
              sentence = ElementManager.makeElement(Sentence.TAG, [DocumentManager.getCurrentPageId()]);
              DocumentManager.addElement(Paragraph.TAG, paragraph);
              article.append(paragraph);
              paragraph = ElementManager.makeElement(Paragraph.TAG, [DocumentManager.getCurrentPageId()]);
              if(text.charAt(character_index + 2) === '\\' && text.charAt(character_index + 3) === 'n'){
                DocumentManager.addElement(Article.TAG, article);
                book.append(article);
                article = ElementManager.makeElement(Article.TAG, [DocumentManager.getCurrentPageId()]);
                character_index += 4;
                break;
              }else{
                character_index += 2;
                break;
              }
            }
            break;
        }
        if(character_index < text.length) {
          char = text.charAt(character_index);
          let character = ElementManager.makeElement(Character.TAG, [DocumentManager.getCurrentPageId()], polygon.id, char, '');
          polygon.character = character.id;
          DocumentManager.addElement(Character.TAG, character);
          word.append(character);
          character_index ++;
        }
      }
    });
    return place;
  }
  let current_place = 0;
  while(current_place < text.length){
    current_place = await newPage(text, current_place);
  }

  DocumentManager.addElement(Word.TAG, word);
  sentence.append(word);
  DocumentManager.addElement(Sentence.TAG, sentence);
  paragraph.append(sentence);
  DocumentManager.addElement(Paragraph.TAG, paragraph);
  article.append(paragraph);
  DocumentManager.addElement(Article.TAG, article);
  book.append(article);
  DocumentManager.addElementWithUpdate(Book.TAG, book);
}
// ================================================================================

// ================================================================================
// * Unused
// --------------------------------------------------------------------------------
DocumentManager.cloneObject = function (obj) {
  if(obj === null) return null
  if(typeof obj !== 'object') return obj;
  if(obj.constructor === Date) return new Date(obj);
  let newObj = new obj.constructor();
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let val = obj[key];
      newObj[key] = typeof val === 'object' ? arguments.callee(val) : val;
    }
  }
  return newObj;
};
DocumentManager.xmlToObject = function(xml){
  if(!xml) return;
  let list = xml.split('  ');
  if(list.length === 0) return;
  list[0] = list[0].substring(1, list[0].length);
  list[list.length - 1] = list[list.length - 1].substring(0, list[list.length - 1].length - 2);
  let object = this.cloneObject(window[list.shift()].get());
  for(let i in list){
    let data = list[i].split('=');
    switch(data[1]){
      case 'false':
        object[data[0]] = false;
        break;
      case 'true':
        object[data[0]] = true;
        break;
      default:
        if(data[1].charAt(0) === '\''){
          object[data[0]] = data[1].substring(1, data[1].length - 1)
        }else{
          object[data[0]] = Number(data[1]);
        }
    }
  }
  return object;
}
DocumentManager.objectToXml = function(obj){
  let string_builder = '';
  string_builder += '<' + obj.__proto__.constructor.name;
  for(let i in obj){
    switch(typeof obj[i]){
      case 'string':
        string_builder += '  ' + i + '=\'' + obj[i] + '\'';
        break;
      case 'number': case 'boolean':
        string_builder += '  ' + i + '=' + obj[i];
        break;
    }
  }
  string_builder += '/>';
  return string_builder;
}
// ================================================================================
