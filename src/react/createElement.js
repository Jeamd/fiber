/**
 *
 * @param {*} type 元素类型
 * @param {*} props 元素属性集合
 * @param  {...any} children 使用 creatElement 函数调用的子集
 *
 * 1. 文本节点转化为 对象的形式存储
 * 2. null/false 节点需要过滤
 * 3.props属性中需要添加children
 */
export default function createElement(type, props, ...children) {
  const childElements = [].concat(children).reduce((result, child) => {
    if (child instanceof Object) {
      // 说明节点为对象 不是文本
      result.push(child);
    } else if (child !== false && child !== null && child !== true) {
      result.push(createElement("text", { textContent: child }));
    }

    return result;
  }, []);

  return {
    type,
    props: Object.assign({}, { children: childElements }, props),
    children: childElements,
  };
}
