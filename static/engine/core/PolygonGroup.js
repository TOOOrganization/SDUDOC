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
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
PolygonGroup.prototype._polygons = [];
PolygonGroup.prototype._points = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
PolygonGroup.prototype.initialize = function(){
  this._polygons = [];
  this._points = [];
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(PolygonGroup.prototype, 'polygons', {
  get: function() {
    return this._polygons;
  },
  set: function(value) {
    this._polygons = value;
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
PolygonGroup.prototype.append = function(id){
  this._polygons.push(id);
  this._points = this.calcPoints();
};
PolygonGroup.prototype.remove = function(id){
  this._polygons.splice(this._polygons.indexOf(id), 1);
  this._points = this.calcPoints();
};
// --------------------------------------------------------------------------------
PolygonGroup.prototype.isLine = function(dot1, dot2, points){
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
    if(this.isLine(a, b, points_2)){
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
      polygons.push([i]);
      visited[i] = true;
      queue.push(i);
      while(queue.length !== 0) {
        let target = queue.shift();
        for (let j = 0; j < map[i].length; j++) {
          if (map[i][j] && !visited[j]) {
            polygons[polygons.length - 1].push(j);
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
PolygonGroup.prototype.merge = function(){
  let polygon_map = [];
  for(let i = 0; i < this._points.length; i++) {
    polygon_map.push(new Array(this._points.length));
  }
  for(let i = 0; i < polygon_map.length; i++) {
    for (let j = 0; j < polygon_map[i].length; j++) {
      polygon_map[i][j] = false;
    }
  }
  for(let i = 0; i < this._points.length; i++) {
    for (let j = i + 1; j < this._points.length; j++) {
      if (this.hasCommonLine(this._points[i], this._points[j])){
        polygon_map[i][j] = true;
        polygon_map[j][i] = true;
      }
    }
  }
  let polygon_group = this.getGroupBFS(polygon_map);
  let points_group = [];
  for(let i = 0; i < polygon_group.length; i++){

  }

};
PolygonGroup.prototype.calcPoints = function(){
  this._points = [];
  for(let i = 0; i < this._polygons.length; i++){
    this._points.push(this._polygons[i].points);
  }
  this.merge();
};
// --------------------------------------------------------------------------------
PolygonGroup.prototype.fillCanvas = function(ctx, color){
  for(let i = 0; i < this._points.length; i++){
    let points = [];
    for(let j = 0; j < this._points[i].length; j++){
      points[j] = Graphics.getRenderPoint(this._points[i][j]);
    }
    this.fill(ctx, color, new Polygon(points));
  }
};
PolygonGroup.prototype.strokeCanvas = function(ctx, lineWidth, color) {
  for(let i = 0; i < this._points.length; i++){
    let points = [];
    for(let j = 0; j < this._points[i].length; j++){
      points[j] = Graphics.getRenderPoint(this._points[i][j]);
    }
    this.stroke(ctx, lineWidth, color, new Polygon(points));
  }
}
PolygonGroup.prototype.fillSelf = function(ctx, color){
  for(let i = 0; i < this._points.length; i++){
    this.fill(ctx, color, new Polygon(this._points[i]));
  }
};
PolygonGroup.prototype.strokeSelf = function(ctx, lineWidth, color) {
  for(let i = 0; i < this._points.length; i++){
    this.stroke(ctx, lineWidth, color, new Polygon(this._points[i]));
  }
};
PolygonGroup.prototype.fill = function(ctx, color, polygon){
  let points = polygon.points;

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for(let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
PolygonGroup.prototype.stroke = function(ctx, lineWidth, color, polygon){
  let points = polygon.points;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for(let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};
// ================================================================================
