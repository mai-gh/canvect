export const getStrokeUnderCursor = (co) => { for (const s of co.funcQ) if (co.ctx.isPointInStroke(s.path, co.cursorX, co.cursorY)) return s };
export const deselectAll = (co) => { for (const s of co.funcQ) s.selected = false };
export const unhoverAll = (co) => { for (const s of co.funcQ) s.hovered = false };
const getAllSelected = (co) => {
  const selArr = [];
  for (const s of co.funcQ) if (s.selected) selArr.push(s);
  return selArr;
};

const handleSelect = (co) => {
  if (co.clickCounter === 1) {
    deselectAll(co);
    for (const s of co.funcQ) {
      if (co.ctx.isPointInStroke(s.path, co.cursorX, co.cursorY)) {
        s.selected = true;
      }
    }
    if (getAllSelected(co).length === 1) {
    } else {
      co.clickCounter = 0;
    }
  } else if (co.clickCounter === 2) {
    if (getAllSelected(co).length === 1) {
      const [ps] = getAllSelected(co);
      const uc = getStrokeUnderCursor(co);
      if (co.ctx.isPointInPath(ps.startBox, co.cursorX, co.cursorY)) {
        ps.editing = "startBox";
        ps.sx = () => co.cursorX;
        ps.sy = () => co.cursorY;
      } else if (co.ctx.isPointInPath(ps.endBox, co.cursorX, co.cursorY)) {
        ps.editing = "endBox";
        ps.lx = () => co.cursorX;
        ps.ly = () => co.cursorY;
      } else if (ps === uc) {
        ps.editing = "moveAll";
        const xdiff = ps.sx() - ps.lx();
        const ydiff = ps.sy() - ps.ly();
        ps.sx = () => co.cursorX + xdiff / 2;
        ps.sy = () => co.cursorY + ydiff / 2;
        ps.lx = () => co.cursorX - xdiff / 2;
        ps.ly = () => co.cursorY - ydiff / 2;
      } else {
        deselectAll(co);
        co.clickCounter = 0;
      }
    }
  } else if (co.clickCounter === 3) {
    const [s] = getAllSelected(co);
    if (s.editing === "endBox") {
      const lx = co.cursorX;
      const ly = co.cursorY;
      s.lx = () => lx;
      s.ly = () => ly;
      s.path = new Path2D();
      s.path.moveTo(s.sx(), s.sy());
      s.path.lineTo(s.lx(), s.ly());
      s.editing = null;
      co.clickCounter = 0;
      deselectAll(co);
    } else if (s.editing === "startBox") {
      const sx = co.cursorX;
      const sy = co.cursorY;
      s.sx = () => sx;
      s.sy = () => sy;
      s.path = new Path2D();
      s.path.moveTo(s.sx(), s.sy());
      s.path.lineTo(s.lx(), s.ly());
      s.editing = null;
      co.clickCounter = 0;
      deselectAll(co);
    } else if (s.editing === "moveAll") {
      const xdiff = s.sx() - s.lx();
      const ydiff = s.sy() - s.ly();
      const sx = co.cursorX + xdiff / 2;
      const sy = co.cursorY + ydiff / 2;
      const lx = co.cursorX - xdiff / 2;
      const ly = co.cursorY - ydiff / 2;
      s.sx = () => sx;
      s.sy = () => sy;
      s.lx = () => lx;
      s.ly = () => ly;
      s.path = new Path2D();
      s.path.moveTo(s.sx(), s.sy());
      s.path.lineTo(s.lx(), s.ly());
      s.editing = null;
      co.clickCounter = 0;
      deselectAll(co);
    }
  }
}

export default handleSelect;
