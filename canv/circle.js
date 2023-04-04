// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes

const handleCircle = (co) => {
  if (co.clickCounter === 1) {
    co.funcQ.push({
      path: new Path2D(),
      //time: timeStamp,
      selected: false,
      hovered: false,
      editing: "endBox",
      sx: ( (xx) => () => xx)(co.cursorX),
      sy: ( (yy) => () => yy)(co.cursorY),
      lx: () => co.cursorX,
      ly: () => co.cursorY,
      startBox: null,
      endBox: null,
      boxColor: "Red",
      radius: 0,
      func: function () {
        co.ctx.save();
        co.ctx.lineWidth = 1;
        co.ctx.strokeStyle = "blue"
        if (this.selected) co.ctx.strokeStyle = "White";
        if (this.hovered) co.ctx.strokeStyle = "CornFlowerBlue";
        co.ctx.beginPath();
        const xr = Math.abs(this.lx() - this.sx());
        const yr = Math.abs(this.ly() - this.sy());
        this.radius = Math.sqrt((xr**2)+(yr**2));
        co.ctx.arc(this.sx(), this.sy(), this.radius, 0, Math.PI * 2, true);
        if (this.editing !== null) {
          co.ctx.stroke();
        } else {
          co.ctx.stroke(this.path);
        }
/*        if (this.selected) {
          co.ctx.strokeStyle = this.boxColor;
          co.ctx.lineWidth = 1;
          const boxSize = 16;
          this.startBox = new Path2D();
          this.endBox = new Path2D();
          this.startBox.rect(this.sx() - boxSize / 2, this.sy() - boxSize / 2,     boxSize, boxSize);
          this.endBox.rect(this.lx() - boxSize / 2, this.ly() - boxSize / 2,       boxSize, boxSize);
          if (co.ctx.isPointInPath(this.startBox, co.cursorX, co.cursorY)) {
            co.ctx.stroke(this.endBox);
            co.ctx.strokeStyle = "Yellow";
            co.ctx.stroke(this.startBox);
          } else if (co.ctx.isPointInPath(this.endBox, co.cursorX, co.cursorY)) {                co.ctx.stroke(this.startBox);
            co.ctx.strokeStyle = "Yellow";
            co.ctx.stroke(this.endBox);
          } else {
            co.ctx.stroke(this.startBox);
            co.ctx.stroke(this.endBox);
          }
        }*/
        co.ctx.restore();
      },
    });
  } else if (co.clickCounter === 2) {
    const lx = co.cursorX;
    const ly = co.cursorY;
    const s = co.funcQ[co.funcQ.length - 1];
//    s.lx = () => lx;
//    s.ly = () => ly;
    s.path.arc(s.sx(), s.sy(), s.radius, 0, Math.PI * 2, true)
//    s.path.moveTo(s.sx(), s.sy());
//    s.path.lineTo(s.lx(), s.ly());
    s.editing = null;
    co.clickCounter = 0;
  }
}

export default handleCircle;
