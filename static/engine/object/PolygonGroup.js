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
//   2020/04/20 - Version 1.0.0
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
PolygonGroup.prototype.calcPoints = function(){
  this._points = {}
  let points_list = this.getMergePoints()
  for(let i = 0; i < this._pages.length; i++){
    this._points[this._pages[i]] = this.mergePoints(points_list[this._pages[i]])
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
PolygonGroup.prototype.isLineInPolygon = function(dot1, dot2, points){
  let a = points.indexOf(dot1);
  let b = points.indexOf(dot2);
  if(a < 0 || b < 0) return false;
  if((a === 0 && b === points.length - 1) || (a === points.length - 1 && b === 0)) return true;
  return Math.abs(a - b) === 1;
}
PolygonGroup.prototype.hasCommonLine = function(points_1, points_2){
  let a, b;
  for(let i = 0; i < points_1.length; i++){
    if (i === points_1.length - 1) {
      a = i; b = 0;
    }else{
      a = i; b = i + 1;
    }
    if(this.isLineInPolygon(points_1[a], points_1[b], points_2)){
      return true;
    }
  }
  return false;
}
PolygonGroup.prototype.getGroupBFS = function(map){
  let visited = new Array(map.length);
  for(let i = 0; i < visited.length; i++) {
    visited[i] = false;
  }
  let queue = [];
  let polygons = [];
  for(let i = 0; i < visited.length; i++){
    if(!visited[i]){
      polygons.push([]);
      queue.push(i);
      visited[i] = true;
      while(queue.length !== 0) {
        let target = queue.shift();
        polygons[polygons.length - 1].push(target);
        for (let j = 0; j < map[target].length; j++) {
          if (map[target][j] && !visited[j]) {
            queue.push(j);
            visited[j] = true;
          }
        }
      }
    }
  }
  return polygons;
}
PolygonGroup.prototype.mergePolygon = function(polygon_1, polygon_2){
  let common_dots = [];
  let start_dot = null;
  for(let i = 0; i < polygon_1.length; i++) {
    if(polygon_2.indexOf(polygon_1[i]) !== -1){
      common_dots.push(polygon_1[i]);
    }else{
      start_dot = polygon_1[i];
    }
  }
  let polygon = [start_dot];
  let index = polygon_1.indexOf(start_dot);
  let now = 1;
  let scan = 1;
  let target;
  while(true){
    index += scan;
    if(now === 1) {
      if(index < 0) index = polygon_1.length - 1;
      if(index > polygon_1.length - 1) index = 0;
      target = polygon_1[index];
      if(target === start_dot) break;
      if(common_dots.indexOf(target) === -1){
        polygon.push(target);
      }else{
        polygon.push(target);
        now = 2;
        index = polygon_2.indexOf(target);
        scan = common_dots.indexOf(polygon_2[((index + 1) % polygon_2.length)]) === -1 ? 1 : -1;
      }
    }else if(now === 2) {
      if(index < 0) index = polygon_2.length - 1;
      if(index > polygon_2.length - 1) index = 0;
      target = polygon_2[index];
      if(target === start_dot) break;
      if(common_dots.indexOf(target) === -1){
        polygon.push(target);
      }else{
        polygon.push(target);
        now = 1;
        index = polygon_1.indexOf(target);
        scan = common_dots.indexOf(polygon_1[((index + 1) % polygon_1.length)]) === -1 ? 1 : -1;
      }
    }
  }
  return polygon;
}
PolygonGroup.prototype.mergePoints = function(points){
  let polygon_map = [];
  for(let i = 0; i < points.length; i++) {
    polygon_map.push(new Array(points.length));
  }
  for(let i = 0; i < polygon_map.length; i++) {
    for (let j = 0; j < polygon_map[i].length; j++) {
      polygon_map[i][j] = false;
    }
  }
  for(let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (this.hasCommonLine(points[i], points[j])){
        polygon_map[i][j] = true;
        polygon_map[j][i] = true;
      }
    }
  }
  let polygon_group = this.getGroupBFS(polygon_map);
  let points_group = [];
  for(let i = 0; i < polygon_group.length; i++){
    points_group.push(points[polygon_group[i].splice(0, 1)]);
    while(polygon_group[i].length > 0){
      for(let j = 0; j < polygon_group[i].length; j++){
        if(this.hasCommonLine(points_group[i], points[polygon_group[i][j]])){
          points_group[i] = this.mergePolygon(points_group[i], points[polygon_group[i].splice(j, 1)]);
          break;
        }
      }
    }
  }
  return points_group;
};
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
        let point = SDUDocument.getElement(Dot2D.TAG, this._points[key][i][j]);
        temp[key][temp[key].length - 1].push([point.x.toFixed(2), point.y.toFixed(2)]);
      }
    }
  }
  let output = [];
  for(let i = 0; i < this._pages.length; i++){
    let points_list = temp[this._pages[i]];
    let string = "" + this._pages[i];
    for(let j = 0; j < points_list.length; j++){
      string += "|";
      for(let k = 0; k < points_list[j].length; k++) {
        string += points_list[j][k][0] + ":" + points_list[j][k][1] + ";";
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
}
PolygonGroup.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._children = this._children;
  output._father   = this._father;
  output._points   = this._points;
  return output;
}
PolygonGroup.prototype.exportJson = function(){
  let output = Element.prototype.exportJson.call(this);
  output.children     = this._children;
  output.father       = this._father;
  output.points       = this.getExportPoints();
  output.string       = this.getExportString();
  output.string_array = this.getExportStringArray();
  return output;
}
// ================================================================================
