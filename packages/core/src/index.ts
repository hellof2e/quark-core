import { createElement as h, Fragment as OriginFragment } from './core/create-element'
import { render } from './core/render'
import { isFunction } from './core/util'
import { PropertyDeclaration, converterFunction } from "./models"
import DblKeyMap from "./dblKeyMap"
import { EventController, EventHandler } from "./eventController"
import {version} from '../package.json'
import { Dep, UserWatcherOptions, Watcher } from './computed';
import type { ReactiveControllerHost, ReactiveController } from "./reactiveController"
export type { ReactiveControllerHost, ReactiveController }


export interface Ref<T = any> {
  current: T;
}

export function createRef<T = any>(): Ref<T | null> {
  return { current: null };
}

export const Fragment: any = OriginFragment;

if(process.env.NODE_ENV === 'development') {
  console.info(`%cquarkc@${version}`, 'color: white;background:#9f57f8;font-weight:bold;font-size:10px;padding:2px 6px;border-radius: 5px','Running in dev mode.')
}

type Falsy = false | 0 | '' | null | undefined

/** false和0不算空 */
const isEmpty = (val: unknown): val is Exclude<Falsy, false | 0> => !(val || val === false || val === 0);

const defaultConverter: converterFunction = (value, type?) => {
  let newValue = value;
  switch (type) {
    case Number:
      newValue = isEmpty(value) ? value : Number(value);
      break;
    case Boolean:
      newValue = !([null, "false", false, undefined].indexOf(value) > -1);
      break;
  }
  return newValue;
};

const defaultPropertyDeclaration: PropertyDeclaration = {
  observed: true,
  type: String,
  converter: defaultConverter,
};

export const property = (options: PropertyDeclaration = {}) => {
  return (target: QuarkElement, propName: string) => {
    return (target.constructor as typeof QuarkElement).createProperty(
      propName,
      options
    );
  };
};

export const state = () => {
  return (target: QuarkElement, propName: string) => {
    return (target.constructor as typeof QuarkElement).createState(propName);
  };
};

export const computed = () => {
  return (target: QuarkElement, propName: string, descriptor: PropertyDescriptor) => {
    return (target.constructor as typeof QuarkElement).computed(
      propName,
      descriptor,
    );
  };
};

export const watch = (path: string, options?: Omit<UserWatcherOptions, 'cb'>) => {
  return (target: QuarkElement, propName: string, descriptor: PropertyDescriptor) => {
    return (target.constructor as typeof QuarkElement).watch(
      propName,
      descriptor,
      path,
      options,
    );
  };
}

type PropertyDescriptorCreator = (defaultValue?: any) => PropertyDescriptor

const StateDescriptors: DblKeyMap<
  typeof QuarkElement,
  string,
  PropertyDescriptorCreator
> = new DblKeyMap();

/** convert attribute value to prop value */
type Attr2PropConverter = (value: string | null) => any

/** all declared props' definitions, with attribute name as sub key */
const PropDefs: DblKeyMap<
  typeof QuarkElement,
  string,
  {
    /** prop decorator options passed */
    options: PropertyDeclaration;
    /** created dependency for the prop, it's initialization will be delayed until Object.defineProperty */
    propName: string;
  }
> = new DblKeyMap();

/** quark element instance's props' map, with attribute name as sub key */
const Props: DblKeyMap<
  QuarkElement,
  string,
  {
    /** created dependency for the prop */
    dep: Dep;
    converter: Attr2PropConverter;
    propName: string;
  }
> = new DblKeyMap();

/** quark element instance's prop values stored */


const ComputedDescriptors: DblKeyMap<
  typeof QuarkElement,
  string,
  PropertyDescriptorCreator
> = new DblKeyMap();

const UserWatchers: DblKeyMap<
  typeof QuarkElement,
  string,
  {
    path: string;
  } & UserWatcherOptions
> = new DblKeyMap();

export function customElement(
  params: string | { tag: string; style?: string }
) {
  const { tag, style = "" } =
    typeof params === "string" ? { tag: params } : params;

  return (target: typeof QuarkElement) => {
    class NewQuarkElement extends target {
      static get observedProps() {
        const defs = PropDefs.get(target);

        if (!defs) {
          return []
        }
        
        return [...defs.entries()].filter(([_, { options }]) => !!options.observed);
      }

      static get observedAttributes() {
        return this.observedProps.map(([attrName]) => attrName);
      }

      static isBooleanProperty(attrName: string) {
        const def = PropDefs.get(target)?.get(attrName);

        if (!def) {
          return false;
        }

        return def.options.type === Boolean;
      }

      constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "open" });

        if (shadowRoot) {
          // Create Css
          if (typeof CSSStyleSheet === "function" && shadowRoot.adoptedStyleSheets) {
            // Use constructed style first
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(style);
            shadowRoot.adoptedStyleSheets = [sheet];
          } else {
            // Fallback
            const styleEl = document.createElement("style");
            styleEl.innerHTML = style;
            shadowRoot.append(styleEl);
          }
        }

        // * 获取包装类实例的父类（即继承了QuarkElement的类——用户书写的组件类）
        // * get parent class (user-defined component class that extends QuarkElement) of wrapper class
        const Component = Object.getPrototypeOf(this.constructor);
        const stateDescriptors = StateDescriptors.get(Component);
        
        if (stateDescriptors?.size) {
          stateDescriptors.forEach((descriptorCreator, propName) => {
            Object.defineProperty(
              this,
              propName,
              descriptorCreator(this[propName])
            );
          });
        }

        /**
         * 重写类的属性描述符，并重写属性初始值。
         * 注：由于子类的属性初始化晚于当前基类的构造函数，同名属性会导致属性描述符被覆盖，所以必须放在基类构造函数之后执行
         */
        const propDefs = PropDefs.get(Component);
        
        if (propDefs?.size) {
          propDefs.forEach((def, attrName) => {
            const {
              options: {
                type,
                converter,
              },
              propName,
            } = def;
            const defaultValue = this[propName];
            const convertAttrValue = (value: string | null) => {
              // 判断val是否为空值
              // const isEmpty = () => !(val || val === false || val === 0)
              // 当类型为非Boolean时，通过isEmpty方法判断val是否为空值
              // 当类型为Boolean时，在isEmpty判断之外，额外认定空字符串不为空值
              //
              // 条件表达式推导过程
              // 由：(options.type !== Boolean && isEmpty(val)) || (options.type === Boolean && isEmpty(val) && val !== '')
              // 变形为：isEmpty(val) && (options.type !== Boolean || (options.type === Boolean && val !== ''))
              // 其中options.type === Boolean显然恒等于true：isEmpty(val) && (options.type !== Boolean || (true && val !== ''))
              // 得出：isEmpty(val) && (options.type !== Boolean || val !== '')
              if (
                isEmpty(value)
                && (type !== Boolean || value !== '')
                && !isEmpty(defaultValue)
              ) {
                return defaultValue;
              }

              if (isFunction(converter)) {
                return converter(value, type) as string;
              }

              return value;
            };
            const dep = new Dep();
            Props.set(this, attrName, {
              propName,
              dep,
              converter: convertAttrValue,
            });
            // make attribute reactive
            Object.defineProperty(
              this,
              propName,
              {
                get(this: QuarkElement): any {
                  dep.depend()
                  return convertAttrValue(this.getAttribute(attrName));
                },
                set(this: QuarkElement, newValue: string | boolean | null) {
                  let val = newValue;
        
                  if (isFunction(converter)) {
                    val = converter(newValue, type);
                  }
        
                  if (val) {
                    if (typeof val === "boolean") {
                      this.setAttribute(attrName, "");
                    } else {
                      this.setAttribute(attrName, val);
                    }
                  } else {
                    this.removeAttribute(attrName);
                  }
                },
                configurable: true,
                enumerable: true,
              }
            );
          });
        }

        const computedDescriptors = ComputedDescriptors.get(Component)

        if (computedDescriptors?.size) {
          computedDescriptors.forEach((descriptorCreator, propKey) => {
            Object.defineProperty(
              this,
              propKey,
              descriptorCreator()
            );
          });
        }

        const watchers = UserWatchers.get(Component)

        if (watchers?.size) {
          watchers.forEach(({
            path,
            ...options
          }) => {
            new Watcher(this, path, options);
          });
        }
      }
    }

    if (!customElements.get(tag)) {
      customElements.define(tag, NewQuarkElement);
    }
  };
}

export class QuarkElement extends HTMLElement implements ReactiveControllerHost {
  static h = h;
  
  static Fragment = Fragment;
  
  private _updatedQueue: (() => void)[] = [];

  /** 组件是否已挂载 */
  private _mounted = false;
  
  private _renderWatcher: Watcher | undefined = undefined;

  private queueUpdated(cb: () => void) {
    this._updatedQueue.push(cb)
  }

  private hasDidUpdateCb() {
    return this.hasOwnLifeCycleMethod('componentDidUpdate');
  }

  private hasOwnLifeCycleMethod(methodName: 'componentDidMount' | 'componentDidUpdate' | 'shouldComponentUpdate') {
    return Object.getPrototypeOf(
      this.constructor // base class
    ) // wrapper class
      .prototype // user-defined class
      .hasOwnProperty(methodName);
  }

  /** handler for processing tasks after render */
  public postRender() {
    if (!this._mounted) {
      this._mounted = true;
      const hasPendingUpdate = !!this._updatedQueue.length;

      if (this.hasOwnLifeCycleMethod('componentDidMount')) {
        if (hasPendingUpdate) {
          // * when componentDidMount and componentDidUpate are both defined
          // * componentDidUpate should be ignored at mount phase
          this._updatedQueue = [];
          this.componentDidMount();
          return;
        }

        this.componentDidMount();
      } else {
        // * for historic reasons, componentDidUpate was used for both mounting and updating
        // * so we should also call it at mount phase
        if (process.env.NODE_ENV === 'development') {
          if (hasPendingUpdate) {
            console.warn('by design, componentDidUpdate should not be invoked at mount phase, use componentDidMount for initialization logic instead.');
          }
        }
      }
    }
    
    this._updatedQueue.forEach(cb => cb())
    this._updatedQueue = [];
  }

  // 内部属性装饰器
  protected static getStateDescriptor(propName: string): () => PropertyDescriptor {
    return (defaultValue?: any) => {
      let value = defaultValue;
      let dep: Dep | undefined;
      const getDep = () => dep || (dep = new Dep());
      return {
        get(this: QuarkElement): any {
          getDep().depend()
          return value;
        },
        set(this: QuarkElement, newValue: string | boolean | null) {
          const resolvedOldVal = value;

          if (Object.is(resolvedOldVal, newValue)) {
            return;
          }

          if (this.shouldPreventUpdate(propName, resolvedOldVal, newValue)) {
            return;
          }

          value = newValue;
          getDep().notify();

          if (this.hasDidUpdateCb()) {
            this.queueUpdated(() => {
              this.componentDidUpdate(propName, resolvedOldVal, newValue);
            });
          }
        },
        configurable: true,
        enumerable: true,
      };
    };
  }

  static createProperty(propName: string, options: PropertyDeclaration) {
    const attrName = options.attribute || propName;
    PropDefs.set(this, attrName, {
      options: {
        ...defaultPropertyDeclaration,
        ...options,
      },
      propName,
    });
  }

  static createState(propName: string) {
    StateDescriptors.set(this, propName, this.getStateDescriptor(propName));
  }

  static computed(propName: string, descriptor: PropertyDescriptor) {
    if (descriptor.get) {
      ComputedDescriptors.set(this, propName, () => {
        let watcher: Watcher;
        return {
          configurable: true,
          enumerable: true,
          get(this: QuarkElement) {
            if (!watcher) {
              watcher = new Watcher(this, descriptor.get!, { computed: true });
            }

            watcher.dep.depend();
            return watcher.get();
          },
        };
      });
    }
  }

  static watch(
    propName: string,
    descriptor: PropertyDescriptor,
    path: string,
    options?: UserWatcherOptions,
  ) {
    const { value } = descriptor;

    if (typeof value === 'function') {
      UserWatchers.set(this, propName, {
        ...options,
        path,
        cb: value,
      });
    }
  }

  private eventController: EventController = new EventController();

  private _controllers?: Set<ReactiveController>;

  private rootPatch = (newRootVNode: any) => {
    if (this.shadowRoot) {
      render(newRootVNode, this.shadowRoot);
    }
  };

  private _render() {
    const newRootVNode = this.render();

    if (newRootVNode) {
      this.rootPatch(newRootVNode);
    }
  }

  /** 对传入的值根据类型进行转换处理 */
  private _updateProps() {
    (this.constructor as any).observedProps.forEach(
      ([attrName, { propName }]) => {
        this[propName] = this.getAttribute(attrName);
      }
    );
  }

  /**
   * Registers a `ReactiveController` to participate in the element's reactive
   * update cycle. The element automatically calls into any registered
   * controllers during its lifecycle callbacks.
   *
   * If the element is connected when `addController()` is called, the
   * controller's `hostConnected()` callback will be immediately called.
   * @category controllers
   */
  addController(controller: ReactiveController) {
    (this._controllers ??= new Set()).add(controller);
    if (this.shadowRoot && this.isConnected) {
      controller.hostConnected?.();
    }
  }

  /**
   * Removes a `ReactiveController` from the element.
   * @category controllers
   */
  removeController(controller: ReactiveController) {
    this._controllers?.delete(controller);
  }

