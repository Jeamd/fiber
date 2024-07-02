import mountElement from "./mountElement";
/**
 *
 * @param {*} virtualDOM 虚拟DOM
 * @param {*} container 挂载容器
 * @param {*} oldDOM 老的节点
 *
 * 1. 要确定 老的节点是否存在 如果存在 就要对比更新
 * 2. 要判断 virtualDOM 是元素节点还是组件节点
 */
export default function diff(virtualDOM, container, oldDOM) {
  // 判断oldDOM是否存在
  if (!oldDOM) {
    // 通过虚拟DOM创建真实DOM  进行挂载
    mountElement(virtualDOM, container);
  }
}
