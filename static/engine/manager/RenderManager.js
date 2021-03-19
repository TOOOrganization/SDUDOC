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
  for(let i in this._renderers){
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
RenderManager.callRenderer = function(ctx){
  for(let i = 0; i < this._z_list.length; i++){
    if(this._renderers[this._z_list[i]].id.startsWith("!" + ToolManager.getCurrentPlugin().id)) {
      continue;
    }else if(this._renderers[this._z_list[i]].id.startsWith("!")){
      this._renderers[this._z_list[i]].render.call(this._renderers[this._z_list[i]].owner, ctx);
      continue;
    }
    if(this._renderers[this._z_list[i]].id.startsWith("_") ||
      this._renderers[this._z_list[i]].id.startsWith(ToolManager.getCurrentPlugin().id)){
      this._renderers[this._z_list[i]].render.call(this._renderers[this._z_list[i]].owner, ctx);
      continue;
    }
  }
}
// --------------------------------------------------------------------------------
