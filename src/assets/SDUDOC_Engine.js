// ================================================================================
// * SDUDOC_Engine
// --------------------------------------------------------------------------------
//   Core functions of SDUDOC, designed by Lagomoro<Yongrui Wang> from SDU.
//   Please abide by the MIT license.
//   Last Update: 2020/03/10 - Version 1.0.0
// ================================================================================

// ================================================================================
// * Rectangle
// ================================================================================
function Rectangle(){
  this.initialize.apply(this, arguments);
}
Rectangle.prototype.initialize = function(x, y ,width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
};
Rectangle.prototype.clearRect = function(ctx){
  ctx.clearRect(this.x, this.y, this.width, this.height);
};
Rectangle.prototype.fillRect = function(ctx, color){
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
  ctx.restore();
};
Rectangle.prototype.strokeRect = function(ctx, lineWidth, color){
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(this.x, this.y, this.width, this.height);
  ctx.restore();
};
Rectangle.prototype.drawImage = function(ctx, image){
  ctx.drawImage(image, this.x, this.y, this.width, this.height);
};
// ================================================================================

// ================================================================================
// * Point2D
// ================================================================================
function Point2D(){
  this.initialize.apply(this, arguments);
}

Point2D.prototype.x = 0;
Point2D.prototype.y = 0;
Point2D.prototype.father = [];
Point2D.prototype.relative = 0;

Point2D.prototype.initialize = function(x, y){
  this.x = x;
  this.y = y;
};
Point2D.prototype.setFather = function(father, relative = 0){
  this.father = father;
  this.relative = relative;
};
Point2D.prototype.distance2D = function(point){
  return new Point2D(point.x - this.x, point.y - this.y);
};
Point2D.prototype.distance = function(point){
  let distance2D = this.distance2D(point);
  return Math.sqrt(Math.pow(distance2D.x, 2) + Math.pow(distance2D.y, 2));
};
Point2D.prototype.add = function(point){
  return new Point2D(this.x + point.x, this.y + point.y);
};
Point2D.prototype.multiply = function(num){
  return new Point2D(this.x * num, this.y * num);
};
Point2D.prototype.division = function(num){
  return new Point2D(this.x / num, this.y / num);
};
Point2D.prototype.fill = function(ctx, grid, radius, lineWidth, color, strokeColor){
  let point = grid.getDrawPoint(this);

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius,0,360, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
};
Point2D.prototype.stroke = function(ctx, grid, radius, lineWidth, color){
  ctx.fillStyle = color;
  ctx.arc(this.x, this.y, this.width, this.height);
  context.save();
  context.strokeStyle = forecolor;
  context.lineWidth = 8;
  context.lineCap = "round";
  var radius = center_x - context.lineWidth;
  context.beginPath();
  context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
  context.stroke();
  context.closePath();
  context.restore();
};
// ================================================================================

// ================================================================================
// * Line2D
// ================================================================================
function Line2D(){
  this.initialize.apply(this, arguments);
}

Line2D.prototype.start = null;
Line2D.prototype.end = null;

Line2D.prototype.initialize = function(start, end){
  this.start = start;
  this.end = end;
};
// ================================================================================

// ================================================================================
// * Polygon
// ================================================================================
function Polygon2D(){
  this.initialize.apply(this, arguments);
}
Polygon2D.prototype.initialize = function(points){
  this.points = points;
};
// ================================================================================

// ================================================================================
// * Grid
// ================================================================================
function Grid(){
  this.initialize.apply(this, arguments);
}

Grid.PER_UNIT_LENGTH = 12.5;
Grid.DRAW_LIMIT = 100;

Grid.prototype.engine = null;

