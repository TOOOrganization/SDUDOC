// ================================================================================
// * RenderManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/15 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * RenderManager
// --------------------------------------------------------------------------------
function RenderManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
RenderManager._renderers = {};
RenderManager._z_list = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
RenderManager.initialize = function() {
  this.clear();
  this._setupZList();
};
RenderManager.clear = function() {
  this._z_list = [];
};
RenderManager._setupZList = function() {

};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
RenderManager.addRenderer = function(handler){
  this._renderers[handler.id] = handler;
};
RenderManager.removeRenderer = function(id){
  this._renderers.remove(id);
};
RenderManager.callRenderer = function(ctx){
  for(let i in this._renderers){
    if(this._renderers[i].id.startsWith("_") || this._renderers[i].id.startsWith(ToolManager.getCurrentPlugin().id)){
      this._renderers[i].render.call(this._renderers[i].owner, ctx);
    }
  }
}
// --------------------------------------------------------------------------------
