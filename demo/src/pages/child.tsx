import { QuarkElement, property, customElement } from "quarkc"
import { Routes } from "quark-router"
import style from "./style.less?inline"

declare global {
  interface HTMLElementTagNameMap {
    "child-component": ChildComponent;
    "child1": Child1;
    "child2": Child2;
  }
}

@customElement({ tag: "child-first", style })
class Child1 extends QuarkElement {
  @property({ type: String })
  text = "hello world"


  componentDidMount() {
    console.log("dom loaded!")
    // ...
  }

  render() {
    return (
      <>
        child1 content
      </>
    );
  }
}
@customElement({ tag: "child-second", style })
class Child2 extends QuarkElement {
  @property({ type: String })
  text = "hello world"


  componentDidMount() {
    console.log("dom loaded!")
    // ...
  }

  render() {
    return (
      <>
        child2 content
      </>
    );
  }
}

@customElement({ tag: "child-component", style })
class ChildComponent extends QuarkElement {
  private _routes = new Routes(this, [
    {path: '1', render: () => <child-first/>},
    {path: '2', render: () => <child-second/>},
  ])
  @property({ type: String })
  text = "hello world"


  componentDidMount() {
    // console.log("dom loaded!", this._routes)
    // ...
  }

  render() {
    return (
      <div className="main">
        <ul>
          <li><a href="/child/1">child1</a></li>
          <li><a href="/child/2">child2</a></li>
        </ul>
        <div className="router-render">
          { this._routes.outlet() }
        </div>
      </div>
    );
  }
}

export {
  Child1, Child2, ChildComponent
};
