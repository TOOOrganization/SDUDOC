// ================================================================================
// * RenderManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/15 - Version 1.0.0
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
  for(let key in this._renderers){
    temp.push({id: this._renderers[key].id, z_index: this._renderers[key].z_index});
  }
  let min_id = 0;
  while(temp.length > 0){
    min_id = 0;
    for(let i = 0;i < temp.length; i++){
      if(temp[i].z_index < temp[min_id].z_index){
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
  for(let i = 0; i < this._z_list.length; i++){
    if(this._z_list[i] === id){
      this._z_list.splice(i, 1);
    }
  }
};
// --------------------------------------------------------------------------------
RenderManager.setVisible = function(id, value){
  this._renderers[id].setVisible(value);
};
// --------------------------------------------------------------------------------
RenderManager.getVisibleList = function(){
  let output = [];
  for(let key in this._renderers){
    output.push({
      id: this._renderers[key].id,
      name: this._renderers[key].name,
      visible: this._renderers[key].visible
    });
  }
  return output;
};
// --------------------------------------------------------------------------------
RenderManager.canToolManagerCurrentPluginCall = function(id){
  return id.startsWith('_') || id.startsWith(ToolManager.getCurrentPluginId())
    || (id.startsWith('!') && !id.startsWith('!' + ToolManager.getCurrentPluginId()))
}
RenderManager.callRenderer = function(ctx){
  for(let i = 0; i < this._z_list.length; i++){
    if(this._renderers[this._z_list[i]].visible &&
      this.canToolManagerCurrentPluginCall(this._renderers[this._z_list[i]].id)){
      this._renderers[this._z_list[i]].render.call(this._renderers[this._z_list[i]], ctx);
    }
  }
};
// ================================================================================
