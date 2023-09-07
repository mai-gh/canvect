import co from './canv/canv.js'
import genCPD from './canv/controlPanel.js'

// co stands for canvas object, its where we will be storing our state

document.addEventListener("DOMContentLoaded", function() {

  const rightDiv = document.createElement("div");
  const cmdDiv = document.createElement("div");
  const cmdTbl = document.createElement("table");
  cmdTbl.id = "cmdTbl"
//  cmdTbl.style.border = "1px solid blue"
  for (let i of [0,1]) {
    let tr = document.createElement("tr");
    for (let j of [0,1,2,3,4,5,6,7]) {
      let td = document.createElement("td");
      td.id = `cmdTblr${i}c${j}`;
      //td.innerText = `cmdTblr${i}c${j}`;
      td.innerText = '~';
      tr.appendChild(td);
    }
    cmdTbl.appendChild(tr);
  }

/*
  [1,2].forEach((i)=>{
    let tr = document.createElement("tr");
    [1,2,3,4].forEach((j)=>{
      let td = document.createElement("tr");
      td.id = `cmdTblr${i}c${j}`;
      tr.appendChild(td);
    })
    cmdTbl.appendChild(tr);
  })
*/

  cmdDiv.appendChild(cmdTbl);
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
