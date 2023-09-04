import {lineTemplate} from './line.js'
import {circleTemplate} from './circle.js'
import {deselectAll} from './select.js'

export const expSVG = (co) => {

  const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svgElem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgElem.style.visibility = 'hidden';
  document.body.appendChild(svgElem)

  co.funcQ.forEach((p) => {
    if (p.type === "line") {
      const l = document.createElementNS('http://www.w3.org/2000/svg','line');
      l.style['stroke-width'] = 1;
      l.style.stroke = 'blue';
      l.setAttribute('x1', p.sx());
      l.setAttribute('y1', p.sy());
      l.setAttribute('x2', p.lx());
      l.setAttribute('y2', p.ly());
      svgElem.appendChild(l);
    } else if (p.type === "circle") {
      const l = document.createElementNS('http://www.w3.org/2000/svg','circle');
      l.style['stroke-width'] = 1;
      l.style.stroke = 'blue';
      l.style.fill = 'transparent';
      l.setAttribute('cx', p.sx());
      l.setAttribute('cy', p.sx());
      l.setAttribute('r', p.radius);
      svgElem.appendChild(l);
    }
  });

  const bb = svgElem.getBBox();
  const margin = 10;

  // translate so top left to x=0 y=0
  if (bb.x < 0) { 
    svgElem.childNodes.forEach((l)=>{
      if (l.tagName === 'line') {
        l.setAttribute('x1', Number(l.getAttribute('x1')) + Math.abs(bb.x));
        l.setAttribute('x2', Number(l.getAttribute('x2')) + Math.abs(bb.x));
      } else if (l.tagName === 'circle') {
        l.setAttribute('cx', Number(l.getAttribute('cx')) + Math.abs(bb.x));
      }
    })
  }
  if (bb.y < 0) { 
    svgElem.childNodes.forEach((l)=>{
      if (l.tagName === 'line') {
        l.setAttribute('y1', Number(l.getAttribute('y1')) + Math.abs(bb.y));
        l.setAttribute('y2', Number(l.getAttribute('y2')) + Math.abs(bb.y));
      } else if (l.tagName === 'circle') {
        l.setAttribute('cy', Number(l.getAttribute('cy')) + Math.abs(bb.y));
      }
    })
  }

  //svgElem.setAttribute('viewBox', `${bb.x} ${bb.y} ${bb.width} ${bb.height}`)
  document.body.removeChild(svgElem)
  svgElem.style.removeProperty('visibility')
  svgElem.removeAttribute('style')
  console.log(svgElem.outerHTML)

}

export const impSVG = (input) => {
  const template = document.createElement('template');
  const html = input.trim();
  template.innerHTML = html;
  const svgElem = template.content.firstChild;
  svgElem.childNodes.forEach((l) => {
    if (l.tagName === 'line') {
      const s = lineTemplate(co);
      s.sx = () => Number(l.getAttribute('x1'));
      s.sy = () => Number(l.getAttribute('y1'));
      s.lx = () => Number(l.getAttribute('x2'));
      s.ly = () => Number(l.getAttribute('y2'));
      s.path = new Path2D();
      s.path.moveTo(s.sx(), s.sy());
      s.path.lineTo(s.lx(), s.ly());
      s.editing = null;
      co.clickCounter = 0;
      deselectAll(co);      
      co.funcQ.push(s);
    } else if (l.tagName === 'circle') {
      const s = circleTemplate(co);
      s.sx = () => Number(l.getAttribute('cx'));
      s.sy = () => Number(l.getAttribute('cy'));
      s.radius = Number(l.getAttribute('r'));
      s.path = new Path2D();
      s.path.arc(s.sx(), s.sy(), s.radius, 0, Math.PI * 2, true);
      s.editing = null;
      co.clickCounter = 0;
      deselectAll(co);
      co.funcQ.push(s);
    }
  })
}

window.impSVG = impSVG;
