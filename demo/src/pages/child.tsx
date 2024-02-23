import { QuarkElement, property, customElement } from "quarkc"
import { Routes, RouteEvent, RouteMethodEnum } from "quark-router"
import "./child-second"
import style from "./style.less?inline"

declare global {
  interface HTMLElementTagNameMap {
    "child-component": ChildComponent;
    "child-first": Child1;
  }
}

@customElement({ tag: "child-first", style })
class Child1 extends QuarkElement {
  @property({ type: String })
  text = "hello world"


  componentDidMount() {
  }

  goToLink() {
    // this.$emit('quark-route-push', { detail: { path: '1122', query: { a: 1, b: 2 } }, composed: true, })
    this.dispatchEvent(
      new RouteEvent(RouteMethodEnum.push, {
        path: '2/1',
        query: {
          word1: 'hello',
          word2: 'quark',
        },
      })
    );
  }

  

  render() {
    return (
      <>
        child1 content
        <button onClick={() => this.goToLink()}>go to child2</button>
      </>
    );
  }
}

@customElement({ tag: "child-component", style })
class ChildComponent extends QuarkElement {
  private _routes = new Routes(this, [
    {path: '1', render: () => <child-first/>},
    {path: '2/*', render: () => <child-second/>},
  ])
  @property({ type: String })
  text = "hello world"


  componentDidMount() {
    const aa = this._routes.link('1')
    const bb = this._routes.link('2/3')
    console.log(aa, bb, 1132389)
    console.log("inner loaded!")

  }

  render() {
    return (
      <div className="main">
        <ul>
          <li><quark-link to="1">child1</quark-link></li>
          <li><quark-link to="2/1">child2-1</quark-link></li>
        </ul>
        <div className="router-render">
          { this._routes.outlet() }
        </div>
      </div>
    );
  }
}

export {
  ChildComponent
};
