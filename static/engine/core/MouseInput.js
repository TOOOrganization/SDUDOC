// ================================================================================
// * MouseInput <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/13 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * MouseInput
// --------------------------------------------------------------------------------
function MouseInput() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
MouseInput.Mouse = {
  LEFT: 0, MIDDLE: 1, RIGHT: 2
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
MouseInput._handlers = {};
MouseInput._over_target = false;
MouseInput._over_overall = false;
MouseInput._pressed_target = [];
MouseInput._pressed_overall = [];
MouseInput._point_target = null;
MouseInput._point_overall = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
MouseInput.initialize = function() {
  this.clear();
  this._setupEventHandlers(Engine.canvas);
};
MouseInput.clear = function() {
  MouseInput._over_target = false;
  MouseInput._over_overall = false;
  MouseInput._pressed_target = [false, false, false];
  MouseInput._pressed_overall = [false, false, false];
  MouseInput._point_target = new Point(0, 0);
  MouseInput._point_overall = new Point(0, 0);
};
MouseInput._setupEventHandlers = function(target){
  document.addEventListener('click', (event) => {this._onClick.call(this, event, true)});
  document.addEventListener('dblclick', (event) => {this._onDoubleClick.call(this, event, true)});
  document.addEventListener('mousedown', (event) => {this._onMouseDown.call(this, event, true)});
  document.addEventListener('mouseup', (event) => {this._onMouseUp.bind(this, event, true)});
  document.addEventListener('mousemove', (event) => {this._onMouseMove.call(this, event, true)});
  document.addEventListener('mouseover', (event) => {this._onMouseOver.call(this, event, true)});
  document.addEventListener('mouseout', (event) => {this._onMouseOut.call(this, event, true)});
  document.addEventListener('wheel', (event) => {this._onWheel.call(this, event, true)});
  target.addEventListener('click', (event) => {this._onClick.call(this, event, false)});
  target.addEventListener('dblclick', (event) => {this._onDoubleClick.call(this, event, false)});
  target.addEventListener('mousedown', (event) => {this._onMouseDown.call(this, event, false)});
  target.addEventListener('mouseup', (event) => {this._onMouseUp.call(this, event, false)});
  target.addEventListener('mousemove', (event) => {this._onMouseMove.call(this, event, false)});
  target.addEventListener('mouseover', (event) => {this._onMouseOver.call(this, event, false)});
  target.addEventListener('mouseout', (event) => {this._onMouseOut.call(this, event, false)});
  target.addEventListener('wheel', (event) => {this._onWheel.call(this, event, false)});
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
MouseInput._onClick = function(event, overall) {
  if (event.button === 0) {
    this._onLeftButtonClick(event, overall);
  } else if (event.button === 1) {
    this._onMiddleButtonClick(event, overall);
  } else if (event.button === 2) {
    this._onRightButtonClick(event, overall);
  }
};
MouseInput._onLeftButtonClick = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'leftclick' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onMiddleButtonClick = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'middleclick' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onRightButtonClick = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'rightclick' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
// --------------------------------------------------------------------------------
MouseInput._onDoubleClick = function(event, overall) {
  if (event.button === 0) {
    this._onLeftButtonDoubleClick(event, overall);
  } else if (event.button === 1) {
    this._onMiddleButtonDoubleClick(event, overall);
  } else if (event.button === 2) {
    this._onRightButtonDoubleClick(event, overall);
  }
};
MouseInput._onLeftButtonDoubleClick = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'leftdoubleclick' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onMiddleButtonDoubleClick = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'middledoubleclick' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onRightButtonDoubleClick = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'rightdoubleclick' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
// --------------------------------------------------------------------------------
MouseInput._onMouseDown = function(event, overall) {
  this._pressed_overall[event.button] = true;
  if(!overall) this._pressed_target[event.button] = true;
  if (event.button === 0) {
    this._onLeftButtonDown(event, overall);
  } else if (event.button === 1) {
    this._onMiddleButtonDown(event, overall);
  } else if (event.button === 2) {
    this._onRightButtonDown(event, overall);
  }
};
MouseInput._onLeftButtonDown = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'leftdown' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onMiddleButtonDown = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'middledown' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onRightButtonDown = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'rightdown' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
// --------------------------------------------------------------------------------
MouseInput._onMouseUp = function(event, overall){
  this._pressed_overall[event.button] = false;
  this._pressed_target[event.button] = false;
  if (event.button === 0) {
    this._onLeftButtonUp(event, overall);
  } else if (event.button === 1) {
    this._onMiddleButtonUp(event, overall);
  } else if (event.button === 2) {
    this._onRightButtonUp(event, overall);
  }
};
MouseInput._onLeftButtonUp = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'leftup' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onMiddleButtonUp = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'middleup' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onRightButtonUp = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'rightup' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
// --------------------------------------------------------------------------------
MouseInput._onMouseMove = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'mousemove' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
  this._point_overall = new Point(event.pageX, event.pageY);
  this._point_target = new Point(event.layerX, event.layerY);
};
MouseInput._onMouseOver = function(event, overall){
  if (overall) this._over_overall = true;
  if (!overall) this._over_target = true;
  for(let i in this._handlers){
    if(this._handlers[i].type === 'mouseover' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onMouseOut = function(event, overall){
  if (overall) this._over_overall = false;
  if (!overall) this._over_target = false;
  if (!overall) this._pressed_target = [false, false, false];
  for(let i in this._handlers){
    if(this._handlers[i].type === 'mouseout' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
MouseInput._onWheel = function(event, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === 'wheel' && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
};
// --------------------------------------------------------------------------------
MouseInput.addHandler = function(handler){
  this._handlers[handler.id] = handler;
};
MouseInput.removeHandler = function(id){
  this._handlers.remove(id);
};
// --------------------------------------------------------------------------------
MouseInput.isPressed = function(id){
  return this._pressed_target[id];
};
MouseInput.isPressedOverall = function(id){
  return this._pressed_overall[id];
};
MouseInput.isOver = function(){
  return this._over_target;
};
MouseInput.isOverall = function(){
  return this._over_overall;
};
MouseInput.getMousePoint = function(){
  return this._point_target;
};
MouseInput.getMousePointOverall = function(){
  return this._point_overall;
};
// ================================================================================
