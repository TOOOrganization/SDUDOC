// ================================================================================
// * CollideManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/17 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * CollideManager
// --------------------------------------------------------------------------------
function CollideManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
CollideManager._collide_list = {};
CollideManager._collide_list_cache = {};
// --------------------------------------------------------------------------------
CollideManager.initialize = function(){
  this.clear();
};
CollideManager.clear = function(){
  this._collide_list = {};
  this._collide_list_cache = {};
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
CollideManager.update = function(){
  if(!MouseInput.isOver() || !MouseInput.getMousePoint()) return;
  this.clear();
  let filtered_elements = ElementManager.getAllFilteredElement();
  for(let type in filtered_elements){
    for(let id in filtered_elements[type]){
      let distance = filtered_elements[type][id].checkCollide(MouseInput.getMousePoint());
      if(distance >= 0){
        this._collide_list[type] = this._collide_list[type] || [];
        this._collide_list[type].push({
          id: id,
          distance:distance
        });
      }
    }
  }
};
CollideManager.getCollideInfoList = function(type, limit){
  let output = [];
  if (!type || limit <= 0) return output;
  if (!this._collide_list[type]) return output;
  if (this._collide_list_cache[type] && this._collide_list_cache[type][limit]){
    return this._collide_list_cache[type][limit];
  }
  for(let i = 0; i < this._collide_list[type].length; i++){
    let index = 0;
    for(index = 0; index < output.length; index++){
      if(this._collide_list[type][i].distance < output[index].distance){
        break;
      }
    }
    output.splice(index, 0, this._collide_list[type][i]);
    if(output.length > limit){
      output.splice(limit, output.length - limit);
    }
  }
  this._collide_list_cache[type] = this._collide_list_cache[type] || {}
  this._collide_list_cache[type][limit] = output;
  return output;
};
CollideManager.getCollideList = function(type, limit){
  let output = [];
  let info = this.getCollideInfoList(type, limit);
  for(let i = 0; i < info.length; i++){
    output.push(info[i].id);
  }
  return output;
};
// ================================================================================
