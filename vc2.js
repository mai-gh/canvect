const cPD = document.createElement("div");
cPD.id = "controlPanelDiv";
cPD.style.position = "absolute";
cPD.style.width = "15%";
cPD.style.top = "0";
cPD.style.bottom = "0";
cPD.style.left = "0";
cPD.style.right = "0";
cPD.appendChild(document.createTextNode("Control Panel"));

const strokes = ["lineTo", "selection", "quadraticCurveTo"];
const strokeSelectList = document.createElement("select");
strokeSelectList.id = "strokeSelectList";
cPD.appendChild(strokeSelectList);
strokes.forEach((element, key) => {
  strokeSelectList[key] = new Option(element, element);
});

const statusCheckbox = document.createElement("input");
statusCheckbox.type = "checkbox";
statusCheckbox.id = "statusCheckbox";
statusCheckbox.name = "statusCheckbox";
statusCheckbox.checked = true;
const statusCheckboxLabel = document.createElement("label");
statusCheckboxLabel.for = "statusCheckbox";
statusCheckboxLabel.appendChild(document.createTextNode("Show Status"));
cPD.appendChild(statusCheckboxLabel);
cPD.appendChild(statusCheckbox);

const canv = document.createElement("canvas");
canv.id = "canv";
canv.style.position = "absolute";
canv.style.top = "1%";
canv.style.left = "16%";
canv.style.right = "0";
canv.width = window.screen.width * 0.83;
canv.height = window.screen.height * 0.82;

document.body.appendChild(cPD);
document.body.appendChild(canv);

const cursor = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

addEventListener("mousemove", (e) => {
  cursor.x = Math.floor(e.clientX - canv.getBoundingClientRect().left);
  cursor.y = Math.floor(e.clientY - canv.getBoundingClientRect().top);
});

strokeSelectList.onchange = () => {
  deselectAll();
  clickCounter = 0;
};

const ctx = canv.getContext("2d");
ctx.lineWidth = 5;
const funcQ = [];
const deselectAll = () => {for (const s of funcQ) s.selected = false};
const getAllSelected = () => {
  const selArr = [];
  for (const s of funcQ) {
    if (s.selected) selArr.push(s);
  }
  return selArr;
};

const getStrokeUnderCursor = () => {
  for (const s of funcQ) {
    if (ctx.isPointInStroke(s.path, cursor.x, cursor.y)) {
      return s;
    }
  }
}


let clickCounter = 0;
canv.onclick = (e) => {
  clickCounter++;
  if (strokeSelectList.value === "lineTo") {
    if (clickCounter === 1) {
      funcQ.push({
        path: new Path2D(),
        time: timeStamp,
        selected: false,
        editing: true,
        sx: cursor.x,
        sy: cursor.y,
        lx: function () { return cursor.x; },
        ly: function () { return cursor.y; },
        startBox: null,
        endBox: null,
        boxColor: "Red",
        func: function () {
          ctx.save();
          if (this.selected) ctx.strokeStyle = "White";
          ctx.beginPath();
          ctx.moveTo(this.sx, this.sy);
          ctx.lineTo(this.lx(), this.ly());
          this.editing ? ctx.stroke() : ctx.stroke(this.path);
          if (this.selected) {
            ctx.strokeStyle = this.boxColor;
            ctx.lineWidth = 1; 
            const boxSize = 10;
            this.startBox = new Path2D();
            this.endBox = new Path2D();
            this.startBox.rect(this.sx - boxSize / 2, this.sy - boxSize / 2, boxSize, boxSize);
            this.endBox.rect(this.lx() - boxSize / 2, this.ly() - boxSize / 2, boxSize, boxSize);

            if (ctx.isPointInPath(this.startBox, cursor.x, cursor.y)) {
              ctx.stroke(this.endBox);
              ctx.strokeStyle = 'Yellow';
              ctx.stroke(this.startBox);
            } else if (ctx.isPointInPath(this.endBox, cursor.x, cursor.y)) {
              ctx.stroke(this.startBox);
              ctx.strokeStyle = 'Yellow';
              ctx.stroke(this.endBox);
            } else {
              ctx.stroke(this.startBox);
              ctx.stroke(this.endBox);
            }
            //ctx.fill(this.startBox);
            //ctx.fill(this.endBox);
          }
          ctx.restore();
        },
      });
    } else if (clickCounter === 2) {
      const lx = cursor.x;
      const ly = cursor.y;
      const s = funcQ[funcQ.length - 1];
      s.lx = () => lx;
      s.ly = () => ly;
      s.path.moveTo(s.sx, s.sy);
      s.path.lineTo(s.lx(), s.ly());
      s.editing = false;
      clickCounter = 0;
    }
  } else if (strokeSelectList.value === "selection") {
    if (clickCounter === 1) {
      deselectAll();
      for (const s of funcQ) {
        if (ctx.isPointInStroke(s.path, cursor.x, cursor.y)) {
          s.selected = true;
        }
      }
      if (getAllSelected().length === 1) {
      } else {
        clickCounter = 0;
      }
    } else if (clickCounter === 2) {
      if (getAllSelected().length === 1) {
        const [ps] = getAllSelected();
        const uc = getStrokeUnderCursor();
        console.log((ps === uc));
        //console.log(getStrokeUnderCursor())
//        if ((typeof uc === 'object') && ('selected' in uc) && (uc.selected)) {
        if (ps === uc) { // we are interacting with already selected item, but not the points ( maybe )
//          console.log(typeof getStrokeUnderCursor());
//          if (ctx.isPointInPath(uc.endBox, cursor.x, cursor.y)) {
//            uc.editing = true;
//            uc.lx = function () { return cursor.x; };
//            uc.ly = function () { return cursor.y; }
//          } 
        } else if (ctx.isPointInPath(ps.startBox, cursor.x, cursor.y)) {
            ps.editing = true;
            ps.sx = function () { return cursor.x; };
            ps.sy = function () { return cursor.y; };
        } else if (ctx.isPointInPath(ps.endBox, cursor.x, cursor.y)) {
            ps.editing = true;
            ps.lx = function () { return cursor.x; };
            ps.ly = function () { return cursor.y; };
          
          
        } else {
          deselectAll();
          clickCounter = 0;
        }
      }
    } else if (clickCounter === 3) {
      const lx = cursor.x;
      const ly = cursor.y;
      const [s] = getAllSelected();
      s.lx = () => lx;
      s.ly = () => ly;
      s.path = new Path2D();
      s.path.moveTo(s.sx, s.sy);
      s.path.lineTo(s.lx(), s.ly());
      s.editing = false;
      clickCounter = 0;
      deselectAll();
    }
  }
};

let timeStamp = 0;
let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;
const displayStatus = () => {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  fps = Math.round(1 / secondsPassed);
  const statusString = `X:${String(cursor.x).padStart(4, "0")} Y: ${String(cursor.y).padStart(4, "0")} FPS:${fps}`;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = "16px Monospace";
  ctx.fillStyle = "yellow";
  ctx.fillText(statusString, canv.width * 0.81, canv.height * 0.99);
  ctx.restore();
};

ctx.strokeStyle = "blue";
const draw = (ts) => {
  timeStamp = ts;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  //  ctx.clearRect(0, 0, canv.width, canv.height);
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canv.width, canv.height);

  if (statusCheckbox.checked) displayStatus();
  for (const f of funcQ) f.func();
  window.requestAnimationFrame(draw);
};

window.requestAnimationFrame(draw);
