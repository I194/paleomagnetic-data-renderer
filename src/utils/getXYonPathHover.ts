// var svg = document.getElementById("svgDoc");
// 			var rect = svg.getElementById("line");
			
// 			var pt = svg.createSVGPoint();
			
			
// 			svg.addEventListener("mouseover", alert_click, false);
			
// 			function alert_click(evt) {
// 				var cursorpt = cursorPoint(evt, line);
// 				document.getElementById('d').innerHTML=cursorpt.x + " " + cursorpt.y;
// 			}

export const getXYonPathHover = (evt: MouseEvent, svg: any, element: any) => {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  
  if (element === null)
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  else
    return pt.matrixTransform(element.getScreenCTM().inverse());
}