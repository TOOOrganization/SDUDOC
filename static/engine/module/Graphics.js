// ================================================================================
// * Graphics <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/14 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Graphics
// --------------------------------------------------------------------------------
function Graphics(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Graphics.MIN_SCALE = 0.025;
Graphics.MAX_SCALE = 5;
// --------------------------------------------------------------------------------
Graphics.GRID_UNIT_LENGTH = 12.5;
Graphics.GRID_UNIT_LIMIT = 100;
// --------------------------------------------------------------------------------
Graphics.SCALE_PLATE_WIDTH = 20;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Graphics._draw_grid = true;
Graphics._draw_scale_plate = true;
// --------------------------------------------------------------------------------
Graphics._PIXI = null;
Graphics._canvas = null;
Graphics._context = null;
// --------------------------------------------------------------------------------
Graphics._content_rect = null;
// --------------------------------------------------------------------------------
Graphics._image = null;
Graphics._image_src = null;
Graphics._image_rect = null;
// --------------------------------------------------------------------------------
Graphics._origin = null;
Graphics._scale = 1;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Graphics.initialize = function(){
  this._PIXI = null;
  this._canvas = null;
  this._context = null;
  this._content_rect = null;
};
Graphics.reset = function(){
  this._image = null;
  this._image_src = null;
  this._image_rect = null;
  this._origin = this.calcInitialOrigin();
  this._scale = 1;
};
Graphics.initializeEditor = function(editor){
  this._PIXI = editor.pixi;
  this._canvas = editor.pixi_app.view;
  this._context = editor.pixi_context;
  this._content_rect = this.calcContentRectangle();
  this.reset();
  this.refresh();
}
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Graphics, 'origin', {
  get: function() {
    return this._origin;
  },
  configurable: true
});
Object.defineProperty(Graphics, 'scale', {
  get: function() {
    return this._scale;
  },
  configurable: true
});
Object.defineProperty(Graphics, 'image', {
  get: function() {
    return this._image;
  },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Image
// --------------------------------------------------------------------------------
Graphics.setImage = async function(src){
  if(!src) return this.clearImage();
  await this.loadImage(src);
  this._scale = this.calcImageScale();
  this._origin = this.calcImageOrigin();
  this.refresh();
};
Graphics.clearImage = function(){
  this.reset();
  this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.loadImage = function(src){
  return new Promise((resolve) => {
    Graphics._image = new Image();
    Graphics._image.onload = function(){
      resolve();
    }
    Graphics._image.src = src;
  });
};
Graphics.calcImageRectangle = function(){
  let iw = this._image.width;
  let ih = this._image.height;
  let w = iw * this._scale;
  let h = ih * this._scale;
  return new Rectangle(this._origin.x, this._origin.y, w, h);
};
Graphics.calcContentRectangle = function(){
  if(!this._canvas) return new Rectangle(0, 0, 0, 0);
  if(this._draw_scale_plate){
    return new Rectangle(this.SCALE_PLATE_WIDTH, this.SCALE_PLATE_WIDTH,
      this._canvas.width - this.SCALE_PLATE_WIDTH, this._canvas.height - this.SCALE_PLATE_WIDTH);
  }else{
    return new Rectangle(0, 0, this._canvas.width, this._canvas.height);
  }
};
// --------------------------------------------------------------------------------
// * Origin
// --------------------------------------------------------------------------------
Graphics.setOrigin = function(origin){
  this._origin = origin;
  this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.moveOrigin = function(x, y){
  this.setOrigin(new Point(this._origin.x + x, this._origin.y + y));
};
// --------------------------------------------------------------------------------
Graphics.calcInitialOrigin = function(){
  if(!this._image){
    if(this._canvas){
      return new Point(this._content_rect.x + this._content_rect.width / 2,
        this._content_rect.y + this._content_rect.height / 2);
    }else{
      return new Point(this._content_rect.x, this._content_rect.y);
    }
  }
  return this.calcImageOrigin();
};
Graphics.calcImageOrigin = function(){
  let iw = this._image.width;
  let ih = this._image.height;
  let cw = this._content_rect.width;
  let ch = this._content_rect.height;

  let x = this._content_rect.x;
  let y = this._content_rect.y;
  let w = 0;
  let h = 0;
  if(ih / iw > ch / cw){
    w = iw * (ch / ih)
    x += (cw - w)/2;
  }else{
    h = ih * (cw / iw);
    y += (ch - h)/2;
  }
  return new Point(x, y);
};
// --------------------------------------------------------------------------------
// * Scale
// --------------------------------------------------------------------------------
Graphics.setScale = function(scale){
  this._scale = scale;
  this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.addScale = function(scale){
  this.setScale(Math.max(this.MIN_SCALE, Math.min(this._scale + scale, this.MAX_SCALE)));
};
Graphics.multiScale = function(scale){
  this.setScale(Math.max(this.MIN_SCALE, Math.min(this._scale * scale, this.MAX_SCALE)));
};
// --------------------------------------------------------------------------------
Graphics.calcImageScale = function(){
  let iw = this._image.width;
  let ih = this._image.height;
  let cw = this._content_rect.width;
  let ch = this._content_rect.height;
  let w = (ih / iw > ch / cw) ? iw * (ch / ih) : cw;
  return w / iw;
};
// --------------------------------------------------------------------------------
// * Update & Refresh
// --------------------------------------------------------------------------------
Graphics.update = function(){
  this.refresh();
}
// --------------------------------------------------------------------------------
Graphics.refresh = function(){
  if (!Engine.checkRouter('Editor')) return;

  if(!this._canvas) return;
  this.clear();
  this._content_rect = this.calcContentRectangle();

  if(this._image){
    this._image_rect = this.calcImageRectangle();
    this.drawImageRectangle(this._image, this._image_rect);
  }

  if(this._draw_grid)
    this.drawGrid();

  CollideManager.update();
  RenderManager.callRenderer(this._context);

  if(this._draw_scale_plate)
    this.drawScalePlate();
};
// --------------------------------------------------------------------------------
// * Draw Parts
// --------------------------------------------------------------------------------
Graphics.drawGrid = function(){
  let scaled_unit = this.GRID_UNIT_LENGTH * this._scale;
  let draw_unit = 0;
  let unit_scale = 1;
  if(scaled_unit < this.GRID_UNIT_LIMIT) {
    for(let i = scaled_unit; i < this.GRID_UNIT_LIMIT; i *= 2){
      draw_unit = i;
      unit_scale *= 2;
    }
  }else{
    for(let i = scaled_unit; i > this.GRID_UNIT_LIMIT / 2; i /= 2){
      draw_unit = i;
      unit_scale /= 2;
    }
  }
  let draw_start_x = this._origin.x / draw_unit;
  let draw_start_y = this._origin.y / draw_unit;
  let draw_origin_x = Math.floor(draw_start_x);
  let draw_origin_y = Math.floor(draw_start_y);

  let sx = 0;
  let sy = 0;
  let cw = this._canvas.width;
  let ch = this._canvas.height;

  this._context.font = "11px Arial";
  for(let i = draw_start_x - draw_origin_x; i <= cw / draw_unit; i ++){
    let alpha = ((Math.floor(i) - draw_origin_x) % 2 === 0 ? 1 : (draw_unit / 10 - 5));
    this.fillRect(sx + i * draw_unit - 0.5, sy, 1, ch, 0xd3d3d3, alpha);
    let point = Math.round((Math.floor(i) - draw_origin_x) * this.GRID_UNIT_LENGTH * unit_scale);
    //let text_width = this._context.measureTextWidth(String(point / 2));
    //this._context.fillText(String(point / 2), i * draw_unit - text_width - 3, draw_start_y * draw_unit + 12);
  }
  for(let i = draw_start_y - draw_origin_y; i <= ch / draw_unit; i ++){
    let alpha = ((Math.floor(i) - draw_origin_y) % 2 === 0 ? 1 : (draw_unit / 10 - 5));
    this.fillRect(sx, sy + i * draw_unit - 0.5, cw, 1, 0xd3d3d3, alpha);
    let point = Math.round((Math.floor(i) - draw_origin_y) * this.GRID_UNIT_LENGTH * unit_scale);
    //this._context.fillText(string(point / 2), draw_start_x * draw_unit + 3, i * draw_unit - 4);
  }
};
Graphics.drawScalePlate = function(){
  this.fillRect(0, 0, this.SCALE_PLATE_WIDTH, this._canvas.height, 0xf5f5f5, 1);
  this.fillRect(0, 0, this._canvas.width, this.SCALE_PLATE_WIDTH, 0xf5f5f5, 1);
  this.fillRect(this._content_rect.x - 1, this._content_rect.y - 1, 1, this._content_rect.height,
    0xd3d3d3, 1);
  this.fillRect(this._content_rect.x - 1, this._content_rect.y - 1, this._content_rect.width, 1,
    0xd3d3d3, 1);
};
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// * Point Transition
// --------------------------------------------------------------------------------
Graphics.getSourcePoint = function(point){
  return point.minus(this._origin).division(this._scale);
}
Graphics.getRenderPoint = function(point){
  return point.multiply(this._scale).add(this._origin);
}
// --------------------------------------------------------------------------------
Graphics.getScaledPoint = function(point){
  return point.division(this._scale);
}
// --------------------------------------------------------------------------------
Graphics.getMouseSourcePoint = function(){
  let mouse_point = MouseInput.getMousePoint();
  return mouse_point ? this.getSourcePoint(mouse_point) : null;
}
// --------------------------------------------------------------------------------
// * Line Transition
// --------------------------------------------------------------------------------
Graphics.getSourceLine = function(line){
  return new Line(this.getSourcePoint(line.start), this.getSourcePoint(line.end));
}
Graphics.getRenderLine = function(line){
  return new Line(this.getRenderPoint(line.start), this.getRenderPoint(line.end));
}
// --------------------------------------------------------------------------------
// * Polygon Transition
// --------------------------------------------------------------------------------
Graphics.getSourcePolygon = function(polygon){
  let points = [];
  for(let i = 0; i < polygon.points.length; i++){
    points.push(this.getSourcePoint(polygon.points[i]));
  }
  return new Polygon(points);
}
Graphics.getRenderPolygon = function(polygon){
  let points = [];
  for(let i = 0; i < polygon.points.length; i++){
    points.push(this.getRenderPoint(polygon.points[i]));
  }
  return new Polygon(points);
}
// --------------------------------------------------------------------------------
// * Paint
// --------------------------------------------------------------------------------
Graphics.clear = function(){
  this._context.clear();
}
// --------------------------------------------------------------------------------
// * Paint Rectangle
// --------------------------------------------------------------------------------
Graphics.drawRect = function(x, y, width, height, fill_color, fill_alpha, line_width, line_color, line_alpha){
  this._context.lineStyle(line_width, line_color, line_alpha, 1);
  this._context.beginFill(fill_color, fill_alpha);
  this._context.drawRect(x, y, width, height);
  this._context.endFill();
  this._context.lineStyle(0);
}
Graphics.fillRect = function(x, y, width, height, color, alpha){
  this.drawRect(x, y, width, height, color, alpha, 0, 0, 0);
}
Graphics.strokeRect = function(x, y, width, height, line_width, color, alpha){
  this.drawRect(x, y, width, height, 0, 0, line_width, color, alpha);
}
// --------------------------------------------------------------------------------
Graphics.drawRectangle = function(rect, fill_color, fill_alpha, line_width, line_color, line_alpha){
  this.drawRect(rect.x, rect.y, rect.width, rect.height, fill_color, fill_alpha, line_width, line_color, line_alpha);
}
Graphics.fillRectangle = function(rect, color, alpha){
  this.fillRect(rect.x, rect.y, rect.width, rect.height, color, alpha);
}
Graphics.strokeRectangle = function(rect, line_width, color, alpha){
  this.strokeRect(rect.x, rect.y, rect.width, rect.height, line_width, color, alpha);
}
// --------------------------------------------------------------------------------
// * Paint Circle
// --------------------------------------------------------------------------------
Graphics.drawCircle = function(x, y, radius, fill_color, fill_alpha, line_width, line_color, line_alpha){
  this._context.lineStyle(line_width, line_color, line_alpha, 1);
  this._context.beginFill(fill_color, fill_alpha);
  this._context.drawCircle(x, y, radius);
  this._context.endFill();
  this._context.lineStyle(0);
}
Graphics.fillCircle = function(x, y, radius, color, alpha){
  this.drawCircle(x, y, radius, color, alpha, 0, 0, 0);
}
Graphics.strokeCircle = function(x, y, radius, line_width, color, alpha){
  this.drawCircle(x, y, radius, 0, 0, line_width, color, alpha);
}
// --------------------------------------------------------------------------------
Graphics.drawPoint = function(point, radius, fill_color, fill_alpha, line_width, line_color, line_alpha){
  this.drawCircle(point.x, point.y, radius, fill_color, fill_alpha, line_width, line_color, line_alpha);
}
Graphics.fillPoint = function(point, radius, color, alpha){
  this.fillCircle(point.x, point.y, radius, color, alpha);
}
Graphics.strokePoint = function(point, radius, line_width, color, alpha){
  this.strokeCircle(point.x, point.y, radius, line_width, color, alpha);
}
// --------------------------------------------------------------------------------
// * Paint Polygon
// --------------------------------------------------------------------------------
Graphics.drawPolygonArray = function(polygon_array, fill_color, fill_alpha, line_width, line_color, line_alpha){
  this._context.lineStyle(line_width, line_color, line_alpha, 1);
  this._context.beginFill(fill_color, fill_alpha);
  this._context.drawPolygon(polygon_array);
  this._context.endFill();
  this._context.lineStyle(0);
}
Graphics.fillPolygonArray = function(polygon_array, color, alpha){
  this.drawPolygonArray(polygon_array, color, alpha, 0, 0, 0);
}
Graphics.strokePolygonArray = function(polygon_array, line_width, color, alpha){
  this.drawPolygonArray(polygon_array, 0, 0, line_width, color, alpha);
}
// --------------------------------------------------------------------------------
Graphics.drawPolygon = function(polygon, fill_color, fill_alpha, line_width, line_color, line_alpha){
  this.drawPolygonArray(polygon.getRenderArray(), fill_color, fill_alpha, line_width, line_color, line_alpha);
}
Graphics.fillPolygon = function(polygon, color, alpha){
  this.fillPolygonArray(polygon.getRenderArray(), color, alpha);
}
Graphics.strokePolygon = function(polygon, line_width, color, alpha){
  this.strokePolygonArray(polygon.getRenderArray(), line_width, color, alpha);
}
// --------------------------------------------------------------------------------
// Graphics.drawText = function(){
//   this._context.drawImage(arguments);
// }
// --------------------------------------------------------------------------------
Graphics.drawImage = function(image, x, y, width, height){
  let texture = this._PIXI.Texture.from(image);
  let imageScale = width / this._image.width;
  this._context.beginTextureFill({
    texture: texture,
    matrix: new this._PIXI.Matrix(imageScale, 0, 0, imageScale, x, y)
  });
  this._context.drawRect(x, y, width, height);
  this._context.endFill();
}
Graphics.drawImageRectangle = function(image, rect){
  this.drawImage(image, rect.x, rect.y, rect.width, rect.height);
}
// ================================================================================

/*
      rectangle.lineStyle(4, 0xFF3300, 1);
      rectangle.beginFill(0x66CCFF);
      rectangle.drawRect(0, 0, 64, 64);
      rectangle.endFill();
      rectangle.x = 170;
      rectangle.y = 170;
 */

/*

  this._context.lineStyle(4, 0xFF3300, 1);
  this._context.beginFill(0x66CCFF);
  this._context.drawRect(0, 0, 64, 64);
  this._context.endFill();
 */





/*
// --------------------------------------------------------------------------------
// * Property

// --------------------------------------------------------------------------------
Graphics._canvas = null;
Graphics._element = null;
Graphics._ctx = null;
Graphics._canvas_rect = null;
// --------------------------------------------------------------------------------
Graphics._temp_canvas = null;
Graphics._temp_ctx = null;
// --------------------------------------------------------------------------------
Graphics._image = null;
Graphics._image_src = null;
Graphics._image_rect = null;
// --------------------------------------------------------------------------------
Graphics._origin = null;
Graphics._scale = 1;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Graphics.initialize = function(){
  this.clear();
};
Graphics.clear = function(){
  this._canvas = null;
  this._element = null;
  this._ctx = null;
  this._canvas_rect = new Rectangle(0, 0, 0, 0);
  this.reset();
};
Graphics.reset = function(){
  this._image = null;
  this._image_src = null;
  this._image_rect = new Rectangle(0, 0, 0, 0);
  this.calcInitialOrigin();
  this._scale = 1;
};
// --------------------------------------------------------------------------------
Graphics.setCanvas = function(canvas, element){
  this.addCanvasHandler(canvas);

  this._canvas = canvas;
  this._element = element;
  this._ctx = this._canvas.getContext("2d");

  this.createTempCanvas();
  this.refreshCanvas();
};
Graphics.createTempCanvas = function(){
  this._temp_canvas = document.createElement('canvas');
  this._temp_canvas.width = this._canvas.width;
  this._temp_canvas.height = this._canvas.height;
  this._temp_ctx = this._temp_canvas.getContext("2d");
};

// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
Graphics.getGridPoint = function(point){
  let draw_distance = point.minus(this._origin);
  return draw_distance.division(this._scale);
}
Graphics.getGridScalePoint = function(point){
  return point.division(this._scale);
}
Graphics.getRenderPoint = function(point){
  let draw_distance = point.multiply(this._scale);
  return draw_distance.add(this._origin);
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Graphics.addCanvasHandler = function(canvas){
  window.addEventListener('resize', this.refreshCanvas.bind(this));
};
Graphics.refreshCanvas = function(){
  this._canvas.width = this._element.clientWidth;
  this._canvas.height = this._element.clientHeight;
  this.refreshTempCanvas();
  this.calcInitialOrigin();
  this.refresh();
};
Graphics.calcCanvasRectangle = function(){
  return new Rectangle(0, 0, this._canvas.width, this._canvas.height);
};

// --------------------------------------------------------------------------------
Graphics.refreshTempCanvas = function(){
  this._temp_canvas.width = this._canvas.width;
  this._temp_canvas.height = this._canvas.height;
}
Graphics.clearTempCanvas = function(){
  this._canvas_rect.clear(this._temp_ctx);
};
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
Graphics.refresh = function(){
  if(this._canvas){
    this._canvas_rect = this.calcCanvasRectangle();
    this._canvas_rect.clear(this._ctx);
    this._canvas_rect.fillSelf(this._ctx, 'rgba(0, 0, 0, 0.1)');
  }
  if(this._image){
    this._image_rect = this.calcImageRectangle();
    this._image_rect.drawImage(this._ctx, this._image);
  }
  if(this._canvas) {
    this.drawGrid(this._ctx);
    this.refreshTempCanvas();
    CollideManager.update();
    RenderManager.callRenderer(this._ctx);
  }
};

// ================================================================================
*/
