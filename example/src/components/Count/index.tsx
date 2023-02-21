import QuarkElement, {
  Fragment,
  property,
  state,
  createRef,
  customElement,
// @ts-ignore
} from "@quarkc";
import style from "./style.css";

@customElement({ tag: "quark-count", style })
class QuarkButton extends QuarkElement {
  @property()
  count: number = 0;
  add = () => {
    this.count = Number(this.count) + 1;
  }
  render() {
    return (
      <Fragment>
        <button onClick={this.add}>count is: { this.count}</button>
      </Fragment>
    );
  }
}

export default QuarkButton;