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
  if(!MouseInput.isOver() || !MouseInput.getMousePoint()) return;
  this.clear();
  for(let i in SDUDocument.data){
     for(let j in SDUDocument.data[i]){
       if(SDUDocument.data[i][j].checkCollide){
        let distance = SDUDocument.data[i][j].checkCollide(MouseInput.getMousePoint());
        if(distance >= 0){
          this._collide_list.push({id: j, page:SDUDocument.data[i][j].page, type:i, distance:distance});
        }
      }
    }
  }
};
CollideManager.getCollideListInfo = function(type, limit){
  let list = [];
  let current_page = DocumentManager.getCurrentPageId();
  for(let i in this._collide_list){
    if(this._collide_list[i].type === type && this._collide_list[i].page === current_page){
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
CollideManager.getCollideList = function(type, limit){
  let info = this.getCollideListInfo(type, limit);
  let list = [];
  for(let i in info){
    list.push(info[i].id);
  }
  return list;
};
