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
  cursorX_base: innerWidth / 2,
  cursorY_base: innerHeight / 2,
  cursorX: innerWidth / 2,
  cursorY: innerHeight / 2,
  snapCursorX: 0,
  snapCursorY: 0,
  modCursorX: 0,
  modCursorY: 0,
  showGrid: true,
  gridSize: 10,
  scale: 1,
  translatePos: { x: 0, y: 0 },
  offset: {x:0, y:0},
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
  co.cursorX -= co.baseOffset.x
  co.cursorY -= co.baseOffset.y
  //console.log(co.cursorX, co.cursorY)
//  if (co.selectedTool === "Scroll" && mouseDown === true) {
//          co.translatePos.x = evt.clientX - offset.x;
//          co.translatePos.y = evt.clientY - offset.y;
//  }

  updateStatusCo('a0', 'cursorX');
  updateStatusCo('b0', 'cursorY');

  updateStatusCo('a1', 'cursorX_base');
  updateStatusCo('b1', 'cursorY_base');

  updateStatusCo('a2', 'modCursorX');
  updateStatusCo('b2', 'modCursorY');

  updateStatusCo('a3', 'snapCursorX');
  updateStatusCo('b3', 'snapCursorY');

  updateStatus('a4', `baseOffset.x: ${co.baseOffset.x}`);
  updateStatus('b4', `baseOffset.y: ${co.baseOffset.y}`);

  updateStatus('a5', `offset.x: ${co.offset.x}`);
  updateStatus('b5', `offset.y: ${co.offset.y}`);



/*
baseOffset: Object { x: 0, y: 0 }
canv: <canvas id="canv" width="1218" height="552">
clickCounter: 0
ctx: CanvasRenderingContext2D { globalAlpha: 1, globalCompositeOperation: "source-over", strokeStyle: "#000000", … }
cursorX: 430
cursorX_base: 430
cursorY: 341
cursorY_base: 341
draw: function draw(ts)
fps: 0
funcQ: Array []
gridSize: 10
modCursorX: 429
modCursorY: 339
offset: Object { x: 0, y: 0 }
oldTimeStamp: 0
scale: 1
secondsPassed: 0
selectedTool: null
showGrid: true
snapCursorX: 429
snapCursorY: 339
*/

});

co.canv.id = "canv";
co.canv.onclick = handleClick(co);
co.ctx = co.canv.getContext("2d");

//co.resizeCanv = () => {
//  co.canv.width = window.innerWidth * .895;
//  co.canv.height = window.innerHeight * .98;
//}

//window.onresize = co.resizeCanv;

//const offset = {x:0, y:0}
let mouseDown = false;

      // add event listeners to handle screen drag
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
          co.translatePos.x = evt.clientX - co.offset.x;
          co.translatePos.y = evt.clientY - co.offset.y;
          co.offset.x = evt.clientX //- co.translatePos.x;
          co.offset.y = evt.clientY //- co.translatePos.y;
          co.baseOffset.x += co.translatePos.x
          co.baseOffset.y += co.translatePos.y
 //         draw(scale, translatePos);
        }
      });


//      canvas.addEventListener("mouseover", function(evt) {
//        mouseDown = false;
//      });
//
//      canvas.addEventListener("mouseout", function(evt) {
//        mouseDown = false;
//      });




co.canv.onwheel = (e) => {
  if (e.wheelDelta > 0) {
    //co.translatePos.x = (co.cursorX / 2)
    //co.translatePos.y = (co.cursorY / 2)
    //co.scale += .1
    //co.ctx.scale(2, 2)
  } else {
    //co.translatePos.x = -(co.cursorX/2)
    //co.translatePos.y = -(co.cursorY/2)
    //co.scale -= .1
    //co.ctx.scale(.5, .5)
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
  co.ctx.translate(co.translatePos.x, co.translatePos.y);
  co.translatePos = { x: 0, y: 0 };
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

  for (const f of co.funcQ) f.func();


  //if snap to grid

  co.ctx.scale(1, 1);
    co.ctx.save();
    co.ctx.setTransform(1, 0, 0, 1, 0, 0);
    co.ctx.lineWidth = 0;
    co.ctx.fillStyle = "yellow";

/*
    if (Math.abs(co.cursorX % co.gridSize) < Math.trunc(co.gridSize / 2)) {
      co.snapCursorX = co.cursorX - Math.abs(co.cursorX % co.gridSize) + (co.baseOffset.x % co.gridSize);
    } else {
      co.snapCursorX = co.cursorX - Math.abs(co.cursorX % co.gridSize) + co.gridSize + (co.baseOffset.x % co.gridSize);
    }
    if (Math.abs(co.cursorY % co.gridSize) < Math.trunc(co.gridSize / 2)) {
      co.snapCursorY = co.cursorY - Math.abs(co.cursorY % co.gridSize) + (co.baseOffset.y % co.gridSize);
    } else {
      co.snapCursorY = co.cursorY - Math.abs(co.cursorY % co.gridSize) + co.gridSize + (co.baseOffset.y % co.gridSize);
    }
*/


   if (Math.abs(co.cursorX % co.gridSize) < Math.trunc(co.gridSize / 2)) {
     co.snapCursorX = co.cursorX_base - Math.abs(co.cursorX_base % co.gridSize) + (co.baseOffset.x % co.gridSize) - 1;
   } else {
     co.snapCursorX = co.cursorX_base - Math.abs(co.cursorX_base % co.gridSize) + co.gridSize + (co.baseOffset.x % co.gridSize) - 1;
   }
   if (Math.abs(co.cursorY % co.gridSize) < Math.trunc(co.gridSize / 2)) {
     co.snapCursorY = co.cursorY_base - Math.abs(co.cursorY_base % co.gridSize) + (co.baseOffset.y % co.gridSize) - 1;
   } else {
     co.snapCursorY = co.cursorY_base - Math.abs(co.cursorY_base % co.gridSize) + co.gridSize + (co.baseOffset.y % co.gridSize) - 1;
   }
    
    co.modCursorX = co.snapCursorX
    co.modCursorY = co.snapCursorY


    co.ctx.fillRect(co.modCursorX, co.modCursorY, 2, 2);
    co.ctx.restore();

  window.requestAnimationFrame(co.draw);
};

export default co;
