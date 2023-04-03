import co from './canv/canv.js'
import genCPD from './canv/controlPanel.js'

// co stands for canvas object, its where we will be storing our state

document.addEventListener("DOMContentLoaded", function() {
  co.resizeCanv();
  document.body.appendChild(genCPD(co));
  document.body.appendChild(co.canv);
  window.requestAnimationFrame(co.draw);
});
