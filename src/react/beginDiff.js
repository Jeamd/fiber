import diff from "./diff";
import {
  createDOMElement,
  mountNativeElement,
  updateNodeElement,
} from "./mountElement";

/**
 *
 * @param {*} virtualDOM
 * @param {*} container
 * @param {*} oldDOM
 *
 * 普通节点相同时的比对方式
 * virtualDOM 在比对的过程中 采用 深度优先 同级比对 边对比边更新， 同时父和父 子和子 进行比对 比对不会发生跨层级比对
 * 如果比较的两个节点的类型相同，就看看这两个节点是什么类型
 * 如果是文本类型就比较两个文本属性是否相同，相同就不做处理，不同就用新的文本节点替换旧 的文本节点
 * 如果是元素类型就比较元素属性是否相同 相同旧不做处理，不同就用新的元素属性替换旧的元素属性
 * 再看看节点中是否有要删除的属性，可以遍历旧的virtualDOM的props属性key并从新的virtualDOM的props中取值，如果取不到就表示要删除这个属性
 *
 * 普通节点不同时的比对方式
 * 当对比的元素节点类型不同时，就不需要继续比对了，直接使用新的virtualDOM 创建DOM对象 用新的DOM对象直接替换旧的DOM对象。
 * 同时卸载旧节点上绑定的事件
 *
 * 另外还有就是当前节点是组件时
 * 如果组件的类型相同时我们需要拿到组件返回的最新的virtualDOM 和旧的virtualDOM进行对比
 * 如果组件类型不同时那就重新创建新的组件
 *
 *
 * 子节点对比完成后还需要干一件事（后序位置），就是要看看是否存在要删除的子节点
 * 因为递归的条件是基于 新的virtualDOM 进行的 如果有要删除的子节点 在递归过程里，递归不到
 * 删除节点并不是说直接删除就可以了 还需要考虑一些问题
 * 文本节点可以直接删除
 * 如果是组件 还需要在删除时 调用组件的生命周期函数，删除绑定的属性
 * 如果是其他节点还需要删除节点身上的事件
 */
export default function beginDiff(virtualDOM, container, oldDOM) {
  console.log(virtualDOM, oldDOM);
  // diff 的本质是 虚拟DOM 的对比 边对比 边更新
  const preVirtualDOM = oldDOM && oldDOM._virtualDOM;

  // 节点相同时的比对方式
  if (preVirtualDOM && preVirtualDOM.type === virtualDOM.type) {
    // 虚拟DOM 类型相同时
    if (preVirtualDOM.type === "text") {
      // 文本节点处理
      updateTextNodeElementte(virtualDOM, preVirtualDOM, oldDOM);
    } else {
      // 元素节点处理
      updateNodeElement(oldDOM, virtualDOM, preVirtualDOM);
    }
  } else {
    // 节点不同时的比对方式

    // 普通元素类型节点
    if (typeof virtualDOM.type !== "function") {
      // 不是组件，就直接创建新的DOM对象，替换旧的
      mountNativeElement(virtualDOM, container, oldDOM);
      // 创建并替换完新的 之前老的 去递归 diff 子节点过程就不需要进行了
      return;
    } else {
      // 是组件，单独处理
    }
  }

  // 递归遍历 children 进行diff对比和更新
  virtualDOM.children.forEach((child, i) => {
    diff(child, oldDOM, oldDOM.childNodes[i]);
  });

  // 子节点更新完毕后，需要检查是否存在要删除的子节点
  const oldChildNodes = oldDOM.childNodes;
  if (oldChildNodes.length > virtualDOM.children.length) {
    for (
      let i = oldChildNodes.length - 1;
      i > virtualDOM.children.length - 1;
      i--
    ) {
      const node = oldChildNodes[i];
      unmountNode(node);
    }
  }
}

export function unmountNode(node) {
  node.remove();
}

// 更新文本节点的属性
export function updateTextNodeElementte(virtualDOM, preVirtualDOM, oldDOM) {
  if (virtualDOM.props.textContent !== preVirtualDOM.props.textContent) {
    oldDOM.textContent = virtualDOM.props.textContent;
    oldDOM._virtualDOM = virtualDOM;
  }
}

// 更新
