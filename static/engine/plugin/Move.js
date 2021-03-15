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
// * Register Plugin Tool
// ================================================================================
ToolManager.addTool(new Tool("move", "移动工具", "mdi-arrow-all", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
ToolManager.addHandler(new Handler("move.onMouseMove", "mousemove", false, ToolManager, function(event){
  if(MouseInput.isPressed(MouseInput.Mouse.LEFT) || MouseInput.isPressed(MouseInput.Mouse.RIGHT)) {
    let distance = new Point(event.layerX, event.layerY).minus(MouseInput.getMousePoint());
    Graphics.moveOrigin(distance.x, distance.y);
  }
}));
// ================================================================================
