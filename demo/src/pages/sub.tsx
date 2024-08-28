import { QuarkElement, property, customElement } from "quarkc"
import style from "./style.less?inline"

declare global {
  interface HTMLElementTagNameMap {
    "sub-component": MyComponent;
  }
}

@customElement({ tag: "sub-component", style })
class MyComponent extends QuarkElement {
  @property({ type: String })
  id = ""


  componentDidMount() {
    // console.log("dom loaded!", 'sub')
    // ...
  }

  render() {
    return (
      <div className="main">
        sub-page id={this.id}
      </div>
    );
  }
}

export default MyComponent;
