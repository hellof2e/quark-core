import { QuarkElement, customElement } from "quarkc"
import style from "./index.less?inline"
import suntzu from "./suntzu.jpeg"

// 链接全局store
import { connectStore } from '../gluang';
// 使用全家状态/方法
import { store } from '../store';


@customElement({ tag: "app-header", style })
class MyComponent extends connectStore(QuarkElement) {

  handleSwitch = () => {
    store.author = store.author === 'Sun Tzu' ? 'Guess who?' : 'Sun Tzu';
  }

  render() {
    return (
      <header>
        <h1 onClick={this.handleSwitch}>The Art of War - <span class="btn">{store.author}</span></h1>
        {
          store.author === 'Sun Tzu' ?
            <img src={suntzu} alt="" /> : ''
        }
      </header>
    );
  }
}
