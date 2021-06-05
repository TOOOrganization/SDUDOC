// ================================================================================
// * ColorManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/06/03 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * ColorManager
// --------------------------------------------------------------------------------
function ColorManager() {
  throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
ColorManager.RGBToHex = function(r, g, b){
  return (r << 16) + (g << 8) + b;
}
// ================================================================================