import {
  QuarkElement,
  customElement,
  state,
  property,
  watch,
  computed,
} from "../../src";
import { spy, SinonSpy } from 'sinon';


const tag = 'test-watch';
export const ImmediateWatcherSpies = new WeakMap<
  TestWatch,
  SinonSpy<Parameters<TestWatch['immediateStateWatcher']>, ReturnType<TestWatch['immediateStateWatcher']>>
>();
export const ComputedWatcherSpies = new WeakMap<TestWatch, SinonSpy>();

declare global {
  interface HTMLElementTagNameMap {
    [tag]: TestWatch;
  }
}

@customElement({ tag })
class TestWatch extends QuarkElement {
  constructor() {
    super();
    const watcherSpy = spy(this as TestWatch, 'immediateStateWatcher');
    ImmediateWatcherSpies.set(this, watcherSpy);
    ComputedWatcherSpies.set(this, spy());
  }

  componentWillUnmount() {
    ImmediateWatcherSpies.delete(this);
    ComputedWatcherSpies.delete(this);
  }
  
  @state()
  state = 0;

  @property({ type: Number })
  prop = 0;

  @watch('state')
  stateWatcher(newVal: number, oldVal: number) {}

  @watch('state', { immediate: true })
  immediateStateWatcher(newVal: number, oldVal: number) {
    ImmediateWatcherSpies.get(this)?.(newVal, oldVal);
  }

  @watch('prop')
  propWatcher(newVal: number, oldVal: number) {}

  @computed()
  get sum() {
    ComputedWatcherSpies.get(this)?.();
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
