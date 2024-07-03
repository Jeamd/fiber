export default function updateNodeElement(
  newElement,
  virtualDOM,
  oldVirtualDOM = {}
) {
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
