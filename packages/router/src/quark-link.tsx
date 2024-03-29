import { QuarkElement, property, state, customElement } from 'quarkc'
import type { Routes } from './routes';
import type { Router } from './router';
import { RouterModeEnum } from './router';
import { RouterJumpEvent, RouterJumpMethodEnum, } from './routes';
import { eventBus } from './eventEmitter';
import style from './style.css?inline';

declare global {
  interface HTMLElementTagNameMap {
    'quark-link': QuarkLink;
  }
}

@customElement({ tag: 'quark-link', style })
class QuarkLink extends QuarkElement {
  @property({ type: String })
  to = ''

  @property({
    type: Boolean,
  })
  replace = false;

  @state()
  path = '';

  @state()
  prefix = '';

  @state()
  mode = RouterModeEnum.history;

  componentDidMount() {
    if (!this.to) return;
    /**
     * TODO 是否需要eventBus？a标签是否需要配置生成的路径
     * @param routes 路由对象
     */
    const listener = (routes: Routes) => {
      if (routes?.host.shadowRoot.contains(this)) {
        /* 如果接收到发送事件的距离最近的父/祖先级节点，则截获routes对象，获取link方法生成的path路径
        并取消监听，避免再接受到其他无关事件 */
        this.path = this.path || routes.link(this.to);
        eventBus.off('routes-host-mounted', listener);
      }
    };
    eventBus.on('routes-host-mounted', listener);
    eventBus.once('router-host-mounted', (router: Router) => {
      this.mode = router.mode;
      if (this.mode === RouterModeEnum.hash) {
        this.prefix = '#';
      }
    });
    eventBus.emit('link-mounted', null);
  }

  handleLinkClick(e) {
    e.preventDefault();
    const type = this.replace ? RouterJumpMethodEnum.replace : RouterJumpMethodEnum.push;
    const fullPath = this.path || this.to || '';
    this.dispatchEvent(new RouterJumpEvent(type, {
      path: fullPath.split('?')[0],
      fullPath, 
    }));
  }

  // TODO 可配置link生成的标签
  render() {
    return (
      <a href={this.prefix + (this.path || this.to)} onClick={(e) => this.handleLinkClick(e)} part="root">
          <slot></slot>
      </a>
    );
  }
}

export default QuarkLink;