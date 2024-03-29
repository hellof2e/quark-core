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

  private _busRouterLinstner = () => {
    eventBus.emit("router-host-mounted", this);
  }

  private _rootHostListener: ((e: CustomEvent<RouterJumpDetail>) => void) | undefined;

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
    window.addEventListener('popstate', this._onPopState);
    // Kick off routed rendering by going to the current URL
    this.goto(this._resolvePath(window.location));
  }

  override hostDisconnected() {
    super.hostDisconnected();
    window.removeEventListener('popstate', this._onPopState);
    eventBus.off("link-mounted", this._busRouterLinstner);
    this.host.removeEventListener(RouterJumpMethodEnum.push, this._rootHostListener!);
    this.host.removeEventListener(RouterJumpMethodEnum.replace, this._rootHostListener!);
  }

  override hostMounted() {
    super.hostMounted();
    eventBus.emit("router-host-mounted", this);
    eventBus.on("link-mounted", this._busRouterLinstner);
  }

  protected override addListeners() {
    super.addListeners();
    this._rootHostListener = (e: CustomEvent<RouterJumpDetail>) => {
      e.stopImmediatePropagation();
      this._changeState(e.detail, e.type as RouterJumpMethodEnum);
    };
    this.host.addEventListener(RouterJumpMethodEnum.push, this._rootHostListener, false);
    this.host.addEventListener(RouterJumpMethodEnum.replace, this._rootHostListener, false);
  }

  private async _changeState(detail: RouterJumpDetail, method?: RouterJumpMethodEnum) {
    const {
      path, fullPath, callback
    } = detail;
    const prefix = this.mode === RouterModeEnum.hash ? '#' : '';
    if (method === RouterJumpMethodEnum.replace) {
      window.history.replaceState({}, '', prefix + fullPath);
    } else {
      window.history.pushState({}, '', prefix + fullPath);
    }
    /* TODO 由于未渲染的childRoute的goto方法在onconnect的时候才执行，无法在父级执行的goto递归中获取
    暂未实现路由进入完成后的callback及错误捕获等 */
    await this.goto(path);
    callback && callback();
  }

  private _resolvePath(anchor: HTMLAnchorElement|Location) {
    if (this.mode === RouterModeEnum.history) {
      return anchor.pathname;
    }
    return anchor.hash?.replace('#', '').split('?')[0];
  }

  private _onPopState = (_e: PopStateEvent) => {
    this.goto(this._resolvePath(window.location));
  };
}
