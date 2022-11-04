


const cPD = document.createElement("div");
cPD.id = "controlPanelDiv";
cPD.style.position = "absolute";
cPD.style.width = "15%";
cPD.style.top = "0";
cPD.style.bottom = "0";
cPD.style.left = "0";
cPD.style.right = "0";
cPD.appendChild(document.createTextNode("Control Panel"));

const strokes = ['lineTo', 'selection', 'quadraticCurveTo'];
const strokeSelectList = document.createElement("select");
strokeSelectList.id = "strokeSelectList";
cPD.appendChild(strokeSelectList);
strokes.forEach((element,key) => {
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
//canv.style.width = "83%";
canv.style.top = "1%";
//canv.style.bottom = "0";
canv.style.left = "16%";
canv.style.right = "0";
canv.width = window.screen.width * .83
canv.height = window.screen.height * .82


document.body.appendChild(cPD);
document.body.appendChild(canv);




const cursor = {
  x: (innerWidth / 2),
  y: (innerHeight / 2),
  mousedown: false,
};



addEventListener("mousemove", (e) => {
  cursor.x = Math.floor(e.clientX - canv.getBoundingClientRect().left);
  cursor.y = Math.floor(e.clientY - canv.getBoundingClientRect().top);
});

/*
addEventListener("mousedown", (e) => {
  cursor.mousedown = true;
});

addEventListener("mouseup", (e) => {
  cursor.mousedown = false;
});
*/

//addEventListener("click", (e) => {
//  window.requestAnimationFrame(draw);
//  clicked = true;
//  console.log(e);
//  console.log("e.timeStamp:", e.timeStamp, "local timeStamp:", timeStamp);
//});

const ctx = canv.getContext('2d');
ctx.lineWidth = 5;
const funcQ = [];
const clickArr = [];

let clickCounter = 0;
let mtox = 0;
let mtoy = 0;
let selected = null;

canv.onclick = () => {
  clickCounter++;
  if (strokeSelectList.value === 'lineTo') {
    if (clickCounter === 1) {
      mtox = cursor.x;
      mtoy = cursor.y;
      const mx = mtox;
      const my = mtoy
      funcQ.push(() => {
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(cursor.x, cursor.y);
        ctx.stroke();
      })
    } else if (clickCounter === 2) {
      let mx = mtox;
      let my = mtoy
      let lx = cursor.x;
      let ly = cursor.y; 
      funcQ.pop();
      //funcQ.push(() => {
      const strokeIndex = funcQ.length;
      const strokeCreationTime = timeStamp;
      funcQ.push(() => {
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(lx, ly);
        if (strokeSelectList.value === 'selection') {
            if (ctx.isPointInStroke(cursor.x, cursor.y)) {
              selected === strokeCreationTime ? ctx.strokeStyle = 'Green' : ctx.strokeStyle = 'RoyalBlue';
              if (clickCounter === 1) {
                selected = strokeCreationTime;
                clickCounter = 0
              }
            } else if (selected === strokeCreationTime) {
              ctx.strokeStyle = 'DarkGreen';
              const sr = new Path2D();
              sr.rect(mx - 3, my - 3, 6, 6)
              if (ctx.isPointInPath(sr, cursor.x, cursor.y)) {
                ctx.strokeStyle = 'White';
                if (clickCounter === 1) {
                  mx = cursor.x;
                  my = cursor.y;
                }
              } else {
                ctx.strokeStyle = 'DarkGreen';
              }
              ctx.stroke(sr)
              ctx.strokeStyle = 'DarkGreen';              
            } else {
              ctx.strokeStyle = 'Blue';
            }
        }
        ctx.stroke();
      })
      clickCounter = 0;
    }
  } else if (strokeSelectList.value === 'selection') {
//    selected = null;
//    clickCounter = 0;
  }
}

let timeStamp = 0;
let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;
const displayStatus = () => {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  fps = Math.round(1 / secondsPassed);

  const statusString = `X:${String(cursor.x).padStart(4, '0')} Y: ${String(cursor.y).padStart(4, '0')} FPS:${fps}`

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = '16px Monospace';
  ctx.fillStyle = 'yellow';
  ctx.fillText(statusString, canv.width * .81, canv.height * .99);
  ctx.restore();
}


ctx.strokeStyle = "blue";
const draw = (ts) => {
  timeStamp = ts;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canv.width, canv.height);
  if (statusCheckbox.checked) displayStatus();
  for (const func of funcQ) func();
  window.requestAnimationFrame(draw);
}


window.requestAnimationFrame(draw);

