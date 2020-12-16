export default function createDomNode(node, element, innerText, ...classes) {
  node = document.createElement(element);
  node.classList.add(...classes);
  if (innerText) node.innerText = innerText;
  return node;
}