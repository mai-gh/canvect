import { deselectAll } from './select.js'

const strokes = ["Scroll", "Select", "Line", "Circle", 'Rectangle', 'Multi-Line', 'Arc', 'Elipse', 'Quadratic Bézier', 'Cubic Bézier', 'Text'];

const options = {
  'Show Grid': (co) => (e) => {
    if (co.showGrid === false) {
      co.showGrid = true;
      e.target.classList.add('toolButtonSelected')
    } else {
      co.showGrid = false;
      e.target.classList.remove('toolButtonSelected')
    }
  },
  'Snap to Grid': (co) => (e) => {},
  'Snap to Edges': (co) => (e) => {},
  'Import SVG': (co) => (e) => {},
  'Export SVG': (co) => (e) => {},
  'CLI': (co) => (e) => {}
}

const genCPD = (co) => {
  const cPD = document.createElement("div");
  const toolPanel = document.createElement("div");
  const optionsPanel = document.createElement("div");
 
  cPD.id = "controlPanelDiv";
  toolPanel.id = "toolPanelDiv";
  optionsPanel.id = "optionsPanelDiv";

  strokes.forEach( val => {
    const b = document.createElement("button");
    b.id = `${val}-Button`
    b.classList.add('toolButton');
    b.innerHTML = val;
    b.onclick = (e) => {
      document.querySelectorAll('#toolPanelDiv > .toolButton').forEach(e => e.classList.remove('toolButtonSelected'));
      e.target.classList.add('toolButtonSelected')
      deselectAll(co);
      co.clickCounter = 0;
      co.selectedTool = val;
    }
    toolPanel.appendChild(b);
  });

  for (const [key, val] of Object.entries(options)) {
    const b = document.createElement("button");
    b.id = `${key}-Button`;
    b.classList.add('toolButton');
    b.innerHTML = key;
    b.onclick = val(co);
    optionsPanel.appendChild(b);
  }

  cPD.appendChild(toolPanel);
  cPD.appendChild(optionsPanel);

  return cPD
}

export default genCPD;
