
/*
Input.addHandler(new Handler("Input.onMouseDown1", "key_down", "M", Engine, function(event){
  console.log('key_down')
}.bind(Engine)));
Input.addHandler(new Handler("Input.onMouseDown2", "key_up", "M", Engine, function(event){
  console.log('key_up')
}.bind(Engine)));
Input.addHandler(new Handler("Input.onMouseDown3", "key_long_hold", "M", Engine, function(event){
  console.log('key_long_hold')
}.bind(Engine)));
Input.addHandler(new Handler("Input.onMouseDown4", "key_hold", "M", Engine, function(event){
  console.log('key_hold')
}.bind(Engine)));
Input.addHandler(new Handler("Input.onMouseDown5", "key_click", "M", Engine, function(event){
  console.log('key_click')
}.bind(Engine)));
*/

// ToolManager.addTool(new Tool("cut", "剪切工具", "mdi-scissors-cutting", Tool.Type.PLUGIN, "", function(){
//
// }));
// ToolManager.addTool(new Tool("comment", "注释工具", "mdi-tooltip-plus-outline", Tool.Type.PLUGIN, "", function(){
//
// }));

/*
switch(this._type) {
    case Dot2D.Type.FREE: {
      Point.prototype.fillCanvas.call(this, ctx, this._radius - 2, this._color);
      Point.prototype.strokeCanvas.call(this, ctx, this._radius - 2, this._stroke_width / 2, this._stroke_color);
      break;
    }
    case Dot2D.Type.DEPENDENT: {
      let line = SDUDocument.data["Line2D"][this._father];
      let point = LineFactory.getDependentPoint(line, this._position);
      Point.prototype.fillCanvas.call(point, ctx, this._radius - 2, this._color);
      Point.prototype.strokeCanvas.call(point, ctx, this._radius - 2, this._stroke_width / 2, this._stroke_color);
      break;
    }
    case Dot2D.Type.INTERSECTION: {
      let point = LineFactory.getIntersection(this._father1, this._father2);
      Point.prototype.fillSelf.call(point, ctx, this._radius - 2, this._color);
      Point.prototype.strokeSelf.call(point, ctx, this._radius - 2, this._stroke_width / 2, this._stroke_color);
      break;
    }
  }

if (end.x - start.x == 0) {
    data[0] = new Point(start.x + radius, start.y);
    data[1] = new Point(start.x - radius, start.y);
    data[3] = new Point(end.x + radius, end.y);
    data[2] = new Point(end.x - radius, end.y);
  } else {
    let angle = Math.atan((start.y - end.y) / (start.x - end.x));
    let dx = radius * Math.cos(angle);
    let dy = radius * Math.sin(angle);

    data[0] = new Point((start.x + dx), (start.y - dy));
    data[1] = new Point((start.x - dx), (start.y + dy));
    data[3] = new Point((end.x + dx), (end.y - dy));
    data[2] = new Point((end.x - dx), (end.y + dy));
  }

Line.prototype.getDrawPolygon = function(radius, start, end){
  let r = start.distance(end);
  let dx = end.x - start.x;
  let dy = end.y - start.y;
  let sx = dy * radius / r;
  let sy = dx * radius / r;
  let data = [];
  data.push(new Point(start.x - sx, start.y - sy));
  data.push(new Point(start.x + sx, start.y + sy));
  data.push(new Point(end.x + sx, end.y + sy));
  data.push(new Point(end.x - sx, end.y - sy));
  return new Polygon(data);
};

Line.prototype.getDrawPolygon = function(radius, line){
  let start = SDUDocument.data["Dot2D"][line.start];
  let end = SDUDocument.data["Dot2D"][line.end];

  let r = start.distance(end);
  let dx = end.x - start.x;
  let dy = end.y - start.y;
  let sx = dy * radius / r;
  let sy = dx * radius / r;
  let data = [];
  data.push(new Point(start.x - sx, start.y - sy));
  data.push(new Point(start.x + sx, start.y + sy));
  data.push(new Point(end.x + sx, end.y + sy));
  data.push(new Point(end.x - sx, end.y - sy));
  return data;
};
Line.prototype.getCanvasPolygon = function(width, line){
  let data = this.getDrawPolygon(width, line);
  for(let i in data){
    data[i] = Graphics.getRenderPoint(data[i]);
  }
  return new Polygon(data);
};
Line.prototype.getSelfPolygon = function(width, line){
  return new Polygon(this.getDrawPolygon(width, line));
};
// --------------------------------------------------------------------------------
Line.prototype.fillCanvas = function(ctx, radius, color){
  console.log(this.getSelfPolygon(radius, this))
  this.getSelfPolygon(radius, this).fillCanvas(ctx, color);
};
Line.prototype.strokeCanvas = function(ctx, radius, lineWidth, color) {
  this.getSelfPolygon(radius, this).strokeCanvas(ctx, lineWidth, color);
}
Line.prototype.fillSelf = function(ctx, radius, color){
  this.getSelfPolygon(radius, this).fillSelf(ctx, color);
};
Line.prototype.strokeSelf = function(ctx, radius, lineWidth, color) {
  this.getSelfPolygon(radius, this).strokeSelf(ctx, lineWidth, color);
}
// ================================================================================
*/
