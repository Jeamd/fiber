import updateNodeElement from "./updateNodeElement";

export default function createDOMElement(virtualDOM) {
  let newElement = null;
  if (virtualDOM.type === "text") {
    // 文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent);
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type);

    // 为元素节点添加属性
    updateNodeElement(newElement, virtualDOM);
  }

  return newElement;
}
