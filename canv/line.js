import { deselectAll, getAllSelected } from './select.js'
//import co from './canv.js'

// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes

export const lineTemplate = (co) => {
  return {
    type: "line",
    path: new Path2D(),
    //time: timeStamp,
    selected: false,
    hovered: false,
    editing: "endBox",
    sx: ( (xx) => () => xx)(co.modCursorX),
    sy: ( (yy) => () => yy)(co.modCursorY),
    lx: () => co.modCursorX,
    ly: () => co.modCursorY,
    startBox: null,
    endBox: null,
    boxColor: "Red",
    func: function () {
      co.ctx.save();
      co.ctx.lineWidth = 1;
      co.ctx.strokeStyle = "blue"
      if (this.selected) co.ctx.strokeStyle = "White";
      if (this.hovered) co.ctx.strokeStyle = "CornFlowerBlue";
      co.ctx.beginPath();
      co.ctx.moveTo(this.sx(), this.sy());
      co.ctx.lineTo(this.lx(), this.ly());
      if (this.editing !== null) {
        co.ctx.stroke();
      } else {
        co.ctx.stroke(this.path);
      }
      if (this.selected) {
        co.ctx.strokeStyle = this.boxColor;
        co.ctx.lineWidth = 1;
        const boxSize = 16;
        this.startBox = new Path2D();
        this.endBox = new Path2D();
        this.startBox.rect(this.sx() - boxSize / 2, this.sy() - boxSize / 2,     boxSize, boxSize);
        this.endBox.rect(this.lx() - boxSize / 2, this.ly() - boxSize / 2,       boxSize, boxSize);
        if (co.ctx.isPointInPath(this.startBox, co.cursorX_base, co.cursorY_base)) {
          co.ctx.stroke(this.endBox);
          co.ctx.strokeStyle = "Yellow";
          co.ctx.stroke(this.startBox);
        } else if (co.ctx.isPointInPath(this.endBox, co.cursorX_base, co.cursorY_base)) {                co.ctx.stroke(this.startBox);
          co.ctx.strokeStyle = "Yellow";
          co.ctx.stroke(this.endBox);
        } else {
          co.ctx.stroke(this.startBox);
          co.ctx.stroke(this.endBox);
        }
      }
      co.ctx.restore();
    },
    };
  };


const handleLine = (co) => {
  if (co.clickCounter === 1) {
    co.funcQ.push(lineTemplate(co));
  } else if (co.clickCounter === 2) {
    const lx = co.modCursorX;
    const ly = co.modCursorY;
    const s = co.funcQ[co.funcQ.length - 1];
    s.lx = () => lx;
    s.ly = () => ly;
    s.path.moveTo(s.sx(), s.sy());
    s.path.lineTo(s.lx(), s.ly());
    s.editing = null;
    co.clickCounter = 0;
  }
}

export const handleLineSelect = {
  '2': (co) => {
    const [ps] = getAllSelected(co);
    if (co.ctx.isPointInPath(ps.startBox, co.cursorX_base, co.cursorY_base)) {
      ps.editing = "startBox";
      ps.sx = () => co.modCursorX;
      ps.sy = () => co.modCursorY;
    } else if (co.ctx.isPointInPath(ps.endBox, co.cursorX_base, co.cursorY_base)) {
      ps.editing = "endBox";
      ps.lx = () => co.modCursorX;
      ps.ly = () => co.modCursorY;
    } else if (co.ctx.isPointInStroke(ps.path, co.cursorX_base, co.cursorY_base)) {
      ps.editing = "moveAll";
      const xdiff = ps.sx() - ps.lx();
      const ydiff = ps.sy() - ps.ly();
      ps.sx = () => co.modCursorX + xdiff / 2;
      ps.sy = () => co.modCursorY + ydiff / 2;
      ps.lx = () => co.modCursorX - xdiff / 2;
      ps.ly = () => co.modCursorY - ydiff / 2;
    } else {
      deselectAll(co);
      co.clickCounter = 0;
    }
  },
  '3': (co) => {
    const [s] = getAllSelected(co);
    if (s.editing === "endBox") {
      const lx = co.modCursorX;
      const ly = co.modCursorY;
      s.lx = () => lx;
      s.ly = () => ly;
      s.path = new Path2D();
      s.path.moveTo(s.sx(), s.sy());
      s.path.lineTo(s.lx(), s.ly());
      s.editing = null;
      co.clickCounter = 0;
      deselectAll(co);
    } else if (s.editing === "startBox") {
      const sx = co.modCursorX;
      const sy = co.modCursorY;
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
      const sx = co.modCursorX + xdiff / 2;
      const sy = co.modCursorY + ydiff / 2;
      const lx = co.modCursorX - xdiff / 2;
      const ly = co.modCursorY - ydiff / 2;
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
  },
}

export default handleLine;
