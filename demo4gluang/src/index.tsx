import { QuarkElement, customElement } from "quarkc"
import style from "./index.less?inline"

import './app-article'
import './app-header'

@customElement({ tag: "my-app", style })
class MyApp extends QuarkElement {
  render() {
    return (
      <div class="app">
        <app-header />
        <app-article />
      </div>
    );
  }
}
