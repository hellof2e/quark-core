import {
  QuarkElement,
  customElement,
  state,
} from "../../src/main"

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
        <div className="value">{this.count}</div>
        <button className="btn" onClick={this.add}>add</button>
      </div>
    );
  }
}
