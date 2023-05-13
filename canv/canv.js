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
  scale: 1,
  translatePos: { x: 0, y: 0 },

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

co.canv.onwheel = (e) => {
  if (e.wheelDelta > 0) {
    co.translatePos.x += co.cursorX
    co.translatePos.y += co.cursorY
    co.scale += .1
    //co.ctx.scale(2, 2)
  } else {
    co.translatePos.x -= co.cursorX
    co.translatePos.y -= co.cursorY
    co.scale -= .1
    //co.ctx.scale(.5, .5)
  }
  console.log(e)
}

co.draw = (ts) => {
  co.timeStamp = ts;
  co.ctx.clearRect(0, 0, co.canv.width, co.canv.height);

  unhoverAll(co);
  if ( (co.selectedTool === "Select") && (co.clickCounter === 0 || co.clickCounter === 1) ) {
    const uc = getStrokeUnderCursor(co);
    if (uc !== undefined) uc.hovered = true;
  }

  co.ctx.scale(1, 1);
  if (co.showGrid) {
    co.ctx.save();
    co.ctx.lineWidth = 0;
    co.ctx.fillStyle = "grey";
    for (let h=-0.5; h<=co.canv.height; h=h+co.gridSize) {
      for (let w=-0.5; w<=co.canv.width; w=w+co.gridSize) {
        co.ctx.fillRect(w, h, 1, 1);
      }
    }
    co.ctx.restore();
  }


//  co.ctx.translate(co.translatePos.x, co.translatePos.y);
  co.translatePos = { x: 0, y: 0 };
  co.ctx.scale(co.scale, co.scale);
  co.scale = 1

  for (const f of co.funcQ) f.func();
  window.requestAnimationFrame(co.draw);
};

export default co;
