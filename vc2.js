


const cPD = document.createElement("div");
cPD.id = "controlPanelDiv";
cPD.style.position = "absolute";
cPD.style.width = "15%";
cPD.style.top = "0";
cPD.style.bottom = "0";
cPD.style.left = "0";
cPD.style.right = "0";
cPD.appendChild(document.createTextNode("Control Panel"));

const strokes = ['lineTo', 'quadraticCurveTo'];
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
};



addEventListener("mousemove", (e) => {
  cursor.x = Math.floor(e.clientX - canv.getBoundingClientRect().left);
  cursor.y = Math.floor(e.clientY - canv.getBoundingClientRect().top);

});



const ctx = canv.getContext('2d');
const funcQ = [];
const clickArr = [];

let clickCounter = 0;
let mtox = 0;
let mtoy = 0;

canv.onclick = () => {
  clickCounter++;
  clickArr.push({x: cursor.x, y: cursor.y});
  cAL = clickArr.length;
  cAI = cAL - 1;
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
      const mx = mtox;
      const my = mtoy
      const lx = cursor.x;
      const ly = cursor.y; 
      funcQ.pop();
      funcQ.push(() => {
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      })
      clickCounter = 0;
    }
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

  const statusString = `X:${String(cursor.x).padStart(4, '0')} Y: ${String(cursor.y).padStart(4, '0')} FPS: ${fps}`

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = '16px Monospace';
  ctx.fillStyle = 'yellow';
  ctx.fillText(statusString, canv.width * .8, canv.height * .99);
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

