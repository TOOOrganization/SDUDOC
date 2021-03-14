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
// * DocumentManager
// --------------------------------------------------------------------------------
function EngineLoader() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
EngineLoader.PATH = "@/../static/engine/";
// --------------------------------------------------------------------------------
EngineLoader.CORE = EngineLoader.PATH + "core/";
EngineLoader.MANAGER = EngineLoader.PATH + "manager/";
// --------------------------------------------------------------------------------
EngineLoader.CORE_LIST = [
  "Point", "Rectangle", "Polygon", "Line",
  "Graphics",
  "Handler",
  "Input", "MouseInput"
];
EngineLoader.MANAGER_LIST = [
  "DocumentManager", "PluginManager"
];
// --------------------------------------------------------------------------------
EngineLoader.PLUGIN = EngineLoader.PATH + "plugin/";
// --------------------------------------------------------------------------------
EngineLoader.ENGINE = "Engine";
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
EngineLoader.load = async function(canvas, element){
  await EngineLoader.loadCore();
  await EngineLoader.loadManager();
  await EngineLoader.loadEngine();
  await EngineLoader.loadPlugin();

  Engine.initialize();
  Engine.setCanvas(canvas, element);
};
EngineLoader.loadCore = async function(){
  for(let i in EngineLoader.CORE_LIST){
    await this.loadScript(EngineLoader.CORE, EngineLoader.CORE_LIST[i] + ".js");
  }
};
EngineLoader.loadManager = async function(){
  for(let i in EngineLoader.MANAGER_LIST){
    await this.loadScript(EngineLoader.MANAGER, EngineLoader.MANAGER_LIST[i] + ".js");
  }
};
EngineLoader.loadEngine = async function(){
  await this.loadScript(EngineLoader.PATH, EngineLoader.ENGINE + ".js");
}
EngineLoader.loadPlugin = async function(){
  let plugin_list = require('../../static/engine/plugins.json');
  for(let i in plugin_list){
    await this.loadScript(EngineLoader.PLUGIN, plugin_list[i]);
  }
};
EngineLoader.loadScript = function(path, name){
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
// ================================================================================
export {
  EngineLoader
};
// ================================================================================
