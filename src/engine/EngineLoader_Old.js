// ================================================================================
// * SDUDOC Engine Loader
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   SDUDOC Engine Loader.
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/11 - Version 1.0.0
//     - Engine Loader core
// ================================================================================

// ================================================================================
// * EngineLoader_Old
// --------------------------------------------------------------------------------
function EngineLoader_Old() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
EngineLoader_Old.PATH = "@/../static/engine-old/";
// --------------------------------------------------------------------------------
EngineLoader_Old.CORE = EngineLoader_Old.PATH + "core/";
EngineLoader_Old.MANAGER = EngineLoader_Old.PATH + "manager/";
EngineLoader_Old.TOOL = EngineLoader_Old.PATH + "tool/";
// --------------------------------------------------------------------------------
EngineLoader_Old.CORE_LIST = [
  "Point", "Rectangle", "Polygon", "Line",
  "PolygonGroup",
  "Graphics",
  "Handler", "Renderer", "Tool",
  "SDUDocument",
  "Input", "MouseInput"
];
EngineLoader_Old.MANAGER_LIST = [
  "LanguageManager", "DocumentManager", "RenderManager", "CollideManager",
  "ToolManager", "SelectManager"
];
EngineLoader_Old.TOOL_LIST = [
  "Page", "History", "Document", "Check", "Dev"
];
// --------------------------------------------------------------------------------
EngineLoader_Old.PLUGIN = EngineLoader_Old.PATH + "plugin/";
// --------------------------------------------------------------------------------
EngineLoader_Old.ENGINE = "Engine";
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
EngineLoader_Old.load = async function(canvas, element, axios, base64, owner){
  await EngineLoader_Old.loadCore();
  await EngineLoader_Old.loadManager();
  await EngineLoader_Old.loadTool();
  await EngineLoader_Old.loadEngine();
  await EngineLoader_Old.loadPlugin();

  Engine.initialize();
  Engine.setElements(canvas, element, axios, base64, owner);
};
EngineLoader_Old.loadCore = async function(){
  for(let i in EngineLoader_Old.CORE_LIST){
    await this.loadScript(EngineLoader_Old.CORE, EngineLoader_Old.CORE_LIST[i] + ".js");
  }
};
EngineLoader_Old.loadManager = async function(){
  for(let i in EngineLoader_Old.MANAGER_LIST){
    await this.loadScript(EngineLoader_Old.MANAGER, EngineLoader_Old.MANAGER_LIST[i] + ".js");
  }
};
EngineLoader_Old.loadTool = async function(){
  for(let i in EngineLoader_Old.TOOL_LIST){
    await this.loadScript(EngineLoader_Old.TOOL, EngineLoader_Old.TOOL_LIST[i] + ".js");
  }
};
EngineLoader_Old.loadEngine = async function(){
  await this.loadScript(EngineLoader_Old.PATH, EngineLoader_Old.ENGINE + ".js");
}
EngineLoader_Old.loadPlugin = async function(){
  let plugin_list = require('../../static/engine/plugins.json');
  for(let i in plugin_list){
    await this.loadScript(EngineLoader_Old.PLUGIN, plugin_list[i]);
  }
};
EngineLoader_Old.loadScript = function(path, name){
  return new Promise((resolve) => {
    let url = path + name;
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = (err) => {
      console.log(err);
    };
    script._url = url;
    script.onload = () =>{
      resolve();
    };
    document.body.appendChild(script);
  });
};
// ================================================================================

// ================================================================================
// * Export <ES6>
// --------------------------------------------------------------------------------
export {
  EngineLoader_Old
};
// ================================================================================
