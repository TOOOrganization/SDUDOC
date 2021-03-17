// ================================================================================
// * CollideManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/17 - Version 1.0.0
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
CollideManager._collide_list = [];
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
CollideManager.clear = function(){
  this._collide_list = [];
};
CollideManager.update = function(){
  this.clear();
  for(let i in SDUDocument.data){
    for(let j in SDUDocument.data[i]){
      if(SDUDocument.data[i][j].checkCollide){
        let distance = SDUDocument.data[i][j].checkCollide();
        if(distance >= 0){
          this._collide_list.push({id: j, type:i, distance:distance});
        }
      }
    }
  }
};
CollideManager.getCollideList = function(type, limit){
  let list = [];
  for(let i in this._collide_list){
    if(this._collide_list[i].type === type){
      let index = 0;
      for(index = 0; index < list.length; index++){
        if(this._collide_list[i].distance < list[index].distance){
          break;
        }
      }
      list.splice(index, 0, this._collide_list[i]);
      if(list.length > limit){
        list.splice(limit, list.length - limit);
      }
    }
  }
  return list;
};
