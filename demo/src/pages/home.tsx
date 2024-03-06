import { QuarkElement, property, customElement } from "quarkc"
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


  componentDidMount() {
    console.log("dom loaded!")
    // ...
  }

  render() {
    return (
      <div className="main">
        home {this.text}
      </div>
    );
  }
}

export default MyComponent;
