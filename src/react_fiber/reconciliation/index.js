import { arrified, createTaskQueue } from "../Misc";

const taskQueue = createTaskQueue();
// 子任务
let subTask = null;

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
      tag: "hostComponent", // 节点类型标记
      effects: [],
      effectTag: "",
      child: null,
      sibling: null,
      parent: fiber,
    };

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
   */
  reconcileChildren(fiber, fiber.props.children);

  console.log(fiber);
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
   * 如果任务存在并且浏览器有空闲时间就执行任务(实时获取浏览器剩余空闲时间大于 1ms)
   * executeTask 执行任务 接收任务 返回新任务
   */
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask);
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
