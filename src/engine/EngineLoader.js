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
//   2021/03/11 - Version 1.0.0
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
EngineLoader.OBJECT  = EngineLoader.PATH + "object/";
EngineLoader.MANAGER = EngineLoader.PATH + "manager/";
EngineLoader.TOOL    = EngineLoader.PATH + "tool/";
EngineLoader.PLUGIN  = EngineLoader.PATH + "plugin/";
// --------------------------------------------------------------------------------
EngineLoader.ENGINE  = "Engine";
// --------------------------------------------------------------------------------
EngineLoader.MODULE_LIST = [
  'Input', 'MouseInput', 'Language', 'HttpRequest', 'Graphics'
];
EngineLoader.CORE_LIST = [
  'Point', 'Line', 'Rectangle', 'Polygon',
];
EngineLoader.OBJECT_LIST = [
  'Header', 'PageArray',
  'Handler', 'Renderer', 'Tool', 'History',
  'Element', 'PolygonGroup', 'Page'
];
EngineLoader.MANAGER_LIST = [
  'ElementManager', 'HistoryManager', 'ColorManager',
  'DocumentManager', 'RenderManager', 'CollideManager',
  'ToolManager', 'SelectManager'
];
EngineLoader.TOOL_LIST = [
  "Page", "History", "Document", "Check", "Dev"
];
EngineLoader.PLUGIN_LIST = require('../../static/engine/plugins.json').PLUGIN_LIST;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
EngineLoader._progress = 0;
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
EngineLoader.load = async function(app_element, packages){
  await this.loadEngine();
  Engine.setApp(app_element);
  Engine.setPackages(packages);
  this.setProgress(0);

  await this.loadModule();
  Language.initializeOnLoad();

  await this.wait(500);
  Engine.updateLoadingData();
  await this.loading(1000, 'loading-engine', '');
  Engine.setCurrentTodo('engine-loading');
  Engine.updateAppData();

  Engine.setCurrentLoadingProcess('loading-core', '...');
  await this.wait(100);
  await EngineLoader.loadCore();

  Engine.setCurrentLoadingProcess('loading-object', '...');
  await this.wait(100);
  await EngineLoader.loadObject();

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

  Engine.setCurrentTodo('engine-ready');
  this.setProgress(100);
};
// --------------------------------------------------------------------------------
EngineLoader.loadEngine = async function(){
  await this.loadScript(this.PATH, this.ENGINE + '.js');
}
EngineLoader.loadModule = async function(){
  for(let i = 0; i < this.MODULE_LIST.length; i++){
    await this.loadScript(this.MODULE, this.MODULE_LIST[i] + '.js');
  }
}
EngineLoader.loadCore = async function(){
  for(let i = 0; i < this.CORE_LIST.length; i++){
    await this.loading(100, 'loading-core', '：' + this.CORE_LIST[i]);
    await this.loadScript(this.CORE, this.CORE_LIST[i] + '.js');
  }
};
EngineLoader.loadObject = async function(){
  for(let i = 0; i < this.OBJECT_LIST.length; i++){
    await this.loading(100, 'loading-object', '：' + this.OBJECT_LIST[i]);
    await this.loadScript(this.OBJECT, this.OBJECT_LIST[i] + '.js');
  }
};
EngineLoader.loadManager = async function(){
  for(let i = 0; i < this.MANAGER_LIST.length; i++){
    await this.loading(100, 'loading-manager', '：' + this.MANAGER_LIST[i] );
    await this.loadScript(this.MANAGER, this.MANAGER_LIST[i] + '.js');
  }
};
EngineLoader.loadTool = async function(){
  for(let i = 0; i < this.TOOL_LIST.length; i++){
    await this.loading(100, 'loading-tool', '：' + this.TOOL_LIST[i]);
    await this.loadScript(this.TOOL, this.TOOL_LIST[i] + '.js');
  }
};
EngineLoader.loadPlugin = async function(){
  for(let i = 0; i < this.PLUGIN_LIST.length; i++){
    await this.loading(100, 'loading-plugin', '：' + this.PLUGIN_LIST[i]);
    await this.loadScript(this.PLUGIN, this.PLUGIN_LIST[i]);
  }
};
// --------------------------------------------------------------------------------
EngineLoader.wait = function(time){
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
EngineLoader.loading = async function(loading_time, id, text){
  this.loadingProgress();
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
EngineLoader.loadingProgress = function(){
  let length = this.MODULE_LIST.length + this.CORE_LIST.length + this.OBJECT_LIST.length +
    this.MANAGER_LIST.length + this.TOOL_LIST.length + this.PLUGIN_LIST.length;
  this.addProgress(100 / length);
};
EngineLoader.setProgress = function(value){
  this._progress = value;
  Engine.progress(this._progress);
};
EngineLoader.addProgress = function(value){
  this._progress += value;
  Engine.progress(this._progress);
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
