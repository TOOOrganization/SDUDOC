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
HttpRequest.BASE_URL = 'http://211.87.232.197:8081/sdudoc/';
// --------------------------------------------------------------------------------
HttpRequest.OFFLINE_TEST = true;
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
HttpRequest.uploadWebPage = function(src, filename){
  return new Promise((resolve) => {
    if(HttpRequest.OFFLINE_TEST) {
      resolve(src);
      return;
    }
    Engine.getPackages().axios({
      method: 'post',
      url: HttpRequest.BASE_URL + 'img/save_by_base64',
      data: {
        base64 : src,
        filename: filename
      },
      headers: {'content-type': "application/json"},
      responseType: 'json'
    }).then(response => {
      let src_link = HttpRequest.BASE_URL + 'img/get_by_id?id=' + response.data;
      resolve(src_link);
    }).catch(error => {
      console.log(error);
      resolve(error);
    });
  });
};
// --------------------------------------------------------------------------------
HttpRequest.upLoadDocument = function(json){
  return new Promise((resolve) => {
    Engine.getPackages().axios({
      method: 'post',
      url: HttpRequest.BASE_URL + 'doc/insert_sdudoc',
      data: json,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': 'http://211.87.232.197'
      },
      responseType: 'json'
    }).then(response => {
      resolve(response.data);
    }).catch(error => {
      console.log(error);
      resolve(null);
    });
  });
};
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
      headers: {'content-type': "application/json"},
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
      headers: {'content-type': "application/json"},
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
