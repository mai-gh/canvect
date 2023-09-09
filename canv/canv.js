import handleClick from './canvClick.js'
import { deselectAll, getStrokeUnderCursor, unhoverAll } from './select.js'
import {lineTemplate} from './line.js'

const co = {
  canv: document.createElement("canvas"),
  funcQ: [],
  selectedTool: null,
  clickCounter: 0,
  timeStamp: 0,
  oldTimeStamp: 0,
  secondsPassed: 0,
  fps: 0,
  cursorX: 0,
  cursorY: 0,
  cursorX_base: 0,
  cursorY_base: 0,
  modCursorX: 0,
  modCursorY: 0,
  modCursorX_base: 0,
  modCursorY_base: 0,
  showGrid: true,
  snapToGrid: true,
  gridSize: 10,
  scale: 1,
  transAmt: { x: 0, y: 0 },
  offset: {x:0, y:0},
  cursorSize: 2,
  baseOffset: {x:0, y:0}
};

window.co = co;

const updateStatus = (zone, text) => {
  const el = document.getElementById(`cmdTbl_${zone}`);
  el.innerText = text;
}

const updateStatusCo = (zone, entry) => {
  const el = document.getElementById(`cmdTbl_${zone}`);
  el.innerText = `${entry}: ${co[entry]}`;
}



document.addEventListener("mousemove", (e) => {
  co.cursorX_base = (Math.floor(e.clientX - co.canv.getBoundingClientRect().left)-1);
  co.cursorY_base = (Math.floor(e.clientY - co.canv.getBoundingClientRect().top)-1);
  co.cursorX = (Math.floor(e.clientX - co.canv.getBoundingClientRect().left)-1);
  co.cursorY = (Math.floor(e.clientY - co.canv.getBoundingClientRect().top)-1);
//  co.cursorX -= co.offset.x
//  co.cursorY -= co.offset.y

  co.cursorX -= co.baseOffset.x
  co.cursorY -= co.baseOffset.y

  if (co.snapToGrid) {
   if (Math.abs(co.cursorX % co.gridSize) <= Math.trunc(co.gridSize / 2)) {
     co.modCursorX_base = co.cursorX_base - Math.abs(co.cursorX_base % co.gridSize);
     co.modCursorX = co.cursorX - Math.abs(co.cursorX % co.gridSize);
   } else {
     co.modCursorX_base = co.cursorX_base - Math.abs(co.cursorX_base % co.gridSize) + co.gridSize;
     co.modCursorX = co.cursorX - Math.abs(co.cursorX % co.gridSize) + co.gridSize;
   }
   if (Math.abs(co.cursorY % co.gridSize) <= Math.trunc(co.gridSize / 2)) {
     co.modCursorY_base = co.cursorY_base - Math.abs(co.cursorY_base % co.gridSize);
     co.modCursorY = co.cursorY - Math.abs(co.cursorY % co.gridSize);
   } else {
     co.modCursorY_base = co.cursorY_base - Math.abs(co.cursorY_base % co.gridSize) + co.gridSize;
     co.modCursorY = co.cursorY - Math.abs(co.cursorY % co.gridSize) + co.gridSize;
   }
  } else {
    co.modCursorX_base = co.cursorX_base
    co.modCursorY_base = co.cursorY_base
    co.modCursorX = co.cursorX
    co.modCursorY = co.cursorY
  }
});



window.setInterval(function () {
  updateStatusCo('a0', 'cursorX');
  updateStatusCo('b0', 'cursorY');

  updateStatusCo('a1', 'cursorX_base');
  updateStatusCo('b1', 'cursorY_base');

  updateStatusCo('a2', 'modCursorX');
  updateStatusCo('b2', 'modCursorY');

  updateStatusCo('a3', 'modCursorX_base');
  updateStatusCo('b3', 'modCursorY_base');

  updateStatus('a4', `offset.x: ${co.offset.x}`);
  updateStatus('b4', `offset.y: ${co.offset.y}`);

  updateStatus('a5', `baseOffset.x: ${co.baseOffset.x}`);
  updateStatus('b5', `baseOffset.y: ${co.baseOffset.y}`);

  updateStatus('a6', `transAmt.x: ${co.transAmt.x}`);
  updateStatus('b6', `transAmt.y: ${co.transAmt.y}`);



//    if ($('input').val().length > 0) {
//        console.log('has changed, should call callback');
//        clearInterval(listen);
//    }
}, 1);

