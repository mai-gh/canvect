import { default as canvClick, deselectAll } from './canvClick.js'

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
};

document.addEventListener("mousemove", (e) => {
  co.cursorX = Math.floor(e.clientX - co.canv.getBoundingClientRect().left);
  co.cursorY = Math.floor(e.clientY - co.canv.getBoundingClientRect().top);
});

co.canv.id = "canv";
co.canv.onclick = canvClick(co);
co.ctx = co.canv.getContext("2d");

co.resizeCanv = () => {
  co.canv.width = window.innerWidth * .895;
  co.canv.height = window.innerHeight * .98;
}

co.draw = (ts) => {
  co.timeStamp = ts;
  co.ctx.clearRect(0, 0, co.canv.width, co.canv.height);
  for (const f of co.funcQ) f.func();
  window.requestAnimationFrame(co.draw);
};

export default co;
