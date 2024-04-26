import {
  QuarkElement,
  customElement,
  state,
  property,
  watch,
  computed,
} from "../../src"

const tag = 'test-watch';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: TestWatch;
  }
}

@customElement({ tag })
class TestWatch extends QuarkElement {
  @state()
  state = 0;

  @property({ type: Number })
  prop = 0;

  @watch('state')
  stateWatcher(newVal: number, oldVal: number) {
    console.log('stateWatcher', newVal, oldVal)
  }

  @watch('prop')
  propWatcher(newVal: number, oldVal: number) {}

  @computed()
  get sum() {
    return this.state + this.prop;
  }
  
  render() {
    return (
      <div className="test">
        <div className="state">{this.state}</div>
        <div className="prop">{this.prop}</div>
        <div className="sum">{this.sum}</div>
      </div>
    );
  }
}
