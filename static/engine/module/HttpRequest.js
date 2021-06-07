// ================================================================================
// * HttpRequest <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/06/03 - Version 2.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * HttpRequest
// --------------------------------------------------------------------------------
function HttpRequest() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
HttpRequest.BASE_URL = 'http://211.87.232.197:8080/';
// --------------------------------------------------------------------------------
HttpRequest.TOKEN_KEY = 'zmw';
// --------------------------------------------------------------------------------
HttpRequest.OFFLINE_TEST = false;
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.ResponseStatus, id: 200, dictionary:[
      { id: 'zh-cn', text: ['操作成功'] },
      { id: 'zh-tw', text: ['操作成功'] },
      { id: 'en-us', text: ['操作成功'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 500, dictionary:[
      { id: 'zh-cn', text: ['操作失败'] },
      { id: 'zh-tw', text: ['操作失败'] },
      { id: 'en-us', text: ['操作失败'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 404, dictionary:[
      { id: 'zh-cn', text: ['参数检验失败'] },
      { id: 'zh-tw', text: ['参数检验失败'] },
      { id: 'en-us', text: ['参数检验失败'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 401, dictionary:[
      { id: 'zh-cn', text: ['暂未登录或token已经过期'] },
      { id: 'zh-tw', text: ['暂未登录或token已经过期'] },
      { id: 'en-us', text: ['暂未登录或token已经过期'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 403, dictionary:[
      { id: 'zh-cn', text: ['没有相关权限'] },
      { id: 'zh-tw', text: ['没有相关权限'] },
      { id: 'en-us', text: ['没有相关权限'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10000, dictionary:[
      { id: 'zh-cn', text: ['用户名未找到'] },
      { id: 'zh-tw', text: ['用户名未找到'] },
      { id: 'en-us', text: ['用户名未找到'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10001, dictionary:[
      { id: 'zh-cn', text: ['用户不存在'] },
      { id: 'zh-tw', text: ['用户不存在'] },
      { id: 'en-us', text: ['用户不存在'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10002, dictionary:[
      { id: 'zh-cn', text: ['用户头像上传失败'] },
      { id: 'zh-tw', text: ['用户头像上传失败'] },
      { id: 'en-us', text: ['用户头像上传失败'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10003, dictionary:[
      { id: 'zh-cn', text: ['角色不存在'] },
      { id: 'zh-tw', text: ['角色不存在'] },
      { id: 'en-us', text: ['角色不存在'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10004, dictionary:[
      { id: 'zh-cn', text: ['角色存储失败'] },
      { id: 'zh-tw', text: ['角色存储失败'] },
      { id: 'en-us', text: ['角色存储失败'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10005, dictionary:[
      { id: 'zh-cn', text: ['密码错误'] },
      { id: 'zh-tw', text: ['密码错误'] },
      { id: 'en-us', text: ['密码错误'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10006, dictionary:[
      { id: 'zh-cn', text: ['登录成功'] },
      { id: 'zh-tw', text: ['登录成功'] },
      { id: 'en-us', text: ['登录成功'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10007, dictionary:[
      { id: 'zh-cn', text: ['用户已存在'] },
      { id: 'zh-tw', text: ['用户已存在'] },
      { id: 'en-us', text: ['用户已存在'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10008, dictionary:[
      { id: 'zh-cn', text: ['密码为空'] },
      { id: 'zh-tw', text: ['密码为空'] },
      { id: 'en-us', text: ['密码为空'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10009, dictionary:[
      { id: 'zh-cn', text: ['两次密码不匹配'] },
      { id: 'zh-tw', text: ['两次密码不匹配'] },
      { id: 'en-us', text: ['两次密码不匹配'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 10010, dictionary:[
      { id: 'zh-cn', text: ['密码更新成功'] },
      { id: 'zh-tw', text: ['密码更新成功'] },
      { id: 'en-us', text: ['密码更新成功'] }
    ]
  }, {
    type: Language.Type.ResponseStatus, id: 20003, dictionary:[
      { id: 'zh-cn', text: ['服务器内部网络波动，图片请求失败'] },
      { id: 'zh-tw', text: ['服务器内部网络波动，图片请求失败'] },
      { id: 'en-us', text: ['服务器内部网络波动，图片请求失败'] }
    ]
  }
]);
// --------------------------------------------------------------------------------
// * Process
// --------------------------------------------------------------------------------
HttpRequest.processError = function(error){
  console.log(error);
  return false;
};
HttpRequest.processResponse = function(response){
  console.log(response);
  return false;
};
// --------------------------------------------------------------------------------
// * Axios
// --------------------------------------------------------------------------------
HttpRequest.postJsonWithHead = function(url, json){
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
HttpRequest.uploadWebPage = function(src, filename){
  return new Promise((resolve) => {
    if(HttpRequest.OFFLINE_TEST) {
      resolve(src);
      return;
    }
    HttpRequest.postJson('img/save_by_base64', {
      base64 : src,
      filename: filename
    }).then(response => {
      HttpRequest.processResponse(response);
      let src_link = HttpRequest.BASE_URL + 'img/get_by_id?id=' + response.data.data;
      resolve(src_link);
    }).catch(error => {
      HttpRequest.processError(error);
      resolve(error);
    });
  });
};

// --------------------------------------------------------------------------------
HttpRequest.Login = function(username, password){
  return new Promise((resolve) => {
    HttpRequest.post('user/login', {
      username: username,
      password: password
    }).then(response => {
      HttpRequest.processResponse(response);
      let token = JSON.parse(response.data.data).token;
      localStorage.setItem(HttpRequest.TOKEN_KEY, 'zmw' + JSON.parse(response.data.data).token);
      resolve(response);
      // let data = response.data;
      // console.log(response.data);
      // localStorage.setItem('zmw', 'zmw' + JSON.parse(response.data.data).token);
      // resolve(response.data);
    }).catch(error => {
      HttpRequest.processError(error);
      resolve(error);
    });
  });
};
HttpRequest.upLoadDocument = function(json){
  return new Promise((resolve) => {
    HttpRequest.postJsonWithHead('doc/insert_sdudoc', json).then(response => {
      HttpRequest.processResponse(response);
      resolve(response);
    }).catch(error => {
      HttpRequest.processError(error);
      resolve(error);
    });
  });
};
// HttpRequest.upLoadDocument = function(json){
//   return new Promise((resolve) => {
//     Engine.getPackages().axios({
//       method: 'post',
//       url: HttpRequest.BASE_URL + 'doc/insert_sdudoc',
//       data: Engine.getPackages().qs.stringify(json),
//       headers: {
//         'content-type': 'application/json',
//         'Access-Control-Allow-Origin': 'http://211.87.232.197'
//       },
//       responseType: 'json'
//     }).then(response => {
//       HttpRequest.processResponse(response);
//       resolve(response.data);
//     }).catch(error => {
//       HttpRequest.processError(error);
//       resolve(null);
//     });
//   });
// };
// --------------------------------------------------------------------------------
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
// ================================================================================
