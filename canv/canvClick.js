import handleLine from './line.js';
import handleCircle from './circle.js';
import handleSelect from './select.js';


const handleClick = (co) => (e) => {
  co.clickCounter++;
  if (co.selectedTool === "Line") {
    handleLine(co);
  } else if (co.selectedTool === "Circle") {
    handleCircle(co);
  } else if (co.selectedTool === "Select") {
    handleSelect(co);
  }
};

export default handleClick;
