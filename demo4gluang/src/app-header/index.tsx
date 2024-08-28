import { QuarkElement, customElement, state, watch, createRef } from "quarkc"
import style from "./index.less?inline"
import suntzu from "./suntzu.jpeg"

// 链接全局store
import { connectStore } from '../gluang';
// 使用全家状态/方法
import { store } from '../store';


@customElement({ tag: "app-header", style })
class MyComponent extends connectStore(QuarkElement) {
  @state()
  showAuthorName = false

  @watch('showAuthorName')
  handleShowChange(newVal) {
    // console.log('handleShowChange', newVal)
    store.author = newVal ? 'Sun Tzu' : 'Guess who?';
    this.$nextTick(() => {
      const { current: btn } = this.btn;
      if (btn) {
        // console.log('nextTick, content of btn:', btn.textContent)
      }
    })
  }

  handleSwitch = () => {
    this.showAuthorName = !this.showAuthorName;
  }

  componentDidUpdate(propName, oldVal, newVal) {
    // console.log('componentDidUpdate', propName, oldVal, newVal)
  }

  componentUpdated() {
    // console.log('componentUpdated', this.showAuthorName, store.author)
  }

  btn = createRef(null)

  render() {
    return (
      <header>
        <h1 onClick={this.handleSwitch}>The Art of War - <span class="btn" ref={this.btn}>{store.author}</span></h1>
        {
          store.author === 'Sun Tzu' ?
            <img src={suntzu} alt="" /> : ''
        }
      </header>
    );
  }
}
