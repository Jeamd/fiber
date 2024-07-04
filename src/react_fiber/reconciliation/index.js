import { arrified, creatStateNode, createTaskQueue, getTag } from "../Misc";
// 把每个 fiber 放到数组里
// 统一循环这个 fiber 数组 获取 每个fiber对象
// 从而构建真实DOM对象
// 并且把真实DOM放到页面里

const taskQueue = createTaskQueue();
// 子任务
let subTask = null;

let pendingCommit = null;

const commitAllWork = (fiber) => {
  fiber.effects.forEach((fiber) => {
    if (fiber.effectTag === "placement") {
      let _parent_fiber = fiber.parent;
      while (_parent_fiber.tag === "classComponent") {
        _parent_fiber = _parent_fiber.parent;
      }

      if (fiber.tag === "hostComponent") {
        _parent_fiber.stateNode.appendChild(fiber.stateNode);
      }
    }
  });
};

/**
 * 函数定义
 * 获取任务队列中的 第一个任务的子任务
 * 第一个子任务就是 构建最外层的Fiber对象
 */
const getFirstTask = () => {
  /**
   * 从任务队列中获取任务
   */
  const task = taskQueue.pop();

  /**
   * 返回最外层节点的FIber对象
   */
  return {
    props: task.props, // 节点属性
    stateNode: task.dom, // 节点的DOM对象
    type: "div", // 节点类型（元素、文本、组件）（具体的类型）
    tag: "hostRoot", // 节点的标记（hostRoot\hostComponent\classComponent\functionComent）
    effects: [], // 数组，存储需要更改的Fiber对象 新的好像是 flags
    effectTag: "", // 当前 FIber 要执行的操作 （新增、删除、修改）
    parent: null, // 指向 父级 Fiber
    child: null, // 指向 指向 第一个子Fiber
    sibling: null, // 指向 下一个 兄弟 Fiber
    alternate: null, // 指向 workInProgress/current 中相对应的 Fiber
  };
};

/**
 *为子节点创建Fiber对象 同时绑定这些 Fiber对象之间的关系
 * @param {*} fiber 父级 Fiber
 * @param {*} children 子级的 virtualDOM
 */
const reconcileChildren = (fiber, children) => {
  /**
   * children 有可能是数组（有多个子节点）也有可能是对象（初始化 render传过来的 virtualDom是个虚拟DOM对象）
   * 在这修改一下 通过一改成 数组形式
   */
  const arrifiedChildren = arrified(children);
  let preFiber = null;

  // 为每一个子节点创建Fiber
  for (let i = 0; i < arrifiedChildren.length; i++) {
    const currentVirtualDom = arrifiedChildren[i];
    const currentFiber = {
      type: currentVirtualDom.type,
      props: currentVirtualDom.props,
      stateNode: null,
      tag: getTag(currentVirtualDom), // 节点类型标记
      effects: [],
      effectTag: "placement",
      child: null,
      sibling: null,
      parent: fiber,
    };

    currentFiber.stateNode = creatStateNode(currentFiber);

    if (i === 0) {
      // 第一个子节点，给 父Fiber添加child
      fiber.child = currentFiber;
    } else {
      preFiber.sibling = currentFiber;
    }

    // 记录上一个 Fiber
    preFiber = currentFiber;
  }
};

