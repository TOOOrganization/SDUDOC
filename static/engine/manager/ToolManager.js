// ================================================================================
// * ToolManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/14 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * ToolManager
// --------------------------------------------------------------------------------
function ToolManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
ToolManager.tools = [];
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
ToolManager.addTool = function(tool){
  this.tools.push(tool);
}
ToolManager.getToolList = function(type){
  let data = [];
  for(let i in this.tools){
    if(this.tools[i].type === type){
      data.push({
        tooltip: this.tools[i].tooltip,
        icon: this.tools[i].icon,
        callback: this.tools[i].callback,
        description: this.tools[i].description
      })
    }
  }
  return data;
}
// ================================================================================
