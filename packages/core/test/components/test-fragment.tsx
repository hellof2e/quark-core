import {
  QuarkElement,
  customElement,
} from "../../src"

const tag = 'test-fragment';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: TestFragment;
  }
}

@customElement({ tag })
class TestFragment extends QuarkElement {
  render() {
    return (
      <>
        <div className="root1">root1</div>
        <div className="root2">root2</div>
      </>
    );
  }
}
