// ================================================================================
// * Move <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/14 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * MoveFactory
// --------------------------------------------------------------------------------
function MoveFactory(){
  throw new Error('This is a static class');
}
MoveFactory._target = null;
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
MoveFactory.getTarget = function(){
  return this._target;
};
MoveFactory.setTarget = function(id){
  this._target = id;
};
MoveFactory.clearTarget = function(){
  this._target = null;
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool("move", "移动工具", "mdi-arrow-all", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
ToolManager.addHandler(new Handler("move.onMouseLeftDown", "left_down", false, MoveFactory, function(event){
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  if(collide_list.length > 0) {
    if(SDUDocument.getCurrentPageElement("Dot2D", collide_list[0]).type !== Dot2D.Type.INTERSECTION){
      MoveFactory.setTarget(collide_list[0]);
    }
  }
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("move.onMouseLeftUp", "left_up", false, MoveFactory, function(event){
  if(MoveFactory.getTarget()) {
    DocumentManager.push();
  }
  MoveFactory.clearTarget();
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("move.onMouseMove", "mousemove", false, MoveFactory, function(event){
  if(MoveFactory.getTarget()) {
    let distance = new Point(event.layerX, event.layerY).minus(MouseInput.getMousePoint());
    switch (SDUDocument.getCurrentPageElement("Dot2D", MoveFactory.getTarget()).type){
      case Dot2D.Type.FREE:
        SDUDocument.getCurrentPageElement("Dot2D", MoveFactory.getTarget()).move(Graphics.getGridScalePoint(distance));
        break;
      case Dot2D.Type.DEPENDENT:
        SDUDocument.getCurrentPageElement("Dot2D", MoveFactory.getTarget()).move(MouseInput.getMousePoint());
        break;
    }
    Graphics.refresh();
    return;
  }
  if(MouseInput.isPressed(MouseInput.Mouse.LEFT) || MouseInput.isPressed(MouseInput.Mouse.RIGHT)) {
    let distance = new Point(event.layerX, event.layerY).minus(MouseInput.getMousePoint());
    Graphics.moveOrigin(distance.x, distance.y);
    return;
  }
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("move.onMouseOut", "mouseout", false, MoveFactory, function(event){
  MoveFactory.clearTarget();
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("move.collide", 12, MoveFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;
  let collide_list = CollideManager.getCollideList("Dot2D", 1);
  if(collide_list.length > 0){
    if(SDUDocument.getCurrentPageElement("Dot2D", collide_list[0]).type !== Dot2D.Type.INTERSECTION){
      SDUDocument.getCurrentPageElement("Dot2D", collide_list[0]).renderCollide(ctx);
    }
  }
}));
// ================================================================================
