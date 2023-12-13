/**
 * 链接需要使用全局状态的组件
 *
 * class MyComponent extends connectStore(QuarkElement){}
 *
 * connectStore() mixin 会自动使用 stateRecorder 来记录组件使用了哪些 stateVar 变量。
 * 就在组件渲染之前，stateRecorder.start() 被调用以开始记录。当 stateVar 被读取时，它的处理程序会将其记录到 stateRecorder。
  当组件完成渲染时，stateRecorder.finish() 方法会被调用。这将停止记录 stateVar 变量，并返回记录的变量。然后观察收集到的 stateVar 变量，当其中一个变量发生变化时，组件就会重新渲染。
  所以当你在 Quarkc 组件上使用 connectStore() mixin 时，所有这些都会为你处理好。
*/
export const connectStore = superclass => {

  class InnerClass extends superclass {

    constructor() {
        super();
        this._observers = [];
        this.update();
    }

    // Your framework need this function to init observe state
    update() {
      stateRecorder.start();
      super.update();
      this._initStateObservers();
    }

    _initStateObservers() {
      this._clearStateObservers();
      this._addStateObservers(stateRecorder.finish());
    }

    _addStateObservers(stateVars) {
      for (let [state, keys] of stateVars) {
        const observer = () => this.requestUpdate();
        this._observers.push([state, observer]);
        state.addObserver(observer, keys);
      }
    }

    _clearStateObservers() {
        for (let [state, observer] of this._observers) {
            state.removeObserver(observer);
        }
        this._observers = [];
    }

  }

  return InnerClass
}

// 维护 store 数据，监听变量，无论 get/set
export class createGluang {
  private _observers: any;

  constructor() {
    this._observers = [];
    this._initStateVars();
  }

  /**
   * 手动监听 state
   *
   * myState.addObserver(this.stateObserver)
   * myState.addObserver(this.counterObserver, ['counter'])
   * @param observer
   * @param keys
   */
  addObserver(observer, keys) {
    this._observers.push({observer, keys});
  }

  /**
   * 手动移除监听
   *
   * myState.removeObserver(this.stateObserver)
   * @param observer
   */
  removeObserver(observer) {
      this._observers = this._observers.filter(observerObj => observerObj.observer !== observer);
  }

  _initStateVars() {
    if (this.constructor.stateVarOptions) {
      for (let [key, options] of Object.entries(this.constructor.stateVarOptions)) {
          this._initStateVar(key, options);
      }
    }

    if (this.constructor.stateVars) {
        // State obj's key
        for (let [key, value] of Object.entries(this.constructor.stateVars)) {
            this._initStateVar(key, {});
            this[key] = value;
        }
    }

  }

  _initStateVar(key, options) {
      // Property already defined, so don't re-define.
      if (this.hasOwnProperty(key)) {
          return;
      }

      options = this._parseOptions(options);

      const stateVar = new options.handler({
          options: options,
          recordRead: () => this._recordRead(key),
          notifyChange: () => this._notifyChange(key)
      });

      Object.defineProperty(
          this,
          key,
          {
              get() {
                return stateVar.get();
              },
              set(value) {
                if (stateVar.shouldSetValue(value)) {
                    stateVar.set(value);
                }
              },
              configurable: true,
              enumerable: true
          }
      );

  }

  _parseOptions(options) {

      if (!options.handler) {
          options.handler = StateVar;
      } else {
          if (options.propertyMethod && options.propertyMethod.kind === 'method') {
              Object.assign(options, options.propertyMethod.descriptor.value.call(this));
          }
      }

      return options;

  }

  _recordRead(key) {
      stateRecorder.recordRead(this, key);
  }

  _notifyChange(key) {
      for (const observerObj of this._observers) {
          if (!observerObj.keys || observerObj.keys.includes(key)) {
              observerObj.observer(key);
          }
      };
  }

}

/**
 * 非装饰器声明的 state
 *
 * static get StateVar() {
      return {
        counter: 0,
      }
    }
 */
export class StateVar {
  options: Object;
  recordRead: any;
  notifyChange: any;
  value: undefined;

  constructor(args) {
      this.options = args.options
      this.recordRead = args.recordRead
      this.notifyChange = args.notifyChange
      this.value = undefined
  }

  get() {
      this.recordRead()
      return this.value
  }

  set(value) {
    this.value = value;
    this.notifyChange();
  }

  shouldSetValue(value) {
      return this.value !== value;
  }
}


export function stateVar(options?: any) {
  return element => {
      return {
          kind: 'field',
          key: Symbol(),
          placement: 'own',
          descriptor: {},
          initializer() {
              if (typeof element.initializer === 'function') {
                  this[element.key] = element.initializer.call(this);
              }
          },
          finisher(stateClass) {
              if (element.kind === 'method') {
                  options.propertyMethod = element;
              }

              if (!stateClass.stateVarOptions) {
                stateClass.stateVarOptions = {};
              }

              stateClass.stateVarOptions[element.key] = options;

          }
      };
  };
}

/**
 * connectStore() 的 mixin 使用 stateRecorder 对象来记录在它的上一个渲染周期中哪些 stateVar 变量被访问过。
 */
class StateRecorder {
  #log

  constructor() {
    this.#log = null;
  }

  // Starts the recorder. After calling this, every stateVar variable that is being read, will be recorded, until finish() is called.
  start() {
    this.#log = new Map();
  }

  recordRead(stateObj, key) {
    if (!this.#log) return;

    const keys = this.#log.get(stateObj) || [];

    if (!keys.includes(key)) keys.push(key);

    this.#log.set(stateObj, keys);
  }

  finish() {
    const stateVars = this.#log;
    this.#log = null;
    return stateVars;
  }

}

export const stateRecorder = new StateRecorder();