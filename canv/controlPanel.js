import { deselectAll } from './select.js'

const strokes = ["Scroll", "Select", "Line", "Circle", 'Rectangle', 'Multi-Line', 'Arc', 'Elipse', 'Quadratic Bézier', 'Cubic Bézier', 'Text'];

const options = ['Show Grid', 'Snap to Grid', 'Snap to Edges', 'Import SVG', 'Export SVG', 'CLI']

const genCPD = (co) => {
  const cPD = document.createElement("div");
  const toolPanel = document.createElement("div");
  const optionsPanel = document.createElement("div");
  //const debugPanel = document.createElement("div");

 
  cPD.id = "controlPanelDiv";
  toolPanel.id = "toolPanelDiv";
  optionsPanel.id = "optionsPanelDiv";
  //debugPanel.id = "debugPanelDiv";

  strokes.forEach( val => {
    const b = document.createElement("button");
    b.id = `${val}-Button`
    b.classList.add('toolButton');
    b.innerHTML = val;
    b.onclick = (e) => {
      document.querySelectorAll('.toolButton').forEach(e => e.classList.remove('toolButtonSelected'));
      e.target.classList.add('toolButtonSelected')
      deselectAll(co);
      co.clickCounter = 0;
      co.selectedTool = val;
    }
    //cPD.appendChild(b);
    toolPanel.appendChild(b);
  });

  options.forEach( val => {
    const b = document.createElement("button");
    b.id = `${val}-Button`
    b.classList.add('toolButton');
    b.innerHTML = val;
    optionsPanel.appendChild(b);
  });


  //optionsPanel.appendChild(document.createTextNode("OPTIONS"));
  //debugPanel.appendChild(document.createTextNode("DEBUG"));

  cPD.appendChild(toolPanel);
  cPD.appendChild(optionsPanel);
  //cPD.appendChild(debugPanel);

  return cPD
}

export default genCPD;
