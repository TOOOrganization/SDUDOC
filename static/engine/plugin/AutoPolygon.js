// ================================================================================
// * AutoPolygon <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/04/19 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * AutoPolygonFactory
// ================================================================================
function AutoPolygonFactory(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
AutoPolygonFactory.getTempDots = function(point){
  let temp = [null, null, null, null];
  let temp_distance = [-1, -1, -1, -1];
  for(let i in SDUDocument.data["Dot2D"]){
    if(SDUDocument.data["Dot2D"][i].page === DocumentManager.getCurrentPageId()){
      let delta = SDUDocument.data["Dot2D"][i].minus(point);
      let distance = SDUDocument.data["Dot2D"][i].distance(point);
      let target = delta.x > 0 ? (delta.y > 0 ? 0 : 3) : (delta.y > 0 ? 1 : 2)
      if(temp_distance[target] < 0 || distance < temp_distance[target]){
        temp[target] = i;
        temp_distance[target] = distance;
      }
    }
  }
  if(temp[0] && temp[1] && temp[2] && temp[3]){
    return temp;
  }
  return null;
};
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// ================================================================================
ToolManager.addTool(new Tool("auto_polygon", "自动多边形工具", "mdi-shape-polygon-plus", Tool.Type.PLUGIN, "", function(id){
  ToolManager.setCurrentPlugin(id);
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler("auto_polygon.onLeftClick", "left_click", false, AutoPolygonFactory, function(event){
  let temp = AutoPolygonFactory.getTempDots(Graphics.getGridPoint(new Point(event.layerX, event.layerY)));
  if(temp){
    DocumentManager.addElement("Polygon2D", PolygonFactory.makeObject(
      DocumentManager.getCurrentPageId(), temp));
  }
}));
ToolManager.addHandler(new Handler("auto_polygon.onMouseMove", "mousemove", false, AutoPolygonFactory, function(event){
  Graphics.refresh();
}));
ToolManager.addHandler(new Handler("auto_polygon.onMouseOut", "mouseout", false, AutoPolygonFactory, function(event){
  Graphics.refresh();
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer("auto_polygon.mouse", 5, AutoPolygonFactory, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let mouse_point = MouseInput.getMousePoint();
  let temp = AutoPolygonFactory.getTempDots(Graphics.getGridPoint(mouse_point));
  if(temp){
    let points = temp;
    for(let i = 0; i < points.length; i++){
      points[i] = SDUDocument.data["Dot2D"][points[i]];
    }
    let polygon = new Polygon(points);
    polygon.fillCanvas(ctx, 'rgba(0, 0, 0, 0.3)');
  }
}));
// ================================================================================