Grid.prototype.initialize = function(){

};
Grid.prototype.setEngine = function(engine){
  this.engine = engine;
}
Grid.prototype.getPoint = function(point){
  let draw_distance = this.engine.origin.distance2D(point);
  return draw_distance.division(this.engine.scale);
}
Grid.prototype.getDrawPoint = function(point){
  let draw_distance = point.multiply(this.engine.scale);
  return draw_distance.add(this.engine.origin);
}
Grid.prototype.draw = function(ctx){
  let scaled_unit = Grid.PER_UNIT_LENGTH * this.engine.scale;
  let draw_unit = 0;
  let unit_scale = 1;
  if(scaled_unit < Grid.DRAW_LIMIT) {
    for(let i = scaled_unit; i < Grid.DRAW_LIMIT; i *= 2){
      draw_unit = i;
      unit_scale *= 2;
    }
  }else{
    for(let i = scaled_unit; i > Grid.DRAW_LIMIT / 2; i /= 2){
      draw_unit = i;
      unit_scale /= 2;
    }
  }
  let draw_start_x = this.engine.origin.x / draw_unit;
  let draw_start_y = this.engine.origin.y / draw_unit;
  let draw_origin_x = Math.floor(draw_start_x);
  let draw_origin_y = Math.floor(draw_start_y);

  let cw = this.engine.canvas_rect.width;
  let ch = this.engine.canvas_rect.height;

  ctx.fontSize = "10px";
  for(let i = draw_start_x - draw_origin_x; i <= cw / draw_unit; i ++){
    ctx.fillStyle = 'rgba(0, 0, 0, ' + ((Math.floor(i) - draw_origin_x) % 2 === 0 ? 1 : (draw_unit / 10 - 5)) +')';
    ctx.fillRect(i * draw_unit - 0.5, 0, 1, ch);
    let point = Math.round((Math.floor(i) - draw_origin_x) * Grid.PER_UNIT_LENGTH * unit_scale);
    ctx.fillText(point / 2, i * draw_unit - ctx.measureText(String(point / 2)).width - 3, draw_start_y * draw_unit + 12);
  }
  for(let i = draw_start_y - draw_origin_y; i <= ch / draw_unit; i ++){
    ctx.fillStyle = 'rgba(0, 0, 0, ' + ((Math.floor(i) - draw_origin_y) % 2 === 0 ? 1 : (draw_unit / 10 - 5)) +')';
    ctx.fillRect(0, i * draw_unit - 0.5, cw, 1);
    let point = Math.round((Math.floor(i) - draw_origin_y) * Grid.PER_UNIT_LENGTH * unit_scale);
    ctx.fillText(point / 2, draw_start_x * draw_unit + 4, i * draw_unit - 4);
  }
};
// ================================================================================

// ================================================================================
// * Input
//    Listener For Engine.
// ================================================================================
function Input(){
  throw new Error('This is a static class');
}

Input.engine = null;
Input.target = null;
Input.mousedown = false;
Input.mouseplace = new Point2D(0, 0);

Input.setEngine = function(engine){
  Input.engine = engine;
};
Input.setTarget = function(target){
  if(Input.target){
    Input.target.removeEventListener('mousedown', Input.onMouseDown);
    Input.target.removeEventListener('mouseup', Input.onMouseUp);
    Input.target.removeEventListener('mousemove', Input.onMouseMove);
    Input.target.removeEventListener('mousewheel', Input.onMouseWheel);
  }
  Input.target = target;
  Input.target.addEventListener('mousedown', Input.onMouseDown);
  Input.target.addEventListener('mouseup', Input.onMouseUp);
  Input.target.addEventListener('mousemove', Input.onMouseMove);
  Input.target.addEventListener('mousewheel', Input.onMouseWheel);
};
Input.onMouseDown = function(event){
  Input.mousedown = true;
  Input.mouseplace = new Point2D(event.layerX, event.layerY);
  let place = Input.engine.grid.getPoint(Input.mouseplace);
  Input.engine.doc_data.addPoint(place.x, place.y);
};
Input.onMouseUp = function(event){
  Input.mousedown = false;
};
Input.onMouseMove = function(event){
  if(Input.mousedown) {
    let temp = new Point2D(event.layerX, event.layerY);
    let distance = Input.mouseplace.distance2D(temp);
    Input.mouseplace = temp;
    Input.engine.moveOrigin(distance.x, distance.y);
  }
};
Input.onMouseWheel = function(event){
  Input.engine.multiScale(1 - event.deltaY / 1200);
};
// ================================================================================

// ================================================================================
// * DocData
// ================================================================================
function DocData(){
  this.initialize.apply(this, arguments);
}

DocData.prototype.data = null;
DocData.prototype.point_size = 0;
DocData.prototype.line_size = 0;

