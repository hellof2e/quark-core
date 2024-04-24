import {
  QuarkElement,
  customElement,
  state,
} from "../../src"

const tag = 'quark-counter';

declare global {
interface HTMLElementTagNameMap {
  [tag]: QuarkCounter;
}
}

@customElement({ tag })
class QuarkCounter extends QuarkElement {
  @state()
  count = 0;

  add = () => {
    this.count++;
  }

  render() {
    return (
      <div className="counter">
        <div className="counter__val">{this.count}</div>
        <button className="counter__add">add</button>
      </div>
    );
  }
}

export default QuarkCounter;
