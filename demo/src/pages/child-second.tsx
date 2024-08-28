import { QuarkElement, customElement } from "quarkc"
import { Routes } from "quark-router"
import style from "./style.less?inline"

declare global {
  interface HTMLElementTagNameMap {
    "child-second": Child2;
  }
}

@customElement({ tag: "child-second", style })
class Child2 extends QuarkElement {
  private _routes = new Routes(this, [
    {path: '1', render: () => <div>child2-1 content</div>},
    {path: '2', render: () => <div>child2-2 content</div>},
  ])

  componentDidMount() {
    // console.log('dom loaded!', 'child-second')
  }

  render() {
    return (
      <>
        child2 content
        <ul>
          <li><quark-link to="2">child/2/2</quark-link></li>
        </ul>
        { this._routes.outlet() }
      </>
    );
  }
}