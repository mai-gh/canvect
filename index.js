import { default as co } from './canv/canv.js'
import { deselectAll } from './canv/canvClick.js'

document.addEventListener("DOMContentLoaded", function() {

  // DOM initialization
  const cPD = document.createElement("div");
  cPD.id = "controlPanelDiv";
  const strokes = ["lineTo", "selection", "quadraticCurveTo"];
  const strokeSelectList = document.createElement("select");
  strokeSelectList.id = "strokeSelectList";
  cPD.appendChild(strokeSelectList);
  strokes.forEach((element, key) => {strokeSelectList[key] = new Option(element, element)});
  document.body.appendChild(cPD);

  co.canv.width = window.innerWidth - (window.innerWidth * .09) - 8;
  co.canv.height = window.innerHeight - 6; 
  document.body.appendChild(co.canv);

  strokeSelectList.onchange = () => {
    deselectAll(co);
    co.clickCounter = 0;
  };

  window.requestAnimationFrame(co.draw);
});
