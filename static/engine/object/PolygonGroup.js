// ================================================================================
// * PolygonGroup <SDUDOC Engine Plugin>
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
// * PolygonGroup
// --------------------------------------------------------------------------------
function PolygonGroup() {
  this.initialize.apply(this, arguments);
}
PolygonGroup.prototype = Object.create(Element.prototype);
PolygonGroup.prototype.constructor = PolygonGroup;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
PolygonGroup.prototype._father = '';
PolygonGroup.prototype._children = [];
PolygonGroup.prototype._points = {};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
PolygonGroup.prototype.initialize = function(id, pages){
  Element.prototype.initialize.call(this, id, pages);
  this._children = [];
  this._father = '';
  this._points = {};
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(PolygonGroup.prototype, 'children', {
  get: function() {
    return this._children;
  },
  set: function(value) {
    this._children = value;
  },
  configurable: true
});
Object.defineProperty(PolygonGroup.prototype, 'father', {
  get: function() {
    return this._father;
  },
  set: function(value) {
    this._father = value;
  },
  configurable: true
});
Object.defineProperty(PolygonGroup.prototype, 'points', {
  get: function() {
    return this._points;
  },
  set: function(value) {
    this._points = value;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Get Base Object
// --------------------------------------------------------------------------------
PolygonGroup.prototype.getPolyGonList = function(){
  let output = [];
  let point_list = this._points[DocumentManager.getCurrentPageId()];
  if(!point_list) return output;
  for(let i = 0; i < point_list.length; i++){
    let points = [];
    for(let j = 0; j < point_list[i].length; j++){
      points[j] = ElementManager.getFilteredElement(Dot2D.TAG, point_list[i][j]).getPoint();
    }
    output.push(new Polygon(points));
  }
  return output;
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
PolygonGroup.prototype.newElement = function(){
  return new PolygonGroup('', []);
};
// --------------------------------------------------------------------------------
// * Add
// --------------------------------------------------------------------------------
PolygonGroup.prototype.onAwake = function(){
  Element.prototype.onAwake.call(this);
};
// --------------------------------------------------------------------------------
// * Update
// --------------------------------------------------------------------------------
PolygonGroup.prototype.onUpdate = function(){
  Element.prototype.onUpdate.call(this);
};
// --------------------------------------------------------------------------------
// * Remove
// --------------------------------------------------------------------------------
PolygonGroup.prototype.onRemove = function(){
  Element.prototype.onRemove.call(this);
};
// --------------------------------------------------------------------------------
// * Collide
// --------------------------------------------------------------------------------
PolygonGroup.prototype.checkCollide = function(point){
  return -1;
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
PolygonGroup.prototype.append = function(obj){
  this._children.push(obj.id);
  obj.father = this._id;
  this.calcPages();
  this.calcPoints();
};
PolygonGroup.prototype.remove = function(obj){
  this._children.splice(this._children.indexOf(obj.id), 1);
  obj.father = '';
  this.calcPages();
  this.calcPoints();
};
PolygonGroup.prototype.isEmpty = function(){
  return this._children.length === 0;
};
// --------------------------------------------------------------------------------
// * Polygon Group
// --------------------------------------------------------------------------------
PolygonGroup.prototype.calcPoints = function(){
  this._points = {}
  let points_list = this.getMergePoints();
  for(let i = 0; i < this._pages.length; i++){
    this._points[this._pages[i]] = this.mergePoints(points_list[this._pages[i]]);
  }
  this.callFatherCalcPoints();
};
PolygonGroup.prototype.callFatherCalcPoints = function(){

};
// --------------------------------------------------------------------------------
PolygonGroup.prototype.calcPages = function(){
  this._pages = this.mergePages(this.getMergePages());
  this.callFatherCalcPages();
};
PolygonGroup.prototype.callFatherCalcPages = function(){

};
// --------------------------------------------------------------------------------
// * Merge
// --------------------------------------------------------------------------------
PolygonGroup.prototype.mergePoints = function(points){
  let point_list = [];
  let point_map = [];
  // Get point list.
  for(let i = 0; i < points.length; i++){
    for(let j = 0; j < points[i].length; j++){
      if(point_list.indexOf(points[i][j]) < 0){
        point_list.push(points[i][j]);
      }
    }
  }
  // Generate point map.
  for(let i = 0; i < point_list.length; i++){
    point_map.push([]);
    for(let j = 0; j < point_list.length; j++){
      point_map[i].push(0);
    }
  }
  // When point a & b connecting, map[a][b] + 1
  for(let i = 0; i < points.length; i++){
    for(let j = 0; j < points[i].length; j++){
      let a, b;
      if(j === points[i].length - 1){
        a = point_list.indexOf(points[i][0]);
        b = point_list.indexOf(points[i][j]);
      }else{
        a = point_list.indexOf(points[i][j]);
        b = point_list.indexOf(points[i][j + 1]);
      }
      point_map[a][b] ++;
      point_map[b][a] ++;
    }
  }
  // Delete map[a][b] which > 0, now we get point map with polygons.
  for(let i = 0; i < point_map.length; i++){
    for(let j = 0; j < point_map[i].length; j++){
      if(point_map[i][j] > 1){
        point_map[i][j] = 0;
      }
    }
  }
  // Delete point which no connection.
  let point_length = point_list.length;
  for(let i = 0; i < point_map.length; i++){
    let size = 0;
    for(let j = 0; j < point_map[i].length; j++){
      size += point_map[i][j];
    }
    if (size === 0) {
      point_list[i] = null;
      point_length -= 1;
    }
  }
  // Get polygons
  let polygons = [];
  let pointer = 0;
  let temp_pointer = 0;
  let changed = true;
  while(point_length > 0){
    changed = true;
    polygons.push([]);
    while (pointer < point_list.length && !point_list[pointer]){
      pointer ++;
    }
    temp_pointer = pointer;
    while(changed){
      changed = false;
      for(let i = 0; i < point_map[temp_pointer].length; i++){
        if(point_map[temp_pointer][i] === 1){
          polygons[polygons.length - 1].push(point_list[temp_pointer]);
          point_list[temp_pointer] = null;
          point_map[temp_pointer][i] = 0;
          point_map[i][temp_pointer] = 0;
          point_length --;
          temp_pointer = i;
          changed = true;
          break;
        }
      }
    }
  }
  return polygons;
}
PolygonGroup.prototype.getMergePoints = function(){
  return [];
};
// --------------------------------------------------------------------------------
PolygonGroup.prototype.mergePages = function(pages){
  let page_list = []
  for(let i = 0; i < pages.length; i++) {
    for (let j = 0; j < pages[i].length; j++) {
      if (page_list.indexOf(pages[i][j]) === -1){
        page_list.push(pages[i][j])
      }
    }
  }
  return page_list;
};
PolygonGroup.prototype.getMergePages = function(){
  return [];
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
PolygonGroup.prototype.getExportPoints = function(){
  let temp = {}
  for(let key in this.points){
    temp[key] = []
    for(let i = 0; i < this.points[key].length; i++){
      temp[key].push([]);
      for(let j = 0; j < this.points[key][i].length; j++){
        let point = ElementManager.getElement(Dot2D.TAG, this._points[key][i][j]);
        temp[key][temp[key].length - 1].push([point.x.toFixed(2), point.y.toFixed(2)]);
      }
    }
  }
  let output = [];
  for(let i = 0; i < this._pages.length; i++){
    let points_list = temp[this._pages[i]];
    let string = '' + this._pages[i];
    for(let j = 0; j < points_list.length; j++){
      string += '|';
      for(let k = 0; k < points_list[j].length; k++) {
        string += points_list[j][k][0] + ':' + points_list[j][k][1] + ';';
      }
      string = string.substring(0, string.length - 1);
    }
    output.push(string);
  }
  return output;
};
PolygonGroup.prototype.getExportString = function(){
  return '';
};
PolygonGroup.prototype.getExportStringArray = function(){
  return [];
};
// --------------------------------------------------------------------------------
PolygonGroup.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._children = json_object._children === undefined ? this._children : json_object._children;
  this._father   = json_object._father   === undefined ? this._father   : json_object._father;
  this._points   = json_object._points   === undefined ? this._points   : json_object._points;
};
PolygonGroup.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._children = this._children;
  output._father   = this._father;
  output._points   = this._points;
  return output;
};
PolygonGroup.prototype.exportJson = function(){
  let output = Element.prototype.exportJson.call(this);
  output.children     = this._children;
  output.father       = this._father;
  output.points       = this.getExportPoints();
  output.string       = this.getExportString();
  output.string_array = this.getExportStringArray();
  return output;
};
// ================================================================================
