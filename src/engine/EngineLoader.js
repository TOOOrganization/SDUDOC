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
// * EngineLoader
// --------------------------------------------------------------------------------
function EngineLoader() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
EngineLoader.ALLOW_LOADING = false;
// --------------------------------------------------------------------------------
EngineLoader.PATH    = "@/../static/engine/";
// --------------------------------------------------------------------------------
EngineLoader.MODULE  = EngineLoader.PATH + "module/";
EngineLoader.CORE    = EngineLoader.PATH + "core/";
EngineLoader.MANAGER = EngineLoader.PATH + "manager/";
EngineLoader.TOOL    = EngineLoader.PATH + "tool/";
EngineLoader.PLUGIN  = EngineLoader.PATH + "plugin/";
// --------------------------------------------------------------------------------
EngineLoader.ENGINE  = "Engine";
// --------------------------------------------------------------------------------
EngineLoader.MODULE_LIST = [
  "LanguageModule", "HttpRequestModule"
];
EngineLoader.CORE_LIST = [
  "Element", "Point", "Rectangle", "Polygon", "Line",
  "PolygonGroup",
  "Graphics",
  "Handler", "Renderer", "Tool",
  "SDUDocument",
  "Input", "MouseInput"
];
EngineLoader.MANAGER_LIST = [
  "DocumentManager", "RenderManager", "CollideManager",
  "ToolManager", "SelectManager", "ElementManager"
];
EngineLoader.TOOL_LIST = [
  "Page", "History", "Document", "Check", "Dev"
];
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
EngineLoader.load = async function(app_element, packages){

  await this.loadEngine();
  Engine.setApp(app_element);
  Engine.setPackages(packages);

  await this.loadModule();
  LanguageModule.initialize();

  await this.wait(500);
  Engine.updateLoadingData();

  await this.loading(1000, 'loading-engine', '');
  Engine.updateAppData();

  Engine.setCurrentLoadingProcess('loading-core', '...');
  await this.wait(100);
  await EngineLoader.loadCore();

  Engine.setCurrentLoadingProcess('loading-manager', '...');
  await this.wait(100);
  await EngineLoader.loadManager();

  Engine.setCurrentLoadingProcess('loading-tool', '...');
  await this.wait(100);
  await EngineLoader.loadTool();

  Engine.setCurrentLoadingProcess('loading-plugin', '...');
  await this.wait(100);
  await EngineLoader.loadPlugin();

  Engine.setCurrentLoadingProcess('loading-complete', '');
  Engine.initialize();
};
// --------------------------------------------------------------------------------
EngineLoader.loadEngine = async function(){
  await this.loadScript(EngineLoader.PATH, EngineLoader.ENGINE + '.js');
}
EngineLoader.loadModule = async function(){
  for(let i in EngineLoader.MODULE_LIST){
    await this.loadScript(EngineLoader.MODULE, EngineLoader.MODULE_LIST[i] + '.js');
  }
}
EngineLoader.loadCore = async function(){
  for(let i in EngineLoader.CORE_LIST){
    await this.loading(100, 'loading-core', '：' + EngineLoader.CORE_LIST[i]);
    await this.loadScript(EngineLoader.CORE, EngineLoader.CORE_LIST[i] + '.js');
  }
};
EngineLoader.loadManager = async function(){
  for(let i in EngineLoader.MANAGER_LIST){
    await this.loading(100, 'loading-manager', '：' + EngineLoader.MANAGER_LIST[i] );
    await this.loadScript(EngineLoader.MANAGER, EngineLoader.MANAGER_LIST[i] + '.js');
  }
};
EngineLoader.loadTool = async function(){
  for(let i in EngineLoader.TOOL_LIST){
    await this.loading(100, 'loading-tool', '：' + EngineLoader.TOOL_LIST[i]);
    await this.loadScript(EngineLoader.TOOL, EngineLoader.TOOL_LIST[i] + '.js');
  }
};
EngineLoader.loadPlugin = async function(){
  let plugin_list = require('../../static/engine/plugins.json');
  for(let i in plugin_list){
    await this.loading(100, 'loading-plugin', '：' + plugin_list[i]);
    await this.loadScript(EngineLoader.PLUGIN, plugin_list[i]);
  }
};
// --------------------------------------------------------------------------------
EngineLoader.wait = function(time){
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
EngineLoader.loading = async function(loading_time, id, text){
  if (!this.ALLOW_LOADING) return;
  let time = 0;
  while(time < loading_time){
    let add = Math.floor(Math.random() * 10);
    time = Math.min(loading_time, time + add);
    await this.wait(add);
    Engine.setCurrentLoadingProcess(id, text + '...' +
      Math.floor(time / loading_time * 100) + '%');
  }
};
// --------------------------------------------------------------------------------
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
// --------------------------------------------------------------------------------
export {
  EngineLoader
};
// ================================================================================
