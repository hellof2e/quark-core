import { QuarkElement, property, customElement, watch, state, computed } from "../../../packages/core"
import style from "./style.less?inline"

declare global {
  interface HTMLElementTagNameMap {
    "home-component": MyComponent;
  }
}

@customElement({ tag: "home-component", style })
class MyComponent extends QuarkElement {
  @property({ type: String })
  text = "hello world"

  @property({ type: Number })
  count = 0

  @state()
  loggerRunCount = 0

  @state()
  counter = 0;

  private _counterTimer = 0;

  initCounter() {
    const runCounter = () => {
      this._counterTimer = window.setTimeout(() => {
        this.counter++;
        runCounter();
      }, 1000)
    };
    runCounter();
  }

  componentDidMount() {
    console.log("home dom loaded!")
    this.initCounter();
  }

  componentWillUnmount() {
    console.log('home dom will unmount');
    window.clearTimeout(this._counterTimer);
  }

  @watch('count', { immediate: true })
  countLogger(newVal, oldVal) {
    console.log('home countLogger', newVal, oldVal);
    this.loggerRunCount++;
  }

  @computed()
  get counterGreet() {
    console.log('home @computed counterGreet')
    return `${this.text} ${this.counter} times`;
  }

  componentDidUpdate(propName, oldVal, newVal) {
    console.log("home dom updated!", propName, oldVal, newVal)
  }

  render() {
    return (
      <div className="main">
        home
        <br/>passed down count: {this.count}
        <br />watcher run count: {this.loggerRunCount}
        <br/>{this.counterGreet}
      </div>
    );
  }
}

export default MyComponent;
