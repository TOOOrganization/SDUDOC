// ================================================================================
// * Polygon <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/12 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Polygon
// --------------------------------------------------------------------------------
function Polygon(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Polygon.prototype._points = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Polygon.prototype.initialize = function(points){
  this._points = points;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Polygon.prototype, 'points', {
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
Polygon.prototype.append = function(point){
  this._points.push(point);
};
// --------------------------------------------------------------------------------
Polygon.prototype.isPointInSelf = function(point){
  let check = function(start, end, point){
    let middle = (start.y + end.y) / 2;
    let distance = Math.abs(start.y - end.y) / 2;
    return Math.abs(point.y - middle) < distance;
  }
  let points = [];
  for(let i = 0; i < this._points.length; i++){
    points[i] = this._points[i];
  }
  points = points.concat(points[0]);
  if (points.length <= 3) return -1;
  let count = 0, a = 0, b = 0, c = 0;
  for (let i = 0; i < points.length - 1 ; i++) {
    a = points[i].y - points[i + 1].y;
    b = points[i].x - points[i + 1].x;
    c = points[i].x * points[i + 1].y - points[i + 1].x * points[i].y;
    if (a === 0 || (b * point.y - c) / a >= point.x){
      if(check(points[i], points[i + 1], point)){
        count ++;
      }
    }
  }
  return count % 2 - 1;
};
// --------------------------------------------------------------------------------
Polygon.prototype.getScaledPolygon = function(scale){
  let norm = function(vector){ return Math.sqrt(vector.x * vector.x + vector.y * vector.y); }
  let unit = function(vector){ return vector.division(norm(vector)); }
  let dot = function(vector1, vector2){ return vector1.x * vector2.x + vector1.y * vector2.y; }
  let cos = function(vector1, vector2){ return dot(vector2, vector1) / (norm(vector1) * norm(vector2)); }
  let vertical = function(vector){ return new Point(-vector.y, vector.x); }
  let cross = function(vector1, vector2){ return vector1.x * vector2.y - vector1.y * vector2.x; }
  let points = []
  for (let i = 0; i < this._points.length; i++){
    points.push(this._points[i]);
  }
  points.push(this._points[0]);
  points.unshift(this._points[this._points.length - 1]);
  let new_points = []
  for (let i = 1; i < points.length - 1; i++) {
    let vector1 = unit(points[i - 1].minus(points[i]));
    let vector2 = unit(points[i + 1].minus(points[i]));
    let cos1 = cos(vector1, vector2);
    let point1, point2;
    if (cos1 > 0.99) {

    } else if (cos1 < -0.99){

    } else {
      let vector = unit(vector1.add(vector2))
      let vector_vert = vertical(vector1)
      let cos2 = cos(vector, vector_vert)
      let len = scale / cos2
      point1 = points[i].add(vector.multiply(len));
      point2 = points[i].add(vector.multiply(-len));
      new_points.push(this.isPointInSelf(point2) ? point1 : point2);
    }
  }
  return new Polygon(new_points)
};
// --------------------------------------------------------------------------------
Polygon.prototype.getRenderArray = function(){
  let output = [];
  for(let i = 0; i < this._points.length; i++){
    output.push(this._points[i].x);
    output.push(this._points[i].y);
  }
  return output;
};
// ================================================================================
