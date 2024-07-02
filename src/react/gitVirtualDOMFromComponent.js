export function getFunctionComponentVirtualDOM(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {});
}

export function getClassComponentVirtualDOM(virtualDOM) {
  const instance = new virtualDOM.type();
  return instance.render();
}
