// PolygonGroup.prototype.isLineInPolygon = function(dot1, dot2, points){
//   let a = points.indexOf(dot1);
//   let b = points.indexOf(dot2);
//   if(a < 0 || b < 0) return false;
//   if((a === 0 && b === points.length - 1) || (a === points.length - 1 && b === 0)) return true;
//   return Math.abs(a - b) === 1;
// };
// PolygonGroup.prototype.hasCommonLine = function(points_1, points_2){
//   let a, b;
//   for(let i = 0; i < points_1.length; i++){
//     if (i === points_1.length - 1) {
//       a = i; b = 0;
//     }else{
//       a = i; b = i + 1;
//     }
//     if(this.isLineInPolygon(points_1[a], points_1[b], points_2)){
//       return true;
//     }
//   }
//   return false;
// };
// PolygonGroup.prototype.getGroupBFS = function(map){
//   let visited = new Array(map.length);
//   for(let i = 0; i < visited.length; i++) {
//     visited[i] = false;
//   }
//   let queue = [];
//   let polygons = [];
//   for(let i = 0; i < visited.length; i++){
//     if(!visited[i]){
//       polygons.push([]);
//       queue.push(i);
//       visited[i] = true;
//       while(queue.length !== 0) {
//         let target = queue.shift();
//         polygons[polygons.length - 1].push(target);
//         for (let j = 0; j < map[target].length; j++) {
//           if (map[target][j] && !visited[j]) {
//             queue.push(j);
//             visited[j] = true;
//           }
//         }
//       }
//     }
//   }
//   return polygons;
// };
// PolygonGroup.prototype.mergePolygon = function(polygon_1, polygon_2){
//   let common_dots = [];
//   let start_dot = null;
//   for(let i = 0; i < polygon_1.length; i++) {
//     if(polygon_2.indexOf(polygon_1[i]) !== -1){
//       common_dots.push(polygon_1[i]);
//     }else{
//       start_dot = polygon_1[i];
//     }
//   }
//   let polygon = [start_dot];
//   let index = polygon_1.indexOf(start_dot);
//   let now = 1;
//   let scan = 1;
//   let target;
//   while(true){
//     index += scan;
//     if(now === 1) {
//       if(index < 0) index = polygon_1.length - 1;
//       if(index > polygon_1.length - 1) index = 0;
//       target = polygon_1[index];
//       if(target === start_dot) break;
//       if(common_dots.indexOf(target) === -1){
//         polygon.push(target);
//       }else{
//         polygon.push(target);
//         now = 2;
//         index = polygon_2.indexOf(target);
//         scan = common_dots.indexOf(polygon_2[((index + 1) % polygon_2.length)]) === -1 ? 1 : -1;
//       }
//     }else if(now === 2) {
//       if(index < 0) index = polygon_2.length - 1;
//       if(index > polygon_2.length - 1) index = 0;
//       target = polygon_2[index];
//       if(target === start_dot) break;
//       if(common_dots.indexOf(target) === -1){
//         polygon.push(target);
//       }else{
//         polygon.push(target);
//         now = 1;
//         index = polygon_1.indexOf(target);
//         scan = common_dots.indexOf(polygon_1[((index + 1) % polygon_1.length)]) === -1 ? 1 : -1;
//       }
//     }
//   }
//   return polygon;
// };
// PolygonGroup.prototype.mergePoints = function(points){
//   let polygon_map = [];
//   for(let i = 0; i < points.length; i++) {
//     polygon_map.push(new Array(points.length));
//   }
//   for(let i = 0; i < polygon_map.length; i++) {
//     for (let j = 0; j < polygon_map[i].length; j++) {
//       polygon_map[i][j] = false;
//     }
//   }
//   for(let i = 0; i < points.length; i++) {
//     for (let j = i + 1; j < points.length; j++) {
//       if (this.hasCommonLine(points[i], points[j])){
//         polygon_map[i][j] = true;
//         polygon_map[j][i] = true;
//       }
//     }
//   }
//   let polygon_group = this.getGroupBFS(polygon_map);
//   let points_group = [];
//   for(let i = 0; i < polygon_group.length; i++){
//     points_group.push(points[polygon_group[i].splice(0, 1)]);
//     while(polygon_group[i].length > 0){
//       for(let j = 0; j < polygon_group[i].length; j++){
//         if(this.hasCommonLine(points_group[i], points[polygon_group[i][j]])){
//           points_group[i] = this.mergePolygon(points_group[i], points[polygon_group[i].splice(j, 1)]);
//           break;
//         }
//       }
//     }
//   }
//   return points_group;
// };
