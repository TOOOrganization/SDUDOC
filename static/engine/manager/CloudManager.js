// ================================================================================
// * CloudManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * CloudManager
// --------------------------------------------------------------------------------
function CloudManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
CloudManager._cloud_document_list = [];
CloudManager._current_cloud_document = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
CloudManager.initializeEditor = function(editor){
  this.updateCloudDocumentData();
};
// --------------------------------------------------------------------------------
// * CloudDocument
// --------------------------------------------------------------------------------
CloudManager.updateCloudDocumentData = function(){
  HttpRequest.getCloudDocumentList().then(function(list){
    CloudManager.setCloudDocumentList(list);
    Engine.updateEditorCloudDocumentData();
  });
}
// --------------------------------------------------------------------------------
CloudManager.setCloudDocumentList = function(list){
  return this._cloud_document_list = list || CloudManager._cloud_document_list;
}
CloudManager.getCloudDocumentList = function(){
  return this._cloud_document_list;
}
CloudManager.getCurrentCloudDocument = function(){
  return this._current_cloud_document;
}
// --------------------------------------------------------------------------------
CloudManager.openCloudDocument = function(index){
  if (index === 0){
    HttpRequest.newCloudDocument();
  } else {
    let filename = this._cloud_document_list[index].filename;
    HttpRequest.openCloudDocument(filename);
  }
};
// ================================================================================
