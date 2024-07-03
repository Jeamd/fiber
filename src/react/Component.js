import diff from "./diff";

export default class Component {
  constructor(props) {
    this.props = props;
  }

  setState(state) {
    this.state = Object.assign({}.this.state, state);
    // 获取到新的 virtualDOM
    const virturalDOM = this.render();
    const oldDOM = this.getDOM();

    diff(virturalDOM, oldDOM.parentNode, oldDOM);
  }

  setDOM(dom) {
    this._dom = dom;
  }

  getDOM() {
    return this._dom;
  }
}
