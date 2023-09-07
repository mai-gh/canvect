import co from './canv/canv.js'
import genCPD from './canv/controlPanel.js'

// co stands for canvas object, its where we will be storing our state

document.addEventListener("DOMContentLoaded", function() {

  const rightDiv = document.createElement("div");
  const cmdDiv = document.createElement("div");
  rightDiv.id = 'rightDiv';
  cmdDiv.id = 'cmdDiv';

  rightDiv.appendChild(co.canv);
  rightDiv.appendChild(cmdDiv);
  document.body.appendChild(genCPD(co));
  document.body.appendChild(rightDiv);

  co.canv.width = co.canv.clientWidth;
  co.canv.height = co.canv.clientHeight;

  window.requestAnimationFrame(co.draw);
});
