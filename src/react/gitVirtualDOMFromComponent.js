export function getFunctionComponentVirtualDOM(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {});
}

export function getClassComponentVirtualDOM(virtualDOM) {
  const instance = new virtualDOM.type(virtualDOM.props || {});
  const virtualDOM = instance.render();
  virtualDOM.instance = instance;
  return virtualDOM;
}
