import { deselectAll, getAllSelected } from './select.js';

const handleCircle = (co) => {
  if (co.clickCounter === 1) {
    co.funcQ.push({
      type: "circle",
      path: new Path2D(),
      //time: timeStamp,
      selected: false,
      hovered: false,
      editing: "perimeterBox",
      sx: ( (xx) => () => xx)(co.cursorX),
      sy: ( (yy) => () => yy)(co.cursorY),
      lx: () => co.cursorX,
      ly: () => co.cursorY,
      centerBox: null,
      perimeterBox: null,
      boxColor: "Red",
      radius: 0,
      func: function () {
        co.ctx.save();
        co.ctx.lineWidth = 1;
        co.ctx.strokeStyle = "blue"
        if (this.selected) co.ctx.strokeStyle = "White";
        if (this.hovered) co.ctx.strokeStyle = "CornFlowerBlue";
        co.ctx.beginPath();
        if (this.editing === 'perimeterBox') {
          const xr = Math.abs(this.lx() - this.sx());
          const yr = Math.abs(this.ly() - this.sy());
          this.radius = Math.sqrt((xr**2)+(yr**2));
        }
        co.ctx.arc(this.sx(), this.sy(), this.radius, 0, Math.PI * 2, true);
        if (this.editing !== null) {
          co.ctx.stroke();
        } else {
          co.ctx.stroke(this.path);
        }
        if (this.selected) {
          co.ctx.strokeStyle = this.boxColor;
          co.ctx.lineWidth = 1;
          const boxSize = 16;
          this.centerBox = new Path2D();
          this.perimeterBox = new Path2D();
          this.centerBox.rect(this.sx() - boxSize / 2, this.sy() - boxSize / 2,     boxSize, boxSize);
          if (co.ctx.isPointInStroke(this.path, co.cursorX, co.cursorY)) {
            this.perimeterBox.rect(co.cursorX - boxSize / 2, co.cursorY - boxSize / 2, boxSize, boxSize);
          }
          if (co.ctx.isPointInPath(this.centerBox, co.cursorX, co.cursorY)) {
            co.ctx.strokeStyle = "Yellow";
            co.ctx.stroke(this.centerBox);
          } else if (co.ctx.isPointInPath(this.perimeterBox, co.cursorX, co.cursorY)) {  
          co.ctx.stroke(this.centerBox);
            co.ctx.strokeStyle = "Yellow";
            co.ctx.stroke(this.perimeterBox);
          } else {
            co.ctx.stroke(this.centerBox);
            co.ctx.stroke(this.perimeterBox);
          }
        }
        co.ctx.restore();
      },
    });
  } else if (co.clickCounter === 2) {
    const lx = co.cursorX;
    const ly = co.cursorY;
    const s = co.funcQ[co.funcQ.length - 1];
    s.path.arc(s.sx(), s.sy(), s.radius, 0, Math.PI * 2, true)
    s.editing = null;
    co.clickCounter = 0;
  }
}





export const handleCircleSelect = {
  '2': (co) => {
    const [ps] = getAllSelected(co);
    if (co.ctx.isPointInPath(ps.centerBox, co.cursorX, co.cursorY)) {
      ps.editing = "centerBox";
      ps.sx = () => co.cursorX;
      ps.sy = () => co.cursorY;
    } else if (co.ctx.isPointInPath(ps.perimeterBox, co.cursorX, co.cursorY)) {
      ps.editing = "perimeterBox";
      ps.lx = () => co.cursorX;
      ps.ly = () => co.cursorY;
    } else {
      deselectAll(co);
      co.clickCounter = 0;
    }

  },
  '3': (co) => {
    const [s] = getAllSelected(co);
    if (s.editing === "centerBox") {
      const sx = co.cursorX;
      const sy = co.cursorY;
      s.sx = () => sx;
      s.sy = () => sy;
      s.path = new Path2D();
      s.path.arc(s.sx(), s.sy(), s.radius, 0, Math.PI * 2, true);
      s.editing = null;
      co.clickCounter = 0;
      deselectAll(co);
    } else if (s.editing === "perimeterBox") {
      const lx = co.cursorX;
      const ly = co.cursorY;
      s.lx = () => lx;
      s.ly = () => ly;
      s.path = new Path2D();
      s.path.arc(s.sx(), s.sy(), s.radius, 0, Math.PI * 2, true);
      s.editing = null;
      co.clickCounter = 0;
      deselectAll(co);
    }
  },
}

export default handleCircle;
