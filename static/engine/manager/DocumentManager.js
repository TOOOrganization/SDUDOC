// ================================================================================
// * DocumentManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/10 - Version 1.0.0
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
  this._page_array = new PageArray();
  this._header = new Header();
};
DocumentManager.clear = function(){
  this._filename = null;
  this._page_array = new PageArray();
  this._header = new Header();
  Graphics.clearImage();
};
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
DocumentManager.addAfterCurrentPage = async function(src){
  let page = ElementManager.makeElement(Page.TAG, src);
  ElementManager.addElement(Page.TAG, page);
  this._page_array.addAfterCurrentPage(page.id);
  await this.afterChangePage();
}
DocumentManager.removeCurrentPage = async function(){
  ElementManager.removeElement(Page.TAG, this.getCurrentPageId());
  this._page_array.removeCurrentPage();
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
DocumentManager.setCurrentPage = async function(index){
  this._page_array.setCurrentPage(index + 1);
  await this.afterChangePage();
}
// --------------------------------------------------------------------------------
DocumentManager.moveCurrentPageMinus = async function(){
  this._page_array.moveCurrentPageMinus();
  await this.afterChangePage();
}
DocumentManager.moveCurrentPagePlus = async function(){
  this._page_array.moveCurrentPagePlus();
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
  return (this._filename ? this._filename : "Untitled") + ".sjs";
};
DocumentManager.getExportFilename = function(){
  return (this._filename ? this._filename : "Untitled") + ".sdudoc";
};
// --------------------------------------------------------------------------------
DocumentManager.getElementManagerTopElementTag = function(){
  let top_tag = Character.TAG;
  let tags = [Word.TAG, Sentence.TAG, Paragraph.TAG, Article.TAG, Book.TAG];
  for(let i = 0; i < tags.length; i++){
    let elements = ElementManager.getElements(tags[i]);
    if (elements && Object.getOwnPropertyNames(elements).length > 0){
      top_tag = Word.TAG;
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
DocumentManager.loadJson = function(filename, json){
  this.clear();
  this._filename = filename.split('.');
  this._filename.pop();
  this._filename = this._filename.join('.');

  let json_object = JSON.parse(json);

  this._header.loadJson(json_object.Header);
  this._page_array.loadJson(json_object.PageList);
  ElementManager.loadJson(json_object.Element);
};
DocumentManager.saveJson = function(){
  let output = {};
  output.Header = this._header.saveJson();
  output.PageList = this._page_array.saveJson();
  output.Element = ElementManager.saveJson();
  return output;
};
DocumentManager.export = function(){
  let output = {};
  output.Header = this._header.exportJson();
  output.Document = this.getExportDocument();
  output.PageList = this._page_array.exportJson();
  output.Element = ElementManager.exportJson();
  return output;
};
// ================================================================================












/*
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
DocumentManager.addElement = function(type, element){
  SDUDocument.addElement(type, element);
  Graphics.refresh();
  this.push();
}
DocumentManager.deleteElement = function(type, id){
  SDUDocument.deleteElement(type, id);
  Graphics.refresh();
  this.push();
}
// --------------------------------------------------------------------------------
DocumentManager.extractGetElementById = function(id){
  this.extractGetElement(id.split(SDUDocument.SAPARATOR)[0], id);
}
DocumentManager.extractGetElement = function(type, id){
  let element = SDUDocument.getElement(type, id);
  this.extractElement(element);
}
DocumentManager.extractElement = function(element){
  let json = element.saveJson();
  let str = JSON.stringify(json);
  let id = json._id + '';
  str = str.substring(1, str.length - 1);
  str = str.split(',');
  str.shift();
  str = str.join(',');
  str = str.replaceAll(',\"_', '\n\"_');
  Engine.owner.check_id = id;
  Engine.owner.check_info = str;
}
DocumentManager.clearElement = function(){
  Engine.owner.check_id = null;
  Engine.owner.check_info = null;
}
DocumentManager.updateElement = function(){
  let id = Engine.owner.check_id;
  let info = Engine.owner.check_info;
  let str = info.replaceAll('\n\"_', ',\"_');
  str = '{\"_id\":\"' + id + '\",' + str + '}';
  let json = JSON.parse(str);
  SDUDocument.updateElement(id.split(SDUDocument.SAPARATOR)[0], id, json);
  Graphics.refresh();
  this.push();
}
// --------------------------------------------------------------------------------
DocumentManager.upLoadDoc = function(){
  // return new Promise((resolve) => {
  //   Engine._axios({
  //     method: 'post',
  //     url: 'http://211.87.232.197:8081/sdudoc/doc/insert_sdudoc',
  //     data: SDUDocument.exportJson(),
  //     headers: {
  //       'content-type': 'application/json',
  //       'Access-Control-Allow-Origin': 'http://211.87.232.197'
  //     },
  //     responseType: 'json'
  //   }).then(response => {
  //     console.log(response);
  //     resolve();
  //   }).catch(error => {
  //     console.log(error);
  //     resolve();
  //   });
  // });
}
// --------------------------------------------------------------------------------

DocumentManager.newWebPage = function(src, filename){
  // return new Promise((resolve) => {
  //   Engine._axios({
  //     method: 'post',
  //     url: 'http://211.87.232.197:8081/sdudoc/img/save_by_base64',
  //     data: {
  //       base64 : src,
  //       filename: filename
  //     },
  //     headers: {'content-type': "application/json"},
  //     responseType: 'json'
  //   }).then(response => {
  //     console.log(response);
  //     let src_link = 'http://211.87.232.197:8081/sdudoc/img/get_by_id?id=' + response.data;
  //     DocumentManager.newPage(src_link).then(r => {
  //       resolve();
  //     });
  //   }).catch(error => {
  //     console.log(error);
  //     resolve();
  //   });
  // });
}

// --------------------------------------------------------------------------------
DocumentManager.createModulePage = function(x, y, padding, polygon_callback){
  SDUDocument.clearPage(SDUDocument.getCurrentPage());
  let width = Graphics._image.width - padding.left - padding.right;
  let height = Graphics._image.height - padding.top - padding.bottom;
  let page = this.getCurrentPageId()
  let base_dots = [], base_lines = [];
  base_dots[0] = DotFactory.makeObject(page, Dot2D.Type.FREE, padding.left, padding.top);
  base_dots[1] = DotFactory.makeObject(page, Dot2D.Type.FREE, padding.left + width, padding.top);
  base_dots[2] = DotFactory.makeObject(page, Dot2D.Type.FREE, padding.left + width, padding.top + height);
  base_dots[3] = DotFactory.makeObject(page, Dot2D.Type.FREE, padding.left, padding.top + height);
  for(let i = 0; i < base_dots.length; i++){
    SDUDocument.addElement(Dot2D.TAG, base_dots[i], true);
    base_dots[i] = base_dots[i].id;
  }
  base_lines[0] = LineFactory.makeObject(page, base_dots[0], base_dots[1]);
  base_lines[1] = LineFactory.makeObject(page, base_dots[1], base_dots[2]);
  base_lines[2] = LineFactory.makeObject(page, base_dots[2], base_dots[3]);
  base_lines[3] = LineFactory.makeObject(page, base_dots[3], base_dots[0]);
  for(let i = 0; i < base_lines.length; i++){
    SDUDocument.addElement(Line2D.TAG, base_lines[i], true);
    base_lines[i] = base_lines[i].id;
  }
  let dependent_dots = [[],[],[],[]], dependent_lines = [[],[]];
  for(let i = 0; i < x - 1; i++){
    let dot1 = DotFactory.makeObject(page, Dot2D.Type.DEPENDENT, base_lines[0], (1 / x * (i + 1)));
    let dot2 = DotFactory.makeObject(page, Dot2D.Type.DEPENDENT, base_lines[2], 1 - (1 / x * (i + 1)));
    SDUDocument.addElement(Dot2D.TAG, dot1, true);
    SDUDocument.addElement(Dot2D.TAG, dot2, true);
    dependent_dots[0].push(dot1.id);
    dependent_dots[2].push(dot2.id);
    let line = LineFactory.makeObject(page, dot1.id, dot2.id);
    SDUDocument.addElement(Line2D.TAG, line, true);
    dependent_lines[0].push(line.id);
  }
  for(let i = 0; i < y - 1; i++){
    let dot1 = DotFactory.makeObject(page, Dot2D.Type.DEPENDENT, base_lines[1], (1 / y * (i + 1)));
    let dot2 = DotFactory.makeObject(page, Dot2D.Type.DEPENDENT, base_lines[3], 1 - (1 / y * (i + 1)));
    SDUDocument.addElement(Dot2D.TAG, dot1, true);
    SDUDocument.addElement(Dot2D.TAG, dot2, true);
    dependent_dots[1].push(dot1.id);
    dependent_dots[3].push(dot2.id);
    let line = LineFactory.makeObject(page, dot1.id, dot2.id);
    SDUDocument.addElement(Line2D.TAG, line, true);
    dependent_lines[1].push(line.id);
  }
  let intersection_dots = [];
  for(let i = 0; i < y - 1; i++){
    intersection_dots.push([]);
    for(let j = 0; j < x - 1; j++){
      let dot = DotFactory.makeObject(page, Dot2D.Type.INTERSECTION, dependent_lines[0][j], dependent_lines[1][i]);
      SDUDocument.addElement(Dot2D.TAG, dot, true);
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
      let polygon = PolygonFactory.makeObject(page, points);
      SDUDocument.addElement(Polygon2D.TAG, polygon, true);
      polygon_callback.call(this, polygon);
    }
  }
  SDUDocument.updateCurrentPageData();
  Graphics.refresh();
  this.push();
}
// --------------------------------------------------------------------------------
DocumentManager.generateDocumentByText = async function(img_width, img_height, char_horizontal, char_vertical, padding, text){
  this.newDocument();
  let canvas = document.createElement('canvas');
  canvas.width = img_width;
  canvas.height = img_height;
  let ctx = canvas.getContext("2d");
  let rect = new Rectangle(0, 0, img_width, img_height)
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
  let jump_index = 0;

  let newPage = async function(draw_text, start_index){
    rect.clear(ctx);
    rect.fillSelf(ctx, 'rgba(255, 255, 255, 1)');
    ctx.save();
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
            case '，': case ' ':
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
    await DocumentManager.newWebPage(data, String(Math.random()) + '.jpg')

    if(!book) book = BookFactory.makeObject(DocumentManager.getCurrentPageId());
    if(!article) article = ArticleFactory.makeObject(DocumentManager.getCurrentPageId());
    if(!paragraph) paragraph = ParagraphFactory.makeObject(DocumentManager.getCurrentPageId());
    if(!sentence) sentence = SentenceFactory.makeObject(DocumentManager.getCurrentPageId());
    if(!word) word = WordFactory.makeObject(DocumentManager.getCurrentPageId());

    let character_index = start_index;
    DocumentManager.createModulePage(char_horizontal, char_vertical, draw_padding, function(polygon){
      if(jump_index > 0){
        //SDUDocument.deleteElement(Polygon2D.TAG, polygon.id);
      }
      if(character_index < text.length){
        let char = text.charAt(character_index);
        switch (char){
          case ' ':
            SDUDocument.addElement(Word.TAG, word, true);
            sentence.append(word);
            word = WordFactory.makeObject(DocumentManager.getCurrentPageId());
            character_index ++;
            break;
          case '，':
            SDUDocument.addElement(Word.TAG, word, true);
            sentence.append(word);
            word = WordFactory.makeObject(DocumentManager.getCurrentPageId());
            SDUDocument.addElement(Sentence.TAG, sentence, true);
            paragraph.append(sentence);
            sentence = SentenceFactory.makeObject(DocumentManager.getCurrentPageId());
            character_index ++;
            break;
          case '\\':
            if(text.charAt(character_index + 1) === 'n'){
              if(text.charAt(character_index + 2) === '\\' && text.charAt(character_index + 3) === 'n'){
                SDUDocument.addElement(Word.TAG, word, true);
                sentence.append(word);
                word = WordFactory.makeObject(DocumentManager.getCurrentPageId());
                SDUDocument.addElement(Sentence.TAG, sentence, true);
                paragraph.append(sentence);
                sentence = SentenceFactory.makeObject(DocumentManager.getCurrentPageId());
                SDUDocument.addElement(Paragraph.TAG, paragraph, true);
                article.append(paragraph);
                paragraph = ParagraphFactory.makeObject(DocumentManager.getCurrentPageId());
                SDUDocument.addElement(Article.TAG, article, true);
                book.append(article);
                article = ArticleFactory.makeObject(DocumentManager.getCurrentPageId());
                character_index += 4;
                break;
              }else{
                SDUDocument.addElement(Word.TAG, word, true);
                sentence.append(word);
                word = WordFactory.makeObject(DocumentManager.getCurrentPageId());
                SDUDocument.addElement(Sentence.TAG, sentence, true);
                paragraph.append(sentence);
                sentence = SentenceFactory.makeObject(DocumentManager.getCurrentPageId());
                SDUDocument.addElement(Paragraph.TAG, paragraph, true);
                article.append(paragraph);
                paragraph = ParagraphFactory.makeObject(DocumentManager.getCurrentPageId());
                character_index += 2;
                break;
              }
            }
            break;
        }
        if(character_index < text.length) {
          let char = text.charAt(character_index);
          let character = CharacterFactory.makeObject(DocumentManager.getCurrentPageId(),
            polygon.id, char);
          polygon.character = character.id;
          SDUDocument.addElement(Character.TAG, character, true);
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

  SDUDocument.addElement(Word.TAG, word, true);
  sentence.append(word);
  SDUDocument.addElement(Sentence.TAG, sentence, true);
  paragraph.append(sentence);
  SDUDocument.addElement(Paragraph.TAG, paragraph, true);
  article.append(paragraph);
  SDUDocument.addElement(Article.TAG, article, true);
  book.append(article);
  SDUDocument.addElement(Book.TAG, book, true);

  this.push();
}

// --------------------------------------------------------------------------------
DocumentManager.getNextIndex = function(key){
  return SDUDocument.getNextIndex(key);
}

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
  let list = xml.split("  ");
  if(list.length === 0) return;
  list[0] = list[0].substring(1, list[0].length);
  list[list.length - 1] = list[list.length - 1].substring(0, list[list.length - 1].length - 2);
  let object = this.cloneObject(window[list.shift()].get());
  for(let i in list){
    let data = list[i].split("=");
    switch(data[1]){
      case "false":
        object[data[0]] = false;
        break;
      case "true":
        object[data[0]] = true;
        break;
      default:
        if(data[1].charAt(0) === "\""){
          object[data[0]] = data[1].substring(1, data[1].length - 1)
        }else{
          object[data[0]] = Number(data[1]);
        }
    }
  }
  return object;
}
DocumentManager.objectToXml = function(obj){
  let string_builder = "";
  string_builder += "<" + obj.__proto__.constructor.name;
  for(let i in obj){
    switch(typeof obj[i]){
      case "string":
        string_builder += "  " + i + "=\"" + obj[i] + "\"";
        break;
      case "number": case "boolean":
        string_builder += "  " + i + "=" + obj[i];
        break;
    }
  }
  string_builder += "/>";
  return string_builder;
}
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
DocumentManager.clearHistory = function(){
  this._history = []
  this._now_history = 0;
}
DocumentManager.push = function(){
  this._history.splice(++ this._now_history, this._history.length - this._now_history);
  this._history.push([SDUDocument.saveJson(), SDUDocument.getCurrentPage()]);
  if(this._history.length >= this.MAX_HISTORY){
    this._history.shift();
  }
  this._now_history = this._history.length - 1;
  SDUDocument.updateCurrentPageData();
}
DocumentManager.undo = async function(){
  if(this._now_history > 0){
    let index = -- this._now_history;
    await SDUDocument.loadJson(this._history[index][0]);
    await SDUDocument.setCurrentPage(this._history[index][1]);
    this.updateList();
  }
}
DocumentManager.redo = async function(){
  if(this._now_history < this._history.length - 1){
    let index = ++ this._now_history;
    await SDUDocument.loadJson(this._history[index][0]);
    await SDUDocument.setCurrentPage(this._history[index][1]);
    this.updateList();
  }
}
// ================================================================================
*/
