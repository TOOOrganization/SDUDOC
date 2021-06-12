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
//   2021/04/19 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * AutoPolygon
// --------------------------------------------------------------------------------
function AutoPolygon(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
AutoPolygon.getTempDots = function(point){
  if (!point) return null;
  let temp = [null, null, null, null];
  let temp_distance = [-1, -1, -1, -1];
  let dots = ElementManager.getFilteredElements(Dot2D.TAG);
  for(let id in dots){
    let delta = dots[id].getPoint().minus(point);
    let distance = dots[id].getPoint().distance(point);
    let target = delta.x > 0 ? (delta.y > 0 ? 0 : 3) : (delta.y > 0 ? 1 : 2)
    if(temp_distance[target] < 0 || distance < temp_distance[target]){
      temp[target] = id;
      temp_distance[target] = distance;
    }
  }
  if(temp[0] && temp[1] && temp[2] && temp[3]){
    return temp;
  }
  return null;
};
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Todo, id: 'plugin-todo-auto-polygon', dictionary:[
      { id: 'zh-cn', text: ['【移动】按下中键+拖动。【缩放】滚动鼠标中键。【新增多边形】将鼠标放在四个点中间，并按下鼠标左键。【移除多边形】右键单击一个多边形。'] },
      { id: 'zh-tw', text: ['【移動】按下中鍵+拖動。【縮放】滾動鼠標中鍵。【新增多邊形】將鼠標放在四個點中間，並按下鼠標左鍵。【移除多邊形】右鍵單擊一個多邊形。'] },
      { id: 'en-us', text: ['[Move]: Press & Drag. [Scale]: Mousewheel. [Add Polygon]: Left click. [Remove Polygon]:Right click.'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'plugin-tooltip-auto-polygon', dictionary:[
      { id: 'zh-cn', text: ['自动多边形工具'] },
      { id: 'zh-tw', text: ['自動多邊形工具'] },
      { id: 'en-us', text: ['Auto Polygon2D Tool'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('auto-polygon', 'plugin-tooltip-auto-polygon', 'mdi-shape-polygon-plus', Tool.Slot.PLUGIN, {
  on_click: function() {
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-todo-auto-polygon');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('auto-polygon.onMouseLeftClick', 'left_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;
    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length > 0) return;

    let temp = AutoPolygon.getTempDots(Graphics.getSourcePoint(new Point(event.layerX, event.layerY)));
    if(temp){
      let polygon_object = ElementManager.makeElement(Polygon2D.TAG, [DocumentManager.getCurrentPageId()], temp);
      DocumentManager.addElementWithUpdate(Polygon2D.TAG, polygon_object);
    }
  })
);
ToolManager.addHandler(new Handler('auto-polygon.onMouseRightClick', 'right_click', false, Engine,
  function(event){
    if(DocumentManager.getCurrentPage() <= 0) return;

    let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
    if(collide_list.length === 0) {
      Graphics.refresh();
      return;
    }
    DocumentManager.removeElementWithUpdate(Polygon2D.TAG, collide_list[0]);
  })
);
ToolManager.addHandler(new Handler('auto-polygon.onMouseMove', 'mousemove', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('auto-polygon.onMouseOut', 'mouseout', false, Engine,
  function(event){
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('auto-polygon.polygon.collide', '', 21, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0){
    let polygon_object = ElementManager.getElement(Polygon2D.TAG, collide_list[0]);
    Graphics.renderPolygonCollide(Graphics.getRenderPolygon(polygon_object.getPolygon()));
  }
}));
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('auto-polygon.mouse', '', 39, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Polygon2D.TAG, 1);
  if(collide_list.length > 0) return;
  let temp = AutoPolygon.getTempDots(Graphics.getMouseSourcePoint());
  if(temp){
    let points = temp;
    for(let i = 0; i < points.length; i++){
      points[i] = ElementManager.getElement(Dot2D.TAG, points[i]).getPoint();
    }
    Graphics.renderPolygonVirtual(Graphics.getRenderPolygon(new Polygon(points)));
  }
}));
// ================================================================================
