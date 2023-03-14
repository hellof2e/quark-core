import { QuarkElement, Fragment, property, customElement } from "quarkc";
import logo from '/quark.png'
import style from "./app.css?inline";

@customElement({ tag: "quark-count", style })
class MyElement extends QuarkElement {
  @property({
    type: Number
  })
  count = 0;
  
  add = () => {
    this.count += 1;
    console.log('button was clicked', typeof this.count);
  }
  
  render() {
    return (
      <Fragment>
        <div>
          <a href="https://quark-design.hellobike.com" target="_blank">
            <img src={logo} class="logo" alt="quark logo" />
          </a>
        </div>
        
        <h1>Quark - 为跨技术栈而生</h1>
          

        <div className="card">
          <button onClick={this.add}>
            count is: { this.count }
          </button>
          <p>
            Edit <code>src/app.tsx</code> and save to test HMR
          </p>
        </div>
      </Fragment>
    );
  }
}

export default MyElement;