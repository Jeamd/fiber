import { getFunctionComponentVirtualDOM } from "./gitVirtualDomFromComponent";

/**
 *
 * @param {*} virtualDOM
 * @param {*} container
 * 普通节点 type 是 string
 * 组件节点 type 是 function
 */
export default function mountElement(virtualDOM, container) {
  // Component vs NativeElement
  if (isComponent(virtualDOM)) {
    mountComponentElement(virtualDOM, container);
  } else {
    mountNativeElement(virtualDOM, container);
  }
}

export function isComponent(virtualDOM) {
  return virtualDOM && typeof virtualDOM.type === "function";
}

export function createDOMElement(virtualDOM) {
  let newElement = null;
  if (virtualDOM.type === "text") {
    // 文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent);
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type);

    // 为元素节点添加属性
    upDateNodeElement(newElement, virtualDOM);
  }

  return newElement;
}

export function mountNativeElement(virtualDOM, container) {
  const newElement = createDOMElement(virtualDOM);

  // 递归创建子节点
  virtualDOM.children.forEach((child) => {
    mountElement(child, newElement);
  });

  // 将创建好的元素节点放进父节点中
  container.appendChild(newElement);
}

// 组件处理
export function mountComponentElement(virtualDOM, container) {
  let componentVirtualDOM = null;
  // 判断组件是 类组件 还是 函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    componentVirtualDOM = getFunctionComponentVirtualDOM(virtualDOM);
  } else {
  }

  mountElement(componentVirtualDOM, container);
}

// 判断组件是 类组件 还是 函数组件
export function isFunctionComponent(virtualDOM) {
  // 如果是类组件 组件原型中 存在 render 方法
  // 我理解 类组件都需要继承 React.Component 可以在React.Component这上边加上唯一标识来鉴别

  const type = virtualDOM.type;
  return isComponent(virtualDOM) && !(type.prototype && type.prototype.render);
}

// 为元素节点添加属性
export function upDateNodeElement(newElement, virtualDOM) {
  // 获取节点的属性对象
  const newProps = virtualDOM.props;

  Object.keys(newProps).forEach((propName) => {
    const newPropsValue = newProps[propName];

    // 判断事件属性
    if (propName.slice(0, 2) === "on") {
      const eventName = propName.slice(2).toLowerCase();

      // 添加事件
      newElement.addEventListener(eventName, newPropsValue);
    } else if (propName === "value" || propName === "checked") {
      // 判断是否为特殊属性

      newElement[propName] = newPropsValue;
    } else if (propName !== "children") {
      // 过滤掉children 属性
      if (propName === "className") {
        // 添加class属性

        newElement.setAttribute("class", newPropsValue);
      } else {
        newElement.setAttribute(propName, newPropsValue);
      }
    }
  });
}