co.canv.id = "canv";
co.canv.onclick = handleClick(co);
co.ctx = co.canv.getContext("2d");

co.resizeCanv = () => {
  //co.canv.width = window.innerWidth * .895;
  //co.canv.height = window.innerHeight * .98;
  co.canv.width = co.canv.clientWidth;
  co.canv.height = co.canv.clientHeight;

}

window.onresize = co.resizeCanv;



      // add event listeners to handle screen drag
      let mouseDown = false;
      co.canv.addEventListener("mousedown", function(evt) {
        if (co.selectedTool === "Scroll") {
          mouseDown = true;
          co.offset.x = evt.clientX //- co.translatePos.x;
          co.offset.y = evt.clientY //- co.translatePos.y;
        }
      });

      co.canv.addEventListener("mouseup", function(evt) {
        mouseDown = false;
      });

      co.canv.addEventListener("mousemove", function(evt) {
        if (co.selectedTool === "Scroll" && mouseDown === true) {
          co.transAmt.x = evt.clientX - co.offset.x;
          co.transAmt.y = evt.clientY - co.offset.y;
          co.offset.x = evt.clientX //- co.translatePos.x;
          co.offset.y = evt.clientY //- co.translatePos.y;
          co.baseOffset.x += co.transAmt.x
          co.baseOffset.y += co.transAmt.y
 //         draw(scale, translatePos);
        }
      });



co.canv.onwheel = (e) => {
  if (e.wheelDelta > 0) {
  } else {
  }
//  console.log(e)
}

co.draw = (ts) => {
  co.timeStamp = ts;

  co.ctx.save();
  co.ctx.setTransform(1, 0, 0, 1, 0, 0);
  co.ctx.clearRect(0, 0, co.canv.width, co.canv.height);
  co.ctx.restore();

  unhoverAll(co);
  if ( (co.selectedTool === "Select") && (co.clickCounter === 0 || co.clickCounter === 1) ) {
    const uc = getStrokeUnderCursor(co);
    if (uc !== undefined) uc.hovered = true;
  }

  //co.ctx.save();
  co.ctx.translate(co.transAmt.x, co.transAmt.y);
  co.transAmt = { x: 0, y: 0 };
  //co.ctx.setTransform(1, 0, 0, 1, 0, 0);
    //co.offset = {x:0, y:0}
  //co.ctx.scale(co.scale, co.scale);
  co.scale = 1
  //co.ctx.restore();

  co.ctx.scale(1, 1);
  if (co.showGrid) {
    co.ctx.save();
    co.ctx.setTransform(1, 0, 0, 1, 0, 0);
    co.ctx.lineWidth = 0;
    co.ctx.fillStyle = "grey";
    for (let h=-0.5; h<=co.canv.height; h=h+co.gridSize) {
      for (let w=-0.5; w<=co.canv.width; w=w+co.gridSize) {
        co.ctx.fillRect(
          w + (co.baseOffset.x % co.gridSize),
          h + (co.baseOffset.y % co.gridSize),
          1,
          1
        );
      }
    }
    co.ctx.restore();
  }

/*
        const s = lineTemplate(co);
        s.sx = () => 0;
        s.sy = () => 0;
        s.lx = () => 10;
        s.ly = () => 10;
        s.path = new Path2D();
        s.path.moveTo(s.sx(), s.sy());
        s.path.lineTo(s.lx(), s.ly());
        s.editing = null;
        co.clickCounter = 0;
        deselectAll(co);
        co.funcQ.push(s);
*/

  for (const f of co.funcQ) f.func();


  // draw yellow dot cursor
  co.ctx.scale(1, 1);
  co.ctx.save();
  co.ctx.setTransform(1, 0, 0, 1, 0, 0);
  co.ctx.lineWidth = 0;
  co.ctx.fillStyle = "yellow";
  co.ctx.fillRect(
    co.modCursorX_base - (co.cursorSize/2) + (co.baseOffset.x % co.gridSize),
    co.modCursorY_base - (co.cursorSize/2) + (co.baseOffset.y % co.gridSize),
    co.cursorSize,
    co.cursorSize
  );
  co.ctx.restore();

  window.requestAnimationFrame(co.draw);
};

export default co;
