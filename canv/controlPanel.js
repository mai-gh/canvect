import { deselectAll } from './canvClick.js'

const strokes = ["Select", "Line", "Pen"];

const genCPD = (co) => {
  const cPD = document.createElement("div");
  cPD.id = "controlPanelDiv";
  strokes.forEach( val => {
    const b = document.createElement("button");
    b.id = `${val}-Button`
    b.classList.add('toolButton');
    b.innerHTML = val;
    b.onclick = (e) => {
      document.querySelectorAll('.toolButton').forEach(e => e.classList.             remove('toolButtonSelected'));
      e.target.classList.add('toolButtonSelected')
      deselectAll(co);
      co.clickCounter = 0;
      co.selectedTool = val;
    }
    cPD.appendChild(b);
  });
  return cPD
}

export default genCPD;
