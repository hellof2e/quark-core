import { QuarkElement, Fragment, property, customElement } from "quarkc";
import viteLogo from '/vite.svg'
import style from "./app.css?inline";

@customElement({ tag: "quark-count", style })
class MyElement extends QuarkElement {
  @property({
    type: Number
  })
  count = 0;
  
  add = () => {
    console.log('button was clicked', typeof this.count);
    this.count += 1;
  }
  
  render() {
    return (
      <Fragment>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} class="logo" alt="Vite logo" />
          </a>
          <a href="https://quark-design.hellobike.com" target="_blank">
            <img src="https://quark-design.hellobike.com/assets/quark-logo.7fd50e67.png" class="logo" alt="quark logo" />
          </a>
        </div>
        
        <h2>Quark - 下一代前端组件框架</h2>
          
        <button onClick={this.add}>
          count is: { this.count }
        </button>
      </Fragment>
    );
  }
}

export default MyElement;