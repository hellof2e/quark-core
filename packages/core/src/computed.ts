import { QuarkElement } from "."

/** dependency universal id */
let uid = 0

/** current watcher that is collecting it's dependencies */
export let currDepTarget: Watcher| undefined

export type WatcherGetter = () => any

export class Watcher {
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
  /** callback */
  cb: ((newVal: any, oldVal: any) => void)
  
  constructor(
    inst: QuarkElement,
    getterOrExpr: WatcherGetter | string,
    computed: boolean = false,
    cb: (newVal: any, oldVal: any) => void = () => {}
  ) {
    this.inst = inst
    this.computed = computed

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

    if (!this.computed) {
      this.value = this.get()
    }
  }

  /** get latest computed value of watcher */
  get() {
    this.dep.depend()
    
    if (this.dirty) {
      return this.updateAndGet()
    }

    return this.value
  }

  /** invoke getter, recompute value, manage dependencies */
  updateAndGet() {
    const oldValue = this.value
    setCurrDepTarget(this)
    this.oldDeps = this.deps
    this.deps = new Map()
    // * invoke getter and collect new dependencies
    this.value = this.getter.call(this.inst)
    this.dirty = false
    popCurrDepTarget()
    this.cleanDeps()

    if (this.value !== oldValue) {
      this.cb.call(this.inst, this.value, oldValue)
    }
    
    return this.value
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

  /** receive update notification from it's dependency */
  update() {
    this.dirty = true
    // dependency changed, prepare update for it's watchers
    this.updateAndGet()
    // * notify watchers of this watcher
    this.dep.notify()
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

  unwatch(watcher: Watcher) {
    this.watchers.delete(watcher)
  }

  /** notify update to its watchers */
  notify() {
    this.watchers.forEach(watcher => watcher.update())
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
