OptionManager.addOption(new Option('line.continue2', 'line', Option.Type.INT_SLIDE, 'option-line-continue', 0, {
  min: 0, max:100, step:5}, function(){

}));
OptionManager.addOption(new Option('line.continue3', 'line', Option.Type.INT_INPUT, 'option-line-continue', 0, {
  min: 0, max:100, step:5}, function(){

}));
OptionManager.addOption(new Option('line.continue1', 'dot', Option.Type.INT_INPUT, 'option-line-continue', 0, {}, function(){}));
OptionManager.addOption(new Option('line.continue2', 'dot', Option.Type.BOOLEAN, 'option-line-continue', true, {}, function(){

}));
OptionManager.addOption(new Option('line.continue3', 'dot', Option.Type.INT_SLIDE, 'option-line-continue', 0, {}, function(){}));
OptionManager.addOption(new Option('line.continue1', 'move', Option.Type.INT_SLIDE, 'option-line-continue', 0, {}, function(){}));
OptionManager.addOption(new Option('line.continue2', 'move', Option.Type.INT_INPUT, 'option-line-continue', 0, {}, function(){}));
OptionManager.addOption(new Option('line.continue3', 'move', Option.Type.BOOLEAN, 'option-line-continue', true, {}, function(){

}));
/*
Input.addHandler(new Handler('Input.onMouseDown1', 'key_down', 'M', Engine, function(event){
  console.log('key_down')
}.bind(Engine)));
Input.addHandler(new Handler('Input.onMouseDown2', 'key_up', 'M', Engine, function(event){
  console.log('key_up')
}.bind(Engine)));
Input.addHandler(new Handler('Input.onMouseDown3', 'key_long_hold', 'M', Engine, function(event){
  console.log('key_long_hold')
}.bind(Engine)));
Input.addHandler(new Handler('Input.onMouseDown4', 'key_hold', 'M', Engine, function(event){
  console.log('key_hold')
}.bind(Engine)));
Input.addHandler(new Handler('Input.onMouseDown5', 'key_click', 'M', Engine, function(event){
  console.log('key_click')
}.bind(Engine)));
*/

// ToolManager.addTool(new Tool('cut', '剪切工具', 'mdi-scissors-cutting', Tool.Slot.PLUGIN, function(){
//
// }));
// ToolManager.addTool(new Tool('comment', '注释工具', 'mdi-tooltip-plus-outline', Tool.Slot.PLUGIN, function(){
//
// }));


/*








HttpRequest.a = function(){
  let head = {};
  let headers = {
    'Content-Type': 'application/json'
  };
  Engine.getPackages().axios({
    method: 'post',
    url:'http://localhost:7000',
    data: {
      'msgid' : 'LOGIN_REQ'
    },
    head: head,
    headers: headers,
    responseType: 'json'
  }).then(response => {
    console.log(response);
  }).catch(error => {
    HttpRequest.processError(error);
  });
}












// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
//HttpRequest.BASE_URL = 'http://211.87.232.197:8080/';
// --------------------------------------------------------------------------------
//HttpRequest.TOKEN_KEY = 'zmw';
// --------------------------------------------------------------------------------
//HttpRequest.OFFLINE_TEST = false;
// --------------------------------------------------------------------------------
// * Axios
// --------------------------------------------------------------------------------
HttpRequest.postJsonWithHead = function(url, json){
  Engine.progressAuto();
  let head = {};
  let headers = {
    'content-type': 'application/json'
  };
  head[HttpRequest.TOKEN_KEY] = localStorage.getItem(HttpRequest.TOKEN_KEY);
  headers[HttpRequest.TOKEN_KEY] = localStorage.getItem(HttpRequest.TOKEN_KEY);
  return Engine.getPackages().axios({
    method: 'post',
    url: HttpRequest.BASE_URL + url,
    data: json,
    head: head,
    headers: headers,
    responseType: 'json'
  });
};
HttpRequest.postJson = function(url, json){
  Engine.progressAuto();
  let headers = {
    'content-type': 'application/json'
  };
  headers[HttpRequest.TOKEN_KEY] = localStorage.getItem(HttpRequest.TOKEN_KEY);
  return Engine.getPackages().axios({
    method: 'post',
    url: HttpRequest.BASE_URL + url,
    data: json,
    headers: headers,
    responseType: 'json'
  });
};
HttpRequest.post = function(url, json){
  Engine.progressAuto();
  let head = {};
  head[HttpRequest.TOKEN_KEY] = localStorage.getItem(HttpRequest.TOKEN_KEY);
  return Engine.getPackages().axios({
    method: 'post',
    url: HttpRequest.BASE_URL + url,
    data: Engine.getPackages().qs.stringify(json),
    head: head,
    responseType: 'json'
  });
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
HttpRequest.uploadWebPage = function(filename, src){
  return new Promise((resolve) => {
    if(HttpRequest.OFFLINE_TEST) {
      resolve(src);
      return;
    }
    HttpRequest.postJson('img/save_by_base64', {
      base64 : src,
      filename: filename
    }).then(response => {
      if(HttpRequest.processResponse(response)){
        let src_link = HttpRequest.BASE_URL + 'img/get_by_id?id=' + response.data.data;
        resolve(src_link);
      }else{
        resolve();
      }
    }).catch(error => {
      HttpRequest.processError(error);
      resolve();
    });
  });
};

// --------------------------------------------------------------------------------
HttpRequest.Login = function(username, password){
  HttpRequest.a();
  return new Promise((resolve) => {
    HttpRequest.post('user/login', {
      username: username,
      password: password
    }).then(response => {
      if(HttpRequest.processResponse(response)){
        let token = JSON.parse(response.data.data).token;
        localStorage.setItem(HttpRequest.TOKEN_KEY, 'zmw' + token);
      }
      Engine.progress(100);
      resolve();
      // let data = response.data;
      // console.log(response.data);
      // localStorage.setItem('zmw', 'zmw' + JSON.parse(response.data.data).token);
      // resolve(response.data);
    }).catch(error => {
      HttpRequest.processError(error);
      resolve();
    });
  });
};
HttpRequest.upLoadDocument = function(json){
  return new Promise((resolve) => {
    HttpRequest.postJsonWithHead('doc/insert_sdudoc', json).then(response => {
      HttpRequest.processResponse(response);
      Engine.progress(100);
      resolve();
    }).catch(error => {
      HttpRequest.processError(error);
      resolve();
    });
  });
};
// --------------------------------------------------------------------------------
// * Unused
// --------------------------------------------------------------------------------
HttpRequest.loadCloudDocument = async function(token, index){
  await new Promise((resolve) => {
    Engine.getPackages().axios({
      method: 'post',
      url: HttpRequest.BASE_URL + 'img/save_by_base64',
      data: {
        token: token,
        index: index
      },
      headers: {'content-type': 'application/json'},
      responseType: 'json'
    }).then(response => {
      resolve(response.data);
    }).catch(error => {
      console.log(error);
      resolve(null);
    });
  });
};
HttpRequest.saveCloudDocument = async function(token, index, filename, src){
  await new Promise((resolve) => {
    Engine.getPackages().axios({
      method: 'post',
      url: HttpRequest.BASE_URL + 'img/save_by_base64',
      data: {
        token: token,
        index: index,
        base64 : src,
        filename: filename
      },
      headers: {'content-type': 'application/json'},
      responseType: 'json'
    }).then(response => {
      resolve(response.data);
    }).catch(error => {
      console.log(error);
      resolve(null);
    });
  });
};
 */
