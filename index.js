import { default as co } from './canv/canv.js'
import { deselectAll } from './canv/canvClick.js'

// cPD stand for control panel div
// co stands for context

document.addEventListener("DOMContentLoaded", function() {

  // DOM initialization
  const cPD = document.createElement("div");
  cPD.id = "controlPanelDiv";
  const strokes = ["Select", "Line", "Pen"];
  strokes.forEach( val => {
    const b = document.createElement("button");
    b.id = `${val}-Button`
    b.classList.add('toolButton');
    b.innerHTML = val;
    b.onclick = (e) => {
      document.querySelectorAll('.toolButton').forEach(e => e.classList.remove('toolButtonSelected'));
      e.target.classList.add('toolButtonSelected')
      deselectAll(co);
      co.clickCounter = 0;
      co.selectedTool = val;
    }
    cPD.appendChild(b);
  });
  document.body.appendChild(cPD);

  window.onresize = co.resizeCanv;
  co.resizeCanv();

  document.body.appendChild(co.canv);

  window.requestAnimationFrame(co.draw);
});