const executeTask = (fiber) => {
  /**
   * 构建子节点FIber
   * fiber节点的构建顺序
   * rootfiber节点手动构建，传入构建函数 reconcileChildren
   * 规定：传入构建函数的 fiber 节点为 当前Fiber节点
   * ------开始构建-----
   * 1.判断 当前Fiber节点是否存在子节点（通过虚拟DOM的props.children属性拿到虚拟子节点数组）。
   *    存在 继续；
   *    不存在
   *        1-2 判断 当前Fiber节点是否存在siling节点
   *            存在 把 fiber.siling 传入构建函数 结束；
   *            不存在 返回 fiber.parent/return 执行 1-2 判断 直到 fiber.parent/return不存在
   * 2.构建 当前Fiber节点下的所有子节点，并关联 子节点Fiber之间和当前Fiber的关系（parent/return、sibling、child）注意child指向第一个Fiber子节点
   * 3.通过 child 把 fiber.child 传入构建函数
   *
   * 简单描述一下
   * 首先会手动构建rootFiber对象
   * 之后构建rootFiber 对象的子节点的fiber 并且 把他们绑定上 关联关系
   * 之后通过关联关系构建 child Fiber 的 子节点 Fiber
   * 依次向下构建到最后 fiber 上不存在子节点了 那就找 sibling 节点 并且继续向下
   * 如果 siblig 节点也不存在 那就返回 父Fiber 找父Fiber 的sibling
   * 找到了就继续向下 没找着就继续向上找找父Fiber 的sibling
   * 直到 找到 没有父 fiber 的fiber节点 结束 就又回到了 rootFiber
   *
   */

  if (fiber.tag === "classComponent") {
    reconcileChildren(fiber, fiber.stateNode.render());
  } else {
    reconcileChildren(fiber, fiber.props.children);
  }

  // 返回新的子任务 构建fiber 时 返回的就是 fiber 节点
  if (fiber.child) {
    return fiber.child;
  }

  // 下边就是找 父 Fiber 对象的 sibling 指向的兄弟节点
  let currentExecuteFiber = fiber;

  while (currentExecuteFiber.parent) {
    // 把 当前节点Fiber追加到 当前 Fiber节点effects属性中
    currentExecuteFiber.effects = currentExecuteFiber.effects.concat([
      currentExecuteFiber,
    ]);

    // 每次往sibling或者往parent切换 时把 当前fiber节点中的effects 添加到 父 fiber 的effects中
    currentExecuteFiber.parent.effects =
      currentExecuteFiber.parent.effects.concat(currentExecuteFiber.effects);
    if (currentExecuteFiber.sibling) {
      return currentExecuteFiber.sibling;
    }

    currentExecuteFiber = currentExecuteFiber.parent;
  }
  // 赋值rootFiber
  pendingCommit = currentExecuteFiber;
  console.log(currentExecuteFiber);
};

const workLoop = (deadline) => {
  /**
   * 如果子任务不存在就去获取
   */
  if (!subTask) {
    subTask = getFirstTask();
  }

  /**
   * 循环执行任务
   * 代替之前 递归创建 DOM 实例的 过程
   * 如果任务存在并且浏览器有空闲时间就执行任务(实时获取浏览器剩余空闲时间大于 1ms)
   * executeTask 执行任务 接收任务 返回新任务
   */
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask);
  }

  // 初始化渲染
  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
};

const preformTask = (deadline) => {
  /**
   * 执行任务
   */
  workLoop(deadline);

  /**
   * 判断任务是否还存在 或者
   * 判断任务队列中是否还有任务没有执行
   * 如果有 在一次告诉浏览器在空闲时间执行任务
   */
  if (subTask || !taskQueue.isEmpty()) {
    requestIdleCallback(preformTask);
  }
};

/**
 *
 * @param {*} virtualDOM 虚拟DOM
 * @param {*} container 挂载节点实例
 * @param {*} oldDOM 老的真实节点的实例
 */
export function render(virtualDOM, container, oldDOM = container.firstChild) {
  /**
   * 1. 向任务队列中添加任务
   * 2. 指定在浏览器空闲时执行任务
   */

  /**
   * 任务就是通过 virtualDOM 对象 构建的 fiber 对象
   * 把 id = root 的DOM对象和对应的 virtualDOM对象放到任务队列
   */
  taskQueue.push({
    dom: container,
    props: { children: virtualDOM },
  });

  /**
   * 任务的调度开始，在浏览器空闲时间去执行任务
   */

  requestIdleCallback(preformTask);
}
