import {handleLineSelect} from './line.js';
import {handleCircleSelect} from './circle.js';

export const getStrokeUnderCursor = (co) => { for (const s of co.funcQ) if (co.ctx.isPointInStroke(s.path, co.cursorX_base, co.cursorY_base)) return s };
export const deselectAll = (co) => { for (const s of co.funcQ) s.selected = false };
export const unhoverAll = (co) => { for (const s of co.funcQ) s.hovered = false };
export const getAllSelected = (co) => {
  const selArr = [];
  for (const s of co.funcQ) if (s.selected) selArr.push(s);
  return selArr;
};

const handleSelect = (co) => {
  if (co.clickCounter === 1) {
    deselectAll(co);
    for (const s of co.funcQ) {
      if (co.ctx.isPointInStroke(s.path, co.cursorX_base, co.cursorY_base)) {
        s.selected = true;
        break;
      }
    }

    // FIXME at the moment we will not support multiple selections
    if (getAllSelected(co).length != 1) {
      deselectAll(co);
      co.clickCounter = 0;
    }

  } else if (co.clickCounter > 1) {
    const [ps] = getAllSelected(co);
    switch (ps.type) {
      case 'line':
        handleLineSelect[co.clickCounter.toString()](co);
        break;
      case 'circle':
        handleCircleSelect[co.clickCounter.toString()](co);
        break;
      default:
        console.log('zzzzzzzz')
        break;
    }
  }
}

export default handleSelect;
