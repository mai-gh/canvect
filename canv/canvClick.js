const getStrokeUnderCursor = (co) => { for (const s of co.funcQ) if (co.ctx.isPointInStroke(s.path, co.cursorX, co.cursorY)) return s };
export const deselectAll = (co) => { for (const s of co.funcQ) s.selected = false };
const getAllSelected = (co) => {
  const selArr = [];
  for (const s of co.funcQ) if (s.selected) selArr.push(s);
  return selArr;
};

export default (co) => (e) => {
  co.clickCounter++;
  if (strokeSelectList.value === "lineTo") {
    if (co.clickCounter === 1) {
      co.funcQ.push({
        path: new Path2D(),
        //time: timeStamp,
        selected: false,
        editing: "endBox",
        sx: ( (xx) => () => xx)(co.cursorX),
        sy: ( (yy) => () => yy)(co.cursorY),
        lx: () => co.cursorX,
        ly: () => co.cursorY,
        startBox: null,
        endBox: null,
        boxColor: "Red",
        func: function () {
          co.ctx.save();
          co.ctx.lineWidth = 5;
          co.ctx.strokeStyle = "blue"
          if (this.selected) co.ctx.strokeStyle = "White";
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
            const boxSize = 30;
            this.startBox = new Path2D();
            this.endBox = new Path2D();
            this.startBox.rect(this.sx() - boxSize / 2, this.sy() - boxSize / 2, boxSize, boxSize);
            this.endBox.rect(this.lx() - boxSize / 2, this.ly() - boxSize / 2, boxSize, boxSize);
            if (co.ctx.isPointInPath(this.startBox, co.cursorX, co.cursorY)) {
              co.ctx.stroke(this.endBox);
              co.ctx.strokeStyle = "Yellow";
              co.ctx.stroke(this.startBox);
            } else if (co.ctx.isPointInPath(this.endBox, co.cursorX, co.cursorY)) {
              co.ctx.stroke(this.startBox);
              co.ctx.strokeStyle = "Yellow";
              co.ctx.stroke(this.endBox);
            } else {
              co.ctx.stroke(this.startBox);
              co.ctx.stroke(this.endBox);
            }
          }
          co.ctx.restore();
        },
      });
    } else if (co.clickCounter === 2) {
      const lx = co.cursorX;
      const ly = co.cursorY;
      const s = co.funcQ[co.funcQ.length - 1];
      s.lx = () => lx;
      s.ly = () => ly;
      s.path.moveTo(s.sx(), s.sy());
      s.path.lineTo(s.lx(), s.ly());
      s.editing = null;
      co.clickCounter = 0;
    }
  } else if (strokeSelectList.value === "selection") {
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
};

