// ================================================================================
// * Input <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2020/03/14 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * Input
// --------------------------------------------------------------------------------
function Input(){
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Mapper
// --------------------------------------------------------------------------------
Input.keyMapper = {
  8: 'BackSpace',
  9: 'Tab',
  12: 'Clear',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: 'Space',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'LeftArrow',
  38: 'UpArrow',
  39: 'RightArrow',
  40: 'DownArrow',
  41: 'Select',
  42: 'Print',
  43: 'Execute',
  45: 'Insert',
  46: 'Delete',
  47: 'Help',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'A',
  66: 'B',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  71: 'G',
  72: 'H',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  78: 'N',
  79: 'O',
  80: 'P',
  81: 'Q',
  82: 'R',
  83: 'S',
  84: 'T',
  85: 'U',
  86: 'V',
  87: 'W',
  88: 'X',
  89: 'Y',
  90: 'Z',
  96: 'Numpad0',
  97: 'Numpad1',
  98: 'Numpad2',
  99: 'Numpad3',
  100: 'Numpad4',
  101: 'Numpad5',
  102: 'Numpad6',
  103: 'Numpad7',
  104: 'Numpad8',
  105: 'Numpad9',
  106: 'NumpadMultiply',
  107: 'NumpadAdd',
  108: 'NumpadEnter',
  109: 'NumpadSubtract',
  110: 'NumpadDecimal',
  111: 'NumpadDivide',
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12',
  124: 'F13',
  125: 'F14',
  126: 'F15',
  127: 'F16',
  128: 'F17',
  129: 'F18',
  130: 'F19',
  131: 'F20',
  132: 'F21',
  133: 'F22',
  134: 'F23',
  135: 'F24',
  136: 'NumLock',
  137: 'ScrollLock',
  144: 'NumLock',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  // 210: plusminus hyphen macron
  // 212: copyright registered
  // 213: guillemotleft guillemotright
  // 214: masculine ordfeminine
  // 215: ae AE
  // 216: cent yen
  // 217: questiondown exclamdown
  // 218: onequarter onehalf threequarters
  219: '[',
  220: '\\',
  221: ']',
  222: '\'',
  // 227: multiply division
  // 228: acircumflex Acircumflex
  // 229: ecircumflex Ecircumflex
  // 230: icircumflex Icircumflex
  // 231: ocircumflex Ocircumflex
  // 232: ucircumflex Ucircumflex
  // 233: ntilde Ntilde
  // 234: yacute Yacute
  // 235: oslash Ooblique
  // 236: aring Aring
  // 237: ccedilla Ccedilla
  // 238: thorn THORN
  // 239: eth ETH
  // 240: diaeresis cedilla currency
  // 241: agrave Agrave atilde Atilde
  // 242: egrave Egrave
  // 243: igrave Igrave
  // 244: ograve Ograve otilde Otilde
  // 245: ugrave Ugrave
  // 246: adiaeresis Adiaeresis
  // 247: ediaeresis Ediaeresis
  // 248: idiaeresis Idiaeresis
  // 249: odiaeresis Odiaeresis
  // 250: udiaeresis Udiaeresis
  // 251: ssharp question backslash
  // 252: asciicircum degree
  // 253: 3 sterling
  // 254: Mode_switch
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Input.LONG_HOLD_TIME = 5;
// --------------------------------------------------------------------------------
Input._handlers = {};
Input._currentState = {};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Input.initialize = function() {
  this.clear();
  this._setupEventHandlers();
};
Input.clear = function() {
  this._currentState = {};
};
Input._setupEventHandlers = function(){
  document.addEventListener('keydown', (event) => {this._onKeyDown.call(this, event)});
  document.addEventListener('keyup', (event) => {this._onKeyUp.call(this, event)});
  window.addEventListener('blur', (event) => {this._onLostFocus.call(this, event)});
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Input.getKeyCode = function(code) {
  return this.keyMapper[code];
}
// --------------------------------------------------------------------------------
Input._onKeyDown = function(event) {
  if (this._shouldPreventDefault(event.keyCode)) {
    event.preventDefault();
  }
  if (event.keyCode === 144) {    // NumLock
    this.clear();
  }
  let buttonName = this.keyMapper[event.keyCode];
  if (buttonName) {
    if(!this._currentState[buttonName]){
      this.callHandler(event, 'key_down', buttonName);
      this._currentState[buttonName] = 1;
    }else{
      this._currentState[buttonName] ++;
      if(this._currentState[buttonName] === Input.LONG_HOLD_TIME){
        this.callHandler(event, 'key_long_hold', buttonName);
      }
    }
  }
  this.callHandler(event, 'key_hold', buttonName);
};
Input._onKeyUp = function(event) {
  let buttonName = this.keyMapper[event.keyCode];
  if (buttonName) {
    if(this._currentState[buttonName] > 0){
      this.callHandler(event, 'key_click', buttonName);
    }
    this._currentState[buttonName] = 0;
  }
  if (event.keyCode === 0) {  // For QtWebEngine on OS X
    this.clear();
  }
  this.callHandler(event, 'key_up', buttonName);
};
Input._onLostFocus = function() {
  this.clear();
};
Input._shouldPreventDefault = function(keyCode) {
  switch (keyCode) {
    //case 8:     // backspace
    case 33:    // pageup
    case 34:    // pagedown
    case 37:    // left arrow
    case 38:    // up arrow
    case 39:    // right arrow
    case 40:    // down arrow
      return true;
  }
  return false;
};
// --------------------------------------------------------------------------------
Input.addHandler = function(handler){
  this._handlers[handler.id] = handler;
};
Input.removeHandler = function(id){
  this._handlers.remove(id);
};
Input.callHandler = function(event, type, buttonName){
  for(let key in this._handlers){
    if(this._handlers[key].type === type &&
      (this._handlers[key].key_code === 'all' || this._handlers[key].key_code === buttonName)){
      this._handlers[key].callback.call(this._handlers[key], event);
    }
  }
}
// --------------------------------------------------------------------------------
Input.isPressed = function(keyName) {
  return !!this._currentState[keyName];
};
// ================================================================================