DocData.prototype.initialize = function(){
  this.clear();
};
DocData.prototype.clear = function(){
  this.data = { points : {}, lines : {} };
  this.point_size = 0;
  this.line_size = 0;
};
DocData.prototype.generatePointIndex = function(){
  return String(this.point_size ++);
};
DocData.prototype.generateLineIndex = function(){
  return String(this.line_size ++);
};
DocData.prototype.addPoint = function(x, y){
  let point = new Point2D(x, y);
  this.data.points[this.generatePointIndex()] = point;
};
DocData.prototype.addLine = function(start, end){
  let line = new Line2D(start, end);
  this.data.points[this.generatePointIndex()] = line;
};
DocData.prototype.draw = function(ctx, grid){
  for(let i in this.data.points){
    this.data.points[i].fill(ctx, grid, 5, 2, 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 255, 1)');
  }
};
// ================================================================================
// * Engine
// ================================================================================
function Engine(){
  this.initialize.apply(this, arguments);
}

Engine.prototype.canvas = null;
Engine.prototype.ctx = null;
Engine.prototype.canvas_rect = null;

Engine.prototype.image = null;
Engine.prototype.image_src = null;
Engine.prototype.image_rect = null;

Engine.prototype.grid = null;
Engine.prototype.doc_data = null;

Engine.prototype.origin = null;
Engine.prototype.scale = 1;

Engine.prototype.initialize = function(){
  Input.setEngine(this);

  this.canvas_rect = new Rectangle(0, 0, 0, 0);
  this.image_rect = new Rectangle(0, 0, 0, 0);
  this.origin = new Point2D(0, 0);

  this.grid = new Grid();
  this.grid.setEngine(this);

  this.doc_data = new DocData();
};
Engine.prototype.setCanvas = function(canvas){
  this.canvas = canvas;
  Input.setTarget(this.canvas);

  this.ctx = this.canvas.getContext("2d");
  this.canvas_rect = this.calcCanvasRectangle();

  this.refresh();
};
Engine.prototype.calcCanvasRectangle = function(){
  return new Rectangle(0, 0, this.canvas.width, this.canvas.height);
};
Engine.prototype.setImage = async function(src){
  if(!src) return;
  await this.loadImage(src);
  this.setScale(this.calcImageScale());
  this.setOrigin(this.calcImageOrigin());
  this.refresh();
};
Engine.prototype.loadImage = function(src){
  let that = this;
  return new Promise((resolve) => {
    that.image = new Image();
    that.image.src = src;
    that.image.onload = () => {
      resolve();
    }
  });
};
Engine.prototype.calcImageScale = function(){
  let iw = this.image.width;
  let ih = this.image.height;
  let cw = this.canvas_rect.width;
  let ch = this.canvas_rect.height;
  let w = (ih / iw > ch / cw) ? iw * (ch / ih) : cw;
  return w / iw;
};
Engine.prototype.calcImageOrigin = function(){
  let iw = this.image.width;
  let ih = this.image.height;
  let cw = this.canvas_rect.width;
  let ch = this.canvas_rect.height;
  let x = 0, y = 0, w = 0, h = 0;
  if(ih / iw > ch / cw){
    w = iw * (ch / ih)
    x = (cw - w)/2;
  }else{
    h = ih * (cw / iw);
    y = (ch - h)/2;
  }
  return new Point2D(x, y);
};
Engine.prototype.calcImageRectangle = function(){
  let iw = this.image.width;
  let ih = this.image.height;
  let w = iw * this.scale;
  let h = ih * this.scale;
  return new Rectangle(this.origin.x, this.origin.y, w, h);
};
Engine.prototype.setScale = function(scale){
  this.scale = scale;
  this.refresh();
};
Engine.prototype.setOrigin = function(origin){
  this.origin = origin;
  this.refresh();
};
Engine.prototype.addScale = function(scale){
  this.setScale(Math.max(0.05, Math.min(this.scale + scale, 5)));
};
Engine.prototype.multiScale = function(scale){
  this.setScale(Math.max(0.05, Math.min(this.scale * scale, 5)));
};
Engine.prototype.moveOrigin = function(x, y){
  this.setOrigin(new Point2D(this.origin.x + x, this.origin.y + y));
};
Engine.prototype.refresh = function(){
  if(this.canvas){
    this.canvas_rect = this.calcCanvasRectangle();
    this.canvas_rect.clearRect(this.ctx);
    this.canvas_rect.fillRect(this.ctx, 'rgba(0, 0, 0, 0.1)');
  }
  if(this.image){
    this.image_rect = this.calcImageRectangle();
    this.image_rect.drawImage(this.ctx, this.image);
  }
  if(this.grid){
    this.grid.draw(this.ctx);
  }
  if(this.doc_data){
    this.doc_data.draw(this.ctx, this.grid);
  }
};

// ================================================================================
// * export <ES6>
// ================================================================================
export {
  Engine
}
// ================================================================================
