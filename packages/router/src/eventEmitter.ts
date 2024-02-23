type CustomListener<T = any> = (eventData: T) => void;

class EventEmitter<T> {
  private events: Map<string, Set<CustomListener<T>>>;

  constructor() {
    this.events = new Map();
  }

  // 订阅事件
  on(eventName: string, listener: CustomListener<T>): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }
    this.events.get(eventName)!.add(listener);
  }

  // 触发事件
  emit(eventName: string, eventData: T): void {
    if (this.events.has(eventName)) {
      for (const listener of this.events.get(eventName)!) {
        listener(eventData);
      }
    }
  }

  // 取消订阅
  off(eventName: string, listener: CustomListener<T>): void {
    if (this.events.has(eventName)) {
      this.events.get(eventName)!.delete(listener);
    }
  }

  // 只订阅一次
  once(eventName: string, listener: CustomListener<T>): void {
    const onceWrapper: CustomListener<T> = (eventData) => {
      this.off(eventName, onceWrapper);
      listener(eventData);
    };
    this.on(eventName, onceWrapper);
  }
}

export const eventBus = new EventEmitter<any>();

export default EventEmitter;