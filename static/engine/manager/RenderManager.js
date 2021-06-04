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
  let temp = [];
  for(let i = 0; i < this._renderers.length; i++){
    temp.push({id: this._renderers[i].id, z: this._renderers[i].z});
  }
  let min_id = 0;
  while(temp.length > 0){
    min_id = 0;
    for(let i = 0;i < temp.length; i++){
      if(temp[i].z < temp[min_id].z){
        min_id = i;
      }
    }
    this._z_list.push(temp.splice(min_id, 1)[0].id);
  }
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
RenderManager.addRenderer = function(renderer){
  this._renderers[renderer.id] = renderer;
};
RenderManager.removeRenderer = function(id){
  this._renderers.remove(id);
};
// --------------------------------------------------------------------------------
RenderManager.canToolManagerCurrentPluginCall = function(id){
  return id.startsWith('_') || id.startsWith(ToolManager.getCurrentPlugin().id)
    || (id.startsWith('!') && !id.startsWith('!' + ToolManager.getCurrentPlugin().id))
}
RenderManager.callRenderer = function(ctx){
  for(let i = 0; i < this._z_list.length; i++){
    if(this.canToolManagerCurrentPluginCall(this._renderers[this._z_list[i]].id)){
      this._renderers[this._z_list[i]].render.call(this._renderers[this._z_list[i]], ctx);
    }
  }
}
// ================================================================================
