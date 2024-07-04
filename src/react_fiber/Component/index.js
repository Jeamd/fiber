import { updateClassState } from "../reconciliation";

export default class Component {
  constructor(props) {
    this.props = props;
  }

  setState(pendingState) {
    updateClassState(this, pendingState);
  }
}
