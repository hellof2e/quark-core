import { QuarkElement } from "."
import { noop } from "./core/util"

/** dependency universal id */
let uid = 0

/** current watcher that is collecting it's dependencies */
export let currDepTarget: Watcher | undefined

export type WatcherGetter = () => any

/** all watchers waiting to run callback */
const watchers: Watcher[] = []
/** all waiting watchers' id */
const watcherIds = new Set<number>()
/** is there any flush task pending —— before entering next event loop */
let flushPending = false

/** prepare micro task */
const queueMicroTask = (callback: (...args: any[]) => any) => {
  if (typeof window.queueMicrotask === 'function') {
    window.queueMicrotask(callback)
  } else {
    Promise.resolve().then(callback)
  }
};

// const flushUpdatedQueue = (watchers: Watcher[]) => {
//   let i = watchers.length

//   while (i--) {
//     const watcher = watchers[i]
//     const {
//       render,
//       inst,
//     } = watcher

//     if (render && inst) {
//       inst.flushUpdatedQueue()
//     }
//   }
// }

/** flush watcher queue */
const flushWatcherQueue = () => {
  for (let i = 0; i < watchers.length; i++) {
    const watcher = watchers[i]
    watcherIds.delete(watcher.id)
    watcher.run()
  }

  // flushUpdatedQueue(watchers)

  // reset
  watchers.length = 0
  watcherIds.clear()
  flushPending = false
}

/** add watcher to queue */
const queueWatcher = (watcher: Watcher) => {
  const { id } = watcher
  
  if (!watcherIds.has(id)) {
    watcherIds.add(id)
    watchers.push(watcher)
      
    if (!flushPending) {
      flushPending = true
      queueMicroTask(flushWatcherQueue)
    }
  }
}

interface SharedWatcherOptions {
  /** watcher's callback */
  cb?: (newVal: any, oldVal: any) => void
}

export interface UserWatcherOptions extends SharedWatcherOptions {
  /** call immediately after first-time render */
  immediate?: boolean;
}

interface InternalWatcherOptions extends SharedWatcherOptions {
  /** is render watcher */
  render?: boolean;
  /** is computed watcher */
  computed?: boolean;
}

type WatcherOptions = UserWatcherOptions & InternalWatcherOptions

export class Watcher {
  /** watcher's id */
  id: number
  /**
   * watcher itself can be dependency of others'
   * 
   * so you can treat it as watcher itself (for maintaining dependencies)
   */
  dep: Dep = new Dep()
  /** this watcher's dependencies */
  deps = new Map<number, Dep>()
  oldDeps = new Map<number, Dep>()
  /** watcher's getter function */
  getter: WatcherGetter
  /** quark element's instance */
  inst: QuarkElement
  /** computed value */
  value: any = undefined
  /** is computed value dirty */
  dirty = true
  /** is computed watcher */
  computed: boolean
  /** watcher's callback */
  cb: ((newVal: any, oldVal: any) => void)
  /** is render watcher */
  render: boolean
  
  constructor(
    inst: QuarkElement,
    getterOrExpr: WatcherGetter | string,
    options: WatcherOptions,
  ) {
    this.id = ++uid
    this.inst = inst
    const defaultOptions: Required<WatcherOptions> = {
      cb: noop,
      render: false,
      computed: false,
      immediate: false,
    }
    const {
      computed,
      render,
      cb,
      immediate,
    } = { ...defaultOptions, ...options }
    this.computed = computed
    this.render = render

    if (typeof getterOrExpr === 'function') {
      this.getter = getterOrExpr
    } else {
      this.getter = () => {
        return getterOrExpr
          .split('.')
          .reduce((acc, pathSeg) => acc?.[pathSeg], inst);
      }
    }
    
    this.cb = cb

    if (!computed) {
      if (!immediate) {
        this.value = this.get()
      } else {
        this.run();
      }
    }
  }

  /** get latest computed value of watcher */
  get() {
    if (this.dirty) {
      this.value = this.compute()
      this.dirty = false
    }

    return this.value
  }

  /** invoke getter, recompute value, manage dependencies */
  compute() {
    setCurrDepTarget(this)
    // reset deps collection
    this.oldDeps = this.deps
    this.deps = new Map()
    // invoke getter and collect new dependencies
    const value = this.getter.call(this.inst)
    popCurrDepTarget()
    this.cleanDeps()
    return value
  }

  /** clean invalidated dependencies */
  cleanDeps() {
    this.oldDeps.forEach((dep, id) => {
      if (!this.deps.has(id)) {
        dep.unwatch(this)
      }
    })
  }

  /** add dependency to this watcher's dependency list */
  addDep(dep: Dep) {
    const { id } = dep

    if (!this.deps.has(id)) {
      this.deps.set(id, dep)
      dep.watch(this)
    }
  }

  /** mark itself as a dependency of current watcher */
  depend() {
    if (currDepTarget) {
      currDepTarget.addDep(this.dep)
    }
  }

  /** invoke callback after successfully updated */
  updateAndInvoke(cb: (newValue: any, oldValue: any) => void) {
    const value = this.compute()
    const oldValue = this.value

    if (Object.is(value, oldValue)) {
      return;
    }

    this.value = value
    this.dirty = false
    cb.call(this.inst, value, oldValue)
  }

  /** receive update notification from it's dependency */
  update() {
    if (this.computed) {
      if (!this.dep.watchers.size) {
        // if no watcher is watching this computed value, simply mark it dirty
        // its watchers' count may change during app's execution
        this.dirty = true
      } else {
        // * notify watchers of this watcher（for computed）
        this.updateAndInvoke(() => {
          this.dep.notify()
        })
      }
    } else {
      queueWatcher(this)
    }
  }

  /** run callback of watcher */
  run() {
    this.updateAndInvoke(this.cb)
  }
}

export class Dep {
  /** dependecy id */
  id: number
  /** watchers that are watching this dependecy, listening to its changes */
  watchers: Set<Watcher>
  
  constructor() {
    this.id = uid++
    this.watchers = new Set()
  }

  /** a watcher subscribe to this dependency */
  watch(watcher: Watcher) {
    this.watchers.add(watcher)
  }

  /** stop watching this dependency */
  unwatch(watcher: Watcher) {
    this.watchers.delete(watcher)
  }

  /** notify update to its watchers */
  notify() {
    this.watchers.forEach(watcher => {
      watcher.update()
    })
  }

  /**
   * mark itself as a dependency of current watcher.
   * in other words, current watcher depends on it.
  */
  depend() {
    if (currDepTarget) {
      currDepTarget.addDep(this)
    }
  }
}

const depTargetStack: Watcher[] = []

/** setter for {@link currDepTarget} */
export const setCurrDepTarget = (target: Watcher) => {
  depTargetStack.push(target)
  currDepTarget = target
}

export const popCurrDepTarget = () => {
  depTargetStack.pop()
  currDepTarget = depTargetStack[depTargetStack.length - 1]
}
