import { QuarkElement, property, state, customElement } from 'quarkc'
import type { Routes } from './routes';
import type { Router } from './router';
import { RouterModeEnum } from './router';
import { eventBus } from './eventEmitter';
import style from './style.css';

declare global {
  interface HTMLElementTagNameMap {
    'quark-link': QuarkLink;
  }
}

@customElement({ tag: 'quark-link', style })
class QuarkLink extends QuarkElement {
  @property({ type: String })
  to = ''

  @state()
  path = '';

  @state()
  prefix = '';

  @state()
  mode = RouterModeEnum.history;

  componentDidMount() {
    if (!this.to) return;

    const listener = (routes: Routes) => {
      if (routes?.host.shadowRoot.contains(this)) {
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

  // TODO 内置点击事件
  handleLinkClick() {
  }

  // TODO 可配置link生成的标签
  render() {
    return (
      <a href={this.prefix + (this.path || this.to)} onClick={() => this.handleLinkClick()}>
          <slot></slot>
      </a>
    );
  }
}

export default QuarkLink;