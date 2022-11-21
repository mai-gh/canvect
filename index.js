import { default as co } from './canv/canv.js'
import { deselectAll } from './canv/canvClick.js'

document.addEventListener("DOMContentLoaded", function() {

  // DOM initialization
  const cPD = document.createElement("div");
  cPD.id = "controlPanelDiv";
  const strokes = ["Select", "Line", "Pen"];
//  const strokeSelectList = document.createElement("select");
//  strokeSelectList.id = "strokeSelectList";
//  cPD.appendChild(strokeSelectList);
//  strokes.forEach((element, key) => {strokeSelectList[key] = new Option(element, element)});
  strokes.forEach( val => {
    const b = document.createElement("button");
    b.classList.add('toolButton');
    b.innerHTML = val;
    b.onclick = (e) => {
      //document.querySelectorAll('button').forEach(e => e.style.color = 'black');
      document.querySelectorAll('button').forEach(e => e.classList.remove('toolButtonSelected'));
//      console.log(e)
//      e.target.style.color = 'blue';
      e.target.classList.add('toolButtonSelected')
      deselectAll(co);
      co.clickCounter = 0;
      co.selectedTool = val;
    ;}
    cPD.appendChild(b);
  });
  document.body.appendChild(cPD);

  co.canv.width = window.innerWidth - (window.innerWidth * .09) - 8;
  co.canv.height = window.innerHeight - 6; 
  document.body.appendChild(co.canv);

//  strokeSelectList.onchange = () => {
//    deselectAll(co);
//    co.clickCounter = 0;
//  };

  window.requestAnimationFrame(co.draw);
});
