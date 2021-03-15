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
