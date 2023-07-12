import { QuarkElement, customElement, state,  createRef, } from "quarkc"
import style from "./index.less?inline"

@customElement({ tag: "app-home", style })
class Home extends QuarkElement {
  // https://quarkc.hellobike.com/#/zh-CN/docs/properties
  @state()
  msg = 'Welcome to Your Quark App'

  // https://quarkc.hellobike.com/#/zh-CN/docs/lifecycle
  // componentDidMount() {}
  // shouldComponentUpdate() {}
  // componentDidUpdate() {}
  // componentWillUnmount() {}

  render() {
    return (
      <>
        <div class="hello">
          <img alt="quark logo" width="150" src="https://m.hellobike.com/resource/helloyun/13459/BI7jn_quark-logo.png?x-oss-process=image/quality,q_80" />
          <h1>{ this.msg }</h1>
          <p>
            For a guide and recipes on how to configure / customize this project, <br />
            check out the
            <a href="https://quarkc.hellobike.com" target="_blank" rel="noopener"> Quarkc documentation</a>.
          </p>
          <h3>Route</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/sub">Sub</a></li>
          </ul>
        </div>
      </>
    )
  }
}