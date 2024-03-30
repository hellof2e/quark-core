import { QuarkElement, property, customElement, state, computed } from "quarkc"
import { Router } from "quark-router"
import "./pages/home"
import "./pages/sub"
import "./pages/child"
import style from "./index.less?inline"

declare global {
  interface HTMLElementTagNameMap {
    "my-component": MyComponent;
  }
}

@customElement({ tag: "my-component", style })
class MyComponent extends QuarkElement {
  private _routes = new Router(this, [
    {path: '/', render: () => <home-component count={this.count} />},
    {path: '/sub/:id', render: ({id}) => <sub-component id={id}/>},
    {path: '/child/*', render: () => <child-component/>},
    {path: '/child', render: () => <child-component/>},
  ], {
    mode: 'hash'
  })


  @property({ type: Number }) // 外部属性
  count = 0 // 可以设置默认值

  @property({ type: String })
  text

  @state()
  innerCount = 0;

  @computed()
  get resolvedCount() {
    return this.count + this.innerCount;
  }

  add = () => {
    // 内部事件
    this.innerCount += 1
  };

  shouldComponentUpdate(propName, oldValue, newValue) {
    if (propName === 'innerCount') {
      console.log(propName, oldValue, newValue)
      return newValue <= 10 || newValue >= 20;
    }

    return true;
  }

  componentDidUpdate() {
    console.log("parent dom updated!")
  }

  // componentDidMount() {
  //   console.log("parent dom loaded!")
  // }

  render() {
    return (
      <>
        <div className="main">
          <div>
            <a href="https://quarkc.hellobike.com" target="_blank">
              <img
                src="https://quark-design.hellobike.com/assets/quark-logo.f9a6a307.png"
                class="logo"
                alt="quark logo"
              />
            </a>
          </div>

          <h1>{this.text} Quarkc</h1>

          <div className="card">
            <button onClick={this.add}>count is: {this.resolvedCount}</button>
          </div>
        </div>
        <ul>
          <li><quark-link to="/">Home</quark-link></li>
          <li><quark-link to="/sub/3222?d=1&we=2">/sub/3222</quark-link></li>
          <li><quark-link replace to="/child/1">/Child/1</quark-link></li>
        </ul>
        <div className="router-render">
          { this._routes.outlet() }
        </div>
      </>
    );
  }
}

export default MyComponent;
