import {
    QuarkElement,
    customElement,
} from "../../src"

const tag = 'hello-world';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: HelloWorld;
  }
}

@customElement({ tag })
class HelloWorld extends QuarkElement {
  render() {
    return <div>hello, world!</div>;
  }
}
