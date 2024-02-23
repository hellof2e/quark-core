/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import type { ReactiveControllerHost } from 'quarkc';
import { Routes, RouterJumpMethodEnum } from './routes';
import type {RouteConfig, BaseRouteConfig, RouterJumpDetail } from './routes';
import { eventBus } from "./eventEmitter";

export enum RouterModeEnum {
  hash = 'hash',
  history = 'history',
}

// We cache the origin since it can't change
const origin = location.origin || location.protocol + '//' + location.host;

/**
 * A root-level router that installs global event listeners to intercept
 * navigation.
 *
 * This class extends Routes so that it can also have a route configuration.
 *
 * There should only be one Router instance on a page, since the Router
 * installs global event listeners on `window` and `document`. Nested
 * routes should be configured with the `Routes` class.
 */
export class Router extends Routes {
  mode: RouterModeEnum;

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    routes: Array<RouteConfig>,
    options?: {
      fallback?: BaseRouteConfig,
      mode?: RouterModeEnum,
    }
  ) {
    super(host, routes, options);
    this.mode = options?.mode || RouterModeEnum.history;
    if (this.mode === RouterModeEnum.hash && !window.location.hash) {
      window.history.replaceState({}, '', window.location.href.replace(/#.*/, '') + '#/');
    }
  }

  override hostConnected() {
    super.hostConnected();
    window.addEventListener('click', this._onClick);
    window.addEventListener('popstate', this._onPopState);
    // Kick off routed rendering by going to the current URL
    this.goto(this._resolvePath(window.location));
  }

  override hostDisconnected() {
    super.hostDisconnected();
    window.removeEventListener('click', this._onClick);
    window.removeEventListener('popstate', this._onPopState);
  }

  override hostMounted() {
    super.hostMounted();
    eventBus.emit("router-host-mounted", this);
    eventBus.on("link-mounted", () => {
      eventBus.emit("router-host-mounted", this);
    });
  }

  protected override addListeners() {
    super.addListeners();
    const listener = (e: CustomEvent<RouterJumpDetail>) => {
      e.stopImmediatePropagation();
      const { path, fullPath } = e.detail;
      this._changeState(path, fullPath, e.type as RouterJumpMethodEnum);
    };
    this.host.addEventListener(RouterJumpMethodEnum.push, listener, false);
    this.host.addEventListener(RouterJumpMethodEnum.replace, listener, false);
  }

  private _onClick = (e: MouseEvent) => {
    const isNonNavigationClick =
      e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey;
    if (e.defaultPrevented || isNonNavigationClick) {
      return;
    }

    const anchor = e
      .composedPath()
      .find((n) => (n as HTMLElement).tagName === 'A') as
      | HTMLAnchorElement
      | undefined;
    if (
      anchor === undefined ||
      anchor.target !== '' ||
      anchor.hasAttribute('download') ||
      anchor.getAttribute('rel') === 'external'
    ) {
      return;
    }

    const href = anchor.href;
    if (href === '' || href.startsWith('mailto:')) {
      return;
    }

    const location = window.location;
    if (anchor.origin !== origin) {
      return;
    }

    e.preventDefault();
    if (href !== location.href) {
      window.history.pushState({}, '', href);
      this.goto(this._resolvePath(anchor));
    }
  };

  private _changeState(path:string, fullPath: string, method?: RouterJumpMethodEnum) {
    if (this.mode === RouterModeEnum.hash) {
      fullPath = `#${fullPath}`;
    }
    if (method === RouterJumpMethodEnum.replace) {
      window.history.replaceState({}, '', fullPath);
    } else {
      window.history.pushState({}, '', fullPath);
    }
    this.goto(path);
  }

  private _resolvePath(anchor: HTMLAnchorElement|Location) {
    if (this.mode === RouterModeEnum.history) {
      return anchor.pathname;
    }
    return anchor.hash.replace('#', '');
  }

  private _onPopState = (_e: PopStateEvent) => {
    this.goto(this._resolvePath(window.location));
  };
}
