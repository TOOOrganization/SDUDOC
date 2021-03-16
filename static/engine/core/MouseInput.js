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
  this._setupEventHandlers();
};
MouseInput.clear = function() {
  this._over_target = false;
  this._over_overall = false;
  this._pressed_target = [false, false, false];
  this._pressed_overall = [false, false, false];
  this._point_target = new Point(0, 0);
  this._point_overall = new Point(0, 0);
};
MouseInput._setupEventHandlers = function(){
  document.addEventListener('click', (event) => {this._onClick.call(this, event, true)});
  document.addEventListener('dblclick', (event) => {this._onDoubleClick.call(this, event, true)});
  document.addEventListener('mousedown', (event) => {this._onMouseDown.call(this, event, true)});
  document.addEventListener('mouseup', (event) => {this._onMouseUp.bind(this, event, true)});
  document.addEventListener('mousemove', (event) => {this._onMouseMove.call(this, event, true)});
  document.addEventListener('mouseover', (event) => {this._onMouseOver.call(this, event, true)});
  document.addEventListener('mouseout', (event) => {this._onMouseOut.call(this, event, true)});
  document.addEventListener('wheel', (event) => {this._onWheel.call(this, event, true)});
};
MouseInput.setupTargetHandlers = function(target){
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
    // this._onMiddleButtonClick(event, overall);
  } else if (event.button === 2) {
    // this._onRightButtonClick(event, overall);
  }
};
MouseInput._onLeftButtonClick = function(event, overall){
  this.callHandler(event, 'left_click', overall);
};
MouseInput._onMiddleButtonClick = function(event, overall){
  this.callHandler(event, 'middle_click', overall);
};
MouseInput._onRightButtonClick = function(event, overall){
  this.callHandler(event, 'right_click', overall);
};
// --------------------------------------------------------------------------------
MouseInput._onDoubleClick = function(event, overall) {
  if (event.button === 0) {
    this._onLeftButtonDoubleClick(event, overall);
  } else if (event.button === 1) {
    // this._onMiddleButtonDoubleClick(event, overall);
  } else if (event.button === 2) {
    // this._onRightButtonDoubleClick(event, overall);
  }
};
MouseInput._onLeftButtonDoubleClick = function(event, overall){
  this.callHandler(event, 'left_double_click', overall);
};
MouseInput._onMiddleButtonDoubleClick = function(event, overall){
  this.callHandler(event, 'middle_double_click', overall);
};
MouseInput._onRightButtonDoubleClick = function(event, overall){
  this.callHandler(event, 'right_double_click', overall);
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
  this.callHandler(event, 'left_down', overall);
};
MouseInput._onMiddleButtonDown = function(event, overall){
  this.callHandler(event, 'middle_down', overall);
};
MouseInput._onRightButtonDown = function(event, overall){
  this.callHandler(event, 'right_down', overall);
};
// --------------------------------------------------------------------------------
MouseInput._onMouseUp = function(event, overall){
  if (event.button === 0) {
    this._onLeftButtonUp(event, overall);
  } else if (event.button === 1) {
    this._onMiddleButtonUp(event, overall);
  } else if (event.button === 2) {
    this._onRightButtonUp(event, overall);
  }
  this._pressed_overall[event.button] = false;
  this._pressed_target[event.button] = false;
};
MouseInput._onLeftButtonUp = function(event, overall){
  this.callHandler(event, 'left_up', overall);
};
MouseInput._onMiddleButtonUp = function(event, overall){
  this.callHandler(event, 'middle_up', overall);
  if(this._pressed_overall[event.button] && overall){
    this.callHandler(event, 'middle_click', overall);
  }else if(this._pressed_target[event.button] && !overall){
    this.callHandler(event, 'middle_click', overall);
  }
};
MouseInput._onRightButtonUp = function(event, overall){
  this.callHandler(event, 'right_up', overall);
  if(this._pressed_overall[event.button] && overall){
    this.callHandler(event, 'right_click', overall);
  }else if(this._pressed_target[event.button] && !overall){
    this.callHandler(event, 'right_click', overall);
  }
};
// --------------------------------------------------------------------------------
MouseInput._onMouseMove = function(event, overall){
  this.callHandler(event, 'mousemove', overall);
  this._point_overall = new Point(event.pageX, event.pageY);
  this._point_target = this._over_target ? new Point(event.layerX, event.layerY) : null;
};
MouseInput._onMouseOver = function(event, overall){
  if (overall) this._over_overall = true;
  if (!overall) this._over_target = true;
  this.callHandler(event, 'mouseover', overall);
};
MouseInput._onMouseOut = function(event, overall){
  if (overall) this._over_overall = false;
  if (!overall) this._over_target = false;
  if (!overall) this._pressed_target = [false, false, false];
  if (!overall) this._point_target = null;
  this.callHandler(event, 'mouseout', overall);
};
MouseInput._onWheel = function(event, overall){
  this.callHandler(event, 'wheel', overall);
};
// --------------------------------------------------------------------------------
MouseInput.addHandler = function(handler){
  this._handlers[handler.id] = handler;
};
MouseInput.removeHandler = function(id){
  this._handlers.remove(id);
};
MouseInput.callHandler = function(event, type, overall){
  for(let i in this._handlers){
    if(this._handlers[i].type === type && overall === this._handlers[i].overall){
      this._handlers[i].callback.call(this._handlers[i].owner, event);
    }
  }
}
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
