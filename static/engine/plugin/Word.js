// ================================================================================
// * Word <SDUDOC Engine Plugin>
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
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool("word", "词汇工具", "mdi-file-word-box", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
// ================================================================================
PolygonGroup.prototype.calcPoints = function(){
  this._points = [];
  for(let i = 0; i < this._polygons.length; i++){
    this._points.push(this._polygons[i].points);
  }
  this.merge();
};
