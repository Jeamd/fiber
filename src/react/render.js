import diff from "./diff";
/**
 *
 * @param {*} virtualDOM 虚拟DOM
 * @param {*} container 挂载节点实例
 * @param {*} oldDOM 老的真实节点的实例
 */
export default function render(
  virtualDOM,
  container,
  oldDOM = container.firstChild
) {
  diff(virtualDOM, container, oldDOM);
}