  // Reserve, may expand in the future
  requestUpdate() {
    console.error('requestUpdate', this)
    this.getOrInitRenderWatcher().update();
  }

  // Reserve, may expand in the future
  update() {
    console.error('update', this)
    this.getOrInitRenderWatcher().update()
  }

  $on = (eventName: string, eventHandler: EventHandler, el?: Element) => {
    return this.eventController.bindListener(
      el || this,
      eventName,
      eventHandler
    );
  };

  $emit<T>(eventName: string, customEventInit?: CustomEventInit<T>) {
    return this.dispatchEvent(
      new CustomEvent(
        eventName,
        Object.assign({ bubbles: true }, customEventInit)
      )
    );
  }

  /**
   * 此时组件 dom 已插入到页面中，等同于 connectedCallback() { super.connectedCallback(); }
   */
  componentDidMount() {};

  /**
   * disconnectedCallback 触发时、dom 移除前执行，等同于 disconnectedCallback() { super.disconnectedCallback(); }
   */
  componentWillUnmount() {}

  /**
   * @deprecated
   * since we have embraced more precisely controlled render scheduler mechanism,
   * there's no need to use shouldComponentUpdate any more,
   * and will be removed in next major version.
   * 
   * 控制当前属性变化是否导致组件渲染
   * @param propName 属性名
   * @param oldValue 属性旧值
   * @param newValue 属性新值
   * @returns boolean
   */
  shouldComponentUpdate(propName: string, oldValue: any, newValue: any) {
    return oldValue !== newValue;
  }

  shouldPreventUpdate(propName: string, oldValue: any, newValue: any) {
    if (this.hasOwnLifeCycleMethod('shouldComponentUpdate')) {
      return !this.shouldComponentUpdate(
        propName,
        oldValue,
        newValue,
      );
    }

    return false;
  }

  componentDidUpdate(propName: string, oldValue: any, newValue: any) {};

  /**
   * 组件的 render 方法，
   * 自动执行 this.shadowRoot.innerHTML = this.render()
   * @returns VNode
   */
  render() {
    return "" as any;
  }

  private getOrInitRenderWatcher() {
    if (!this._renderWatcher) {
      this._renderWatcher = new Watcher(
        this,
        () => {
          this._render();
          const renderCbType = this._mounted ? 'hostUpdated' : 'hostMounted';
          this._controllers?.forEach((c) => c[renderCbType]?.());
          this.postRender();
        },
        { render: true },
      );
    }

    return this._renderWatcher
  }

  connectedCallback() {
    this._updateProps();
    this._controllers?.forEach((c) => c.hostConnected?.());
    this.getOrInitRenderWatcher();
  }

  /** log old 'false' attribute value before resetting and removing it */
  private _oldVals: Map<string, string | undefined> = new Map()

  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    const prop = Props.get(this)?.get(attrName);

    if (!prop) {
      return;
    }

    const { propName } = prop;
    
    // react specific patch, for more detailed explanation: https://github.com/facebook/react/issues/9230
    // 对于自定义元素，React会直接将布尔值属性传递下去
    // 这时候这里的value会是字符串'true'或'false'，对于'false'我们需要手动将该属性从自定义元素上移除
    // 以避免CSS选择器将[attr="false"]视为等同于[attr]
    if (newVal !== oldVal) {
      if ((this.constructor as any).isBooleanProperty(attrName)) {
        if (newVal === 'false') {
          if (isFunction(this.componentDidUpdate)) {
            this._oldVals.set(propName, oldVal)
          }
          
          this[propName] = newVal;
          return;
        }
      }
    }

    const newValue = this[propName];
    let resolvedOldVal = oldVal
    let oldValReset = this._oldVals.get(propName)

    if (oldValReset) {
      this._oldVals.delete(propName)
      resolvedOldVal = oldValReset
    }
    
    resolvedOldVal = prop.converter(resolvedOldVal);
    
    if (this.shouldPreventUpdate(propName, resolvedOldVal, newValue)) {
      return;
    }

    // notify changes to this prop's watchers
    prop.dep.notify()
    // this._controllers?.forEach((c) => c.hostUpdated?.());
      
    if (this.hasDidUpdateCb()) {
      this.queueUpdated(() => {
        this.componentDidUpdate(
          propName,
          resolvedOldVal,
          newValue,
        );
      });
    }
  }

  disconnectedCallback() {
    if (isFunction(this.componentWillUnmount)) {
      this.componentWillUnmount();
    }

    this.eventController.removeAllListener();
    this._controllers?.forEach((c) => c.hostDisconnected?.());
    this.rootPatch(null);
    this._mounted = false;
  }
}
