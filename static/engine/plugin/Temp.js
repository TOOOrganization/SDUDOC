

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


ToolManager.addTool(new Tool("剪切工具", "mdi-scissors-cutting", Tool.Type.PLUGIN, "", function(){

}));
ToolManager.addTool(new Tool("文字工具", "mdi-alpha-a", Tool.Type.PLUGIN, "", function(){

}));
ToolManager.addTool(new Tool("注释工具", "mdi-tooltip-plus-outline", Tool.Type.PLUGIN, "", function(){

}));




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
  let point = new Point(x, y);
  this.data.points[this.generatePointIndex()] = point;
};
DocData.prototype.addLine = function(start, end){
  let line = new Line2D(start, end);
  this.data.points[this.generatePointIndex()] = line;
};
DocData.prototype.draw = function(ctx, grid){
  for(let i in this.data.points){
    //this.data.points[i].fill(ctx, grid, 5, 2, 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 255, 1)');
  }
};

let data = {

}
