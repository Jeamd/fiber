import {
  getClassComponentVirtualDOM,
  getFunctionComponentVirtualDOM,
} from "./gitVirtualDomFromComponent";

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
    updateNodeElement(newElement, virtualDOM);
  }

  // 在真实dom实例上挂载 虚拟DOM 以便于在后续更新时获取
  newElement._virtualDOM = virtualDOM;

  return newElement;
}

export function mountNativeElement(virtualDOM, container, oldDOM) {
  const newElement = createDOMElement(virtualDOM);

  const instance = virtualDOM.instance;

  if (instance) {
    instance.setDOM(newElement);
  }

  // 递归创建子节点
  virtualDOM.children.forEach((child) => {
    mountElement(child, newElement);
  });

  // 将创建好的元素节点放进父节点中 采用 替换或者 添加
  if (oldDOM) {
    // 存在oldDom 就采用 替换
    container.replaceChild(newElement, oldDOM);
  } else {
    // 不存在就采用 添加
    container.appendChild(newElement);
  }
}

// 组件处理
export function mountComponentElement(virtualDOM, container) {
  let componentVirtualDOM = null;
  // 判断组件是 类组件 还是 函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    componentVirtualDOM = getFunctionComponentVirtualDOM(virtualDOM);
  } else {
    componentVirtualDOM = getClassComponentVirtualDOM(virtualDOM);
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
export function updateNodeElement(newElement, virtualDOM, oldVirtualDOM = {}) {
  // 获取节点的属性对象
  const newProps = virtualDOM.props || {};
  const oldProps = oldVirtualDOM.props || {};

  // 添加或修改属性
  Object.keys(newProps).forEach((propName) => {
    const newPropsValue = newProps[propName];
    const oldPropsValue = oldProps[propName];

    if (newPropsValue !== oldPropsValue) {
      // 属性值不同需要更新 新增的话肯定会走这

      // 判断事件属性
      if (propName.slice(0, 2) === "on") {
        const eventName = propName.slice(2).toLowerCase();

        // 添加事件
        newElement.addEventListener(eventName, newPropsValue);

        // 移除老的事件
        newElement.removeEventListener(eventName, oldPropsValue);
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
    }
  });

  // 删除属性
  Object.keys(oldProps).forEach((propName) => {
    const newPropsValue = newProps[propName];
    const oldPropsValue = oldProps[propName];

    if (!newPropsValue) {
      // 在新的virtualDOM中不存在的属性，说明旧属性被删除
      if (propName.slice(0, 2) === "on") {
        const eventName = propName.slice(2).toLowerCase();
        // 移除老的事件
        newElement.removeEventListener(eventName, oldPropsValue);
      } else if (propName !== "children") {
        newElement.removeAttribute(propName);
      }
    }
  });
}
