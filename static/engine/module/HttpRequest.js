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
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Notice, id: 'request-failed', dictionary:[
      { id: 'zh-cn', text: ['网络异常，服务暂不可用'] },
      { id: 'zh-tw', text: ['網絡異常，服務暫不可用'] },
      { id: 'en-us', text: ['Network exception, the service is temporarily unavailable'] }
    ]
  }, {
    type: Language.Type.Notice, id: 200, dictionary:[
      { id: 'zh-cn', text: ['操作成功'] },
      { id: 'zh-tw', text: ['操作成功'] },
      { id: 'en-us', text: ['Operation successful'] }
    ]
  }, {
    type: Language.Type.Notice, id: 500, dictionary:[
      { id: 'zh-cn', text: ['操作失败'] },
      { id: 'zh-tw', text: ['操作失敗'] },
      { id: 'en-us', text: ['Operation failed'] }
    ]
  }, {
    type: Language.Type.Notice, id: 404, dictionary:[
      { id: 'zh-cn', text: ['参数检验失败'] },
      { id: 'zh-tw', text: ['參數檢驗失敗'] },
      { id: 'en-us', text: ['Parameter verification failed'] }
    ]
  }, {
    type: Language.Type.Notice, id: 401, dictionary:[
      { id: 'zh-cn', text: ['暂未登录或token已经过期'] },
      { id: 'zh-tw', text: ['暫未登錄或token已經過期'] },
      { id: 'en-us', text: ['Not login / Token has expired'] }
    ]
  }, {
    type: Language.Type.Notice, id: 403, dictionary:[
      { id: 'zh-cn', text: ['没有相关权限'] },
      { id: 'zh-tw', text: ['沒有相關權限'] },
      { id: 'en-us', text: ['No operate permission'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10000, dictionary:[
      { id: 'zh-cn', text: ['无效的用户名'] },
      { id: 'zh-tw', text: ['無效的用戶名'] },
      { id: 'en-us', text: ['Invalid username'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10001, dictionary:[
      { id: 'zh-cn', text: ['用户不存在'] },
      { id: 'zh-tw', text: ['用戶不存在'] },
      { id: 'en-us', text: ['User not found'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10002, dictionary:[
      { id: 'zh-cn', text: ['用户头像上传失败'] },
      { id: 'zh-tw', text: ['用戶頭像上傳失敗'] },
      { id: 'en-us', text: ['Upload user avatar failed'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10003, dictionary:[
      { id: 'zh-cn', text: ['角色不存在'] },
      { id: 'zh-tw', text: ['角色不存在'] },
      { id: 'en-us', text: ['User role not found'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10004, dictionary:[
      { id: 'zh-cn', text: ['角色存储失败'] },
      { id: 'zh-tw', text: ['角色存儲失敗'] },
      { id: 'en-us', text: ['Save user role failed'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10005, dictionary:[
      { id: 'zh-cn', text: ['密码错误'] },
      { id: 'zh-tw', text: ['密碼錯誤'] },
      { id: 'en-us', text: ['Wrong password'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10006, dictionary:[
      { id: 'zh-cn', text: ['登录成功'] },
      { id: 'zh-tw', text: ['登錄成功'] },
      { id: 'en-us', text: ['Login success'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10007, dictionary:[
      { id: 'zh-cn', text: ['用户已存在'] },
      { id: 'zh-tw', text: ['用戶已存在'] },
      { id: 'en-us', text: ['User already exists'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10008, dictionary:[
      { id: 'zh-cn', text: ['密码为空'] },
      { id: 'zh-tw', text: ['密碼為空'] },
      { id: 'en-us', text: ['Invalid password'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10009, dictionary:[
      { id: 'zh-cn', text: ['两次密码不匹配'] },
      { id: 'zh-tw', text: ['兩次密碼不匹配'] },
      { id: 'en-us', text: ['Input passwords not match'] }
    ]
  }, {
    type: Language.Type.Notice, id: 10010, dictionary:[
      { id: 'zh-cn', text: ['密码更新成功'] },
      { id: 'zh-tw', text: ['密碼更新成功'] },
      { id: 'en-us', text: ['Update password success'] }
    ]
  }, {
    type: Language.Type.Notice, id: 20003, dictionary:[
      { id: 'zh-cn', text: ['服务器内部网络波动，图片请求失败'] },
      { id: 'zh-tw', text: ['服務器內部網絡波動，圖片請求失敗'] },
      { id: 'en-us', text: ['Network exception, upload image failed'] }
    ]
  }
]);
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
HttpRequest.MAIN_SERVER_URL = 'http://localhost:7000';
HttpRequest.SUB_SERVER_URL = 'null';
// --------------------------------------------------------------------------------
HttpRequest.TOKEN_KEY = 'token';
// --------------------------------------------------------------------------------
HttpRequest.OFFLINE_TEST = false;
// --------------------------------------------------------------------------------
// * Process
// --------------------------------------------------------------------------------
HttpRequest.processError = function(error){
  Engine.progress(100);
  if (error.response) {
    if(Language.get(Language.Type.Notice, error.response.status)) {
      Engine.noticeWarning(error.response.status);
    } else {
      Engine.noticeWarning('request-failed');
    }
  } else {
    Engine.noticeWarning('request-failed');
  }
  console.log(error);
};
HttpRequest.processResponse = function(response){
  if(response.status !== 200){
    Engine.noticeWarning('request-failed');
    return false;
  }else{
    if(response.data.code === 200){
      Engine.noticeSuccess(200, true);
      return true;
    }else if(Language.get(Language.Type.Notice, response.data.code)){
      Engine.noticeWarning(response.data.code);
      return false;
    }else{
      Engine.noticeWarning('request-failed');
      return false;
    }
  }
};
// --------------------------------------------------------------------------------
// * Axios
// --------------------------------------------------------------------------------
HttpRequest.postMain = function(cs_msg){
  Engine.progressAuto();
  let head = {};
  head[HttpRequest.TOKEN_KEY] = localStorage.getItem(HttpRequest.TOKEN_KEY);
  let headers = {
    'content-type': 'application/json'
  };
  return Engine.getPackages().axios({
    method: 'post',
    url: HttpRequest.MAIN_SERVER_URL,
    data: cs_msg,
    head: head,
    headers: headers,
    responseType: 'json'
  })
};
HttpRequest.postSub = function(cs_msg){
  Engine.progressAuto();
  let head = {};
  head[HttpRequest.TOKEN_KEY] = localStorage.getItem(HttpRequest.TOKEN_KEY);
  let headers = {
    'content-type': 'application/json'
  };
  return Engine.getPackages().axios({
    method: 'post',
    url: HttpRequest.SUB_SERVER_URL,
    data: cs_msg,
    head: head,
    headers: headers,
    responseType: 'json'
  })
};
// --------------------------------------------------------------------------------
HttpRequest.messageMain = function(cs_msg){
  return new Promise((resolve) => {
    HttpRequest.postMain(cs_msg).then(response => {
      Engine.progress(100);
      if(HttpRequest.processResponse(response)){
        resolve(HttpRequest.processMessage(cs_msg, response.data.sc_msg));
      }else{
        resolve();
      }
    }).catch(error => {
      HttpRequest.processError(error);
      resolve();
    });
  });
};
HttpRequest.messageSub = function(cs_msg){
  return new Promise((resolve) => {
    HttpRequest.postSub(cs_msg).then(response => {
      Engine.progress(100);
      if(HttpRequest.processResponse(response)){
        resolve(HttpRequest.processMessage(cs_msg, response.data.sc_msg));
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
// * Process Message
// --------------------------------------------------------------------------------
HttpRequest.processMessage = function(cs_msg, sc_msg){
  let msg_id = sc_msg.msg_id;
  let process_func = HttpRequest['msg_' + msg_id];
  return (!process_func || typeof process_func !== 'function') ? {} : process_func(cs_msg, sc_msg);
};
// --------------------------------------------------------------------------------
HttpRequest.msg_LOGIN_RSP = function(cs_msg, sc_msg){
  localStorage.setItem(HttpRequest.TOKEN_KEY, sc_msg.token);
};
HttpRequest.msg_LOGOUT_RSP = function(cs_msg, sc_msg){
  localStorage.removeItem(HttpRequest.TOKEN_KEY);
};
// --------------------------------------------------------------------------------
// * Process Message
// --------------------------------------------------------------------------------
HttpRequest.Login = function(username, password){
  return HttpRequest.messageMain({
    msg_id: 'LOGIN_REQ',
    username: username,
    password: password,
  });
};
HttpRequest.Logout = function(username, password){
  return HttpRequest.messageMain({
    msg_id: 'LOGOUT_REQ',
  });
};
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
// ================================================================================
