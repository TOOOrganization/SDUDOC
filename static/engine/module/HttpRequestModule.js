// ================================================================================
// * HttpRequestModule <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/06/03 - Version 2.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * HttpRequestModule
// --------------------------------------------------------------------------------
function HttpRequestModule() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
HttpRequestModule.BASE_URL = 'http://211.87.232.197:8081/sdudoc/';
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
HttpRequestModule.uploadWebPage = function(src, filename){
  return new Promise((resolve) => {
    Engine.getPackages().axios({
      method: 'post',
      url: HttpRequestModule.BASE_URL + 'img/save_by_base64',
      data: {
        base64 : src,
        filename: filename
      },
      headers: {'content-type': "application/json"},
      responseType: 'json'
    }).then(response => {
      let src_link = HttpRequestModule.BASE_URL + 'img/get_by_id?id=' + response.data;
      resolve(src_link);
    }).catch(error => {
      console.log(error);
      resolve(error);
    });
  });
};
// --------------------------------------------------------------------------------
HttpRequestModule.upLoadDocument = function(json){
  return new Promise((resolve) => {
    Engine.getPackages().axios({
      method: 'post',
      url: HttpRequestModule.BASE_URL + 'doc/insert_sdudoc',
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
HttpRequestModule.loadCloudDocument = async function(token, index){
  await new Promise((resolve) => {
    Engine.getPackages().axios({
      method: 'post',
      url: HttpRequestModule.BASE_URL + 'img/save_by_base64',
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
HttpRequestModule.saveCloudDocument = async function(token, index, filename, src){
  await new Promise((resolve) => {
    Engine.getPackages().axios({
      method: 'post',
      url: HttpRequestModule.BASE_URL + 'img/save_by_base64',
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
