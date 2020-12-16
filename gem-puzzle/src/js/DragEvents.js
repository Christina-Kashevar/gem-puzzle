function dragStart(e) {
  e.dataTransfer.setData('text', e.target.innerHTML);
  e.dataTransfer.effectAllowed = 'move';
  return true;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  return true;
}

export {dragStart, dragOver, dragEnter}