// ================================================================================
// * Move <SDUDOC Engine Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Engine to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/14 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Move
// --------------------------------------------------------------------------------
function Move(){
  throw new Error('This is a static class');
}
// ================================================================================

// ================================================================================
// * Language
// --------------------------------------------------------------------------------
Language.addDictionaryList([
  {
    type: Language.Type.Todo, id: 'plugin-todo-move', dictionary:[
      { id: 'zh-cn', text: ['【移动】按下鼠标任意键+拖动。【缩放】滚动鼠标中键。'] },
      { id: 'zh-tw', text: ['【移動】按下鼠標任意鍵+拖動。【縮放】滾動鼠標中鍵。'] },
      { id: 'en-us', text: ['[Move]: Press & Drag. [Scale]: Mousewheel.'] }
    ]
  }, {
    type: Language.Type.ToolTip, id: 'plugin-tooltip-move', dictionary:[
      { id: 'zh-cn', text: ['移动工具'] },
      { id: 'zh-tw', text: ['移動工具'] },
      { id: 'en-us', text: ['Move Tool'] }
    ]
  }
]);
// ================================================================================

// ================================================================================
// * Register Plugin Tool
// --------------------------------------------------------------------------------
ToolManager.addTool(new Tool('move', 'plugin-tooltip-move', 'mdi-arrow-all', Tool.Slot.PLUGIN, {
  on_click: function(){
    ToolManager.setCurrentPlugin(this._id);
    Engine.setCurrentTodo('plugin-todo-move');
  }
}));
// --------------------------------------------------------------------------------
ToolManager.addHandler(new Handler('move.onMouseLeftDown', 'left_down', false, Engine,
  function(event){
    let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
    if(collide_list.length > 0) {
      let dot_object = ElementManager.getFilteredElement(Dot2D.TAG, collide_list[0])
      if(dot_object.type !== Dot2D.Type.INTERSECTION){
        SelectManager.selectObject(dot_object);
        dot_object._temp_before_move = dot_object.saveJson();
      }
    }
    Move.start = true;
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('move.onMouseLeftUp', 'left_up', false, Engine,
  function(event){
    if(SelectManager.isSelectedType(Dot2D.TAG)) {
      let dot_object = SelectManager.getSelectedObject();
      let json_old = dot_object._temp_before_move;
      let json_new = dot_object.saveJson();
      let page = DocumentManager.getCurrentPage();
      HistoryManager.push([new History(function(){
        dot_object.loadJson(json_old);
        Graphics.refresh();
      },function(){
        dot_object.loadJson(json_new);
        Graphics.refresh();
      }, page, page)], true).then();
    }
    Move.start = false;
    SelectManager.unSelect();
    Graphics.refresh();
  })
);
ToolManager.addHandler(new Handler('move.onMouseMove', 'mousemove', false, Engine,
  function(event){
    if(SelectManager.isSelectedType(Dot2D.TAG)) {
      let distance = new Point(event.layerX, event.layerY).minus(MouseInput.getMousePoint());
      let dot_object = ElementManager.getFilteredElement(Dot2D.TAG, SelectManager.getSelectedId());
      switch (dot_object.type){
        case Dot2D.Type.FREE:
          dot_object.move(Graphics.getScaledPoint(distance));
          break;
        case Dot2D.Type.DEPENDENT:
          dot_object.move(Graphics.getMouseSourcePoint());
          break;
      }
      Graphics.refresh();
      return;
    }
    if(!Move.start) {
      Graphics.refresh();
      return;
    }
    if(MouseInput.isPressed(MouseInput.Mouse.LEFT) || MouseInput.isPressed(MouseInput.Mouse.RIGHT)) {
      let distance = new Point(event.layerX, event.layerY).minus(MouseInput.getMousePoint());
      Graphics.moveOrigin(distance.x, distance.y);
      return;
    }
  })
);
ToolManager.addHandler(new Handler('move.onMouseOut', 'mouseout', false, Engine,
  function(event){
    if(SelectManager.isSelectedType(Dot2D.TAG)) {
      let dot_object = SelectManager.getSelectedObject();
      let json_old = dot_object._temp_before_move;
      let json_new = dot_object.saveJson();
      let page = DocumentManager.getCurrentPage();
      HistoryManager.push([new History(function(){
        dot_object.loadJson(json_old);
        Graphics.refresh();
      },function(){
        dot_object.loadJson(json_new);
        Graphics.refresh();
      }, page, page)], true).then();
    }
    Move.start = false;
    SelectManager.unSelect();
    Graphics.refresh();
  })
);
// ================================================================================

// ================================================================================
// * Register Renderer
// --------------------------------------------------------------------------------
RenderManager.addRenderer(new Renderer('move.dot.collide', '', 100, function(ctx){
  if(DocumentManager.getCurrentPage() <= 0) return;

  let collide_list = CollideManager.getCollideList(Dot2D.TAG, 1);
  if(collide_list.length > 0){
    let dot_object = ElementManager.getElement(Dot2D.TAG, collide_list[0]);
    if(dot_object.type !== Dot2D.Type.INTERSECTION){
      Graphics.renderPointCollide(Graphics.getRenderPoint(dot_object.getPoint()));
    }
  }
}));
// ================================================================================
