import handleClick from './canvClick.js'
import { deselectAll, getStrokeUnderCursor, unhoverAll } from './select.js'

const co = {
  canv: document.createElement("canvas"),
  funcQ: [],
  selectedTool: null,
  clickCounter: 0,
  timeStamp: 0,
  oldTimeStamp: 0,
  secondsPassed: 0,
  fps: 0,
  cursorX: innerWidth / 2,
  cursorY: innerHeight / 2,
  showGrid: false,
  gridSize: 10,
};

document.addEventListener("mousemove", (e) => {
  co.cursorX = (Math.floor(e.clientX - co.canv.getBoundingClientRect().left)-1);
  co.cursorY = (Math.floor(e.clientY - co.canv.getBoundingClientRect().top)-1);
});

co.canv.id = "canv";
co.canv.onclick = handleClick(co);
co.ctx = co.canv.getContext("2d");

co.resizeCanv = () => {
  co.canv.width = window.innerWidth * .895;
  co.canv.height = window.innerHeight * .98;
}

window.onresize = co.resizeCanv;

co.draw = (ts) => {
  co.timeStamp = ts;
  co.ctx.clearRect(0, 0, co.canv.width, co.canv.height);

  unhoverAll(co);
  if ( (co.selectedTool === "Select") && (co.clickCounter === 0 || co.clickCounter === 1) ) {
    const uc = getStrokeUnderCursor(co);
    if (uc !== undefined) uc.hovered = true;
  }

  if (co.showGrid) {
    co.ctx.save();
    co.ctx.lineWidth = 0;
    co.ctx.fillStyle = "grey";
    for (let h=0; h<=co.canv.height; h=h+co.gridSize) {
      for (let w=0; w<=co.canv.width; w=w+co.gridSize) {
        co.ctx.fillRect(w, h, 1, 1);
      }
    }
    co.ctx.restore();
  }




  for (const f of co.funcQ) f.func();
  window.requestAnimationFrame(co.draw);
};

export default co;
