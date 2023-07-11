import { QuarkElement, customElement, state, } from "quarkc";
import style from "./index.css?inline";

@customElement({ tag: "app-sub", style })
class Sub extends QuarkElement {
  @state()
  title = 'docs'

  render() {
    return (
      <>
        <h3>Menu</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/docs">Sub</a></li>
          <li><a href="/notfound">Not found</a></li>
        </ul>
        <h1>Welcome to sub page</h1>
      </>
    );
  }
}