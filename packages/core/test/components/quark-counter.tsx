import {
  QuarkElement,
  customElement,
  property,
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
  @property({ attribute: 'counter-title' })
  counterTitle = 'counter written with quarkc';
  
  @state()
  count = 0;

  add = () => {
    this.count++;
  }

  render() {
    return (
      <div className="counter">
        <div className="counter__title">{this.counterTitle}</div>
        <div className="counter__val">{this.count}</div>
        <button className="counter__add" onClick={this.add}>add</button>
      </div>
    );
  }
}
