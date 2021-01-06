{
  class EventHub {
    constructor() {
      this.map = Object.create(null)
    }
    on(event, listener) {
      // 事件可以为数组
      if (Array.isArray(event)) {
        event.forEach(item => this.on(item, listener))
      } else {
        if (!this.map[event]) {
          this.map[event] = []
        }
        this.map[event].push(listener)
      }
    }
    once(event, listener) {
      const wrapper = (...args) => {
        listener.apply(this, args)
        this.off(event, listener)
      }
      // 保存原始 listener
      wrapper.origin = listener
      this.on(event, wrapper)
    }
    emit(event, ...args) {
      this.map[event].forEach(cb => cb.apply(this, args))
    }
    off(event, listener) {
      // 参数为空时注销所有事件
      if (arguments.length === 0) {
        this.map = {}
        return
      }
      if (Array.isArray(event)) {
        event.forEach(item => this.off(item, listener))
        return
      }
      if (!listener) {
        // 如果没有 listener，移除全部 listener
        this.map[event].length = 0
      } else {
        this.map[event] = this.map[event].filter(cb => cb === listener || cb === listener.origin)
      }
    }
  }

  // test cases
  const foo1 = (a, b) => console.log('foo1', a, b)
  const foo2 = (a, b) => console.log('foo2', a, b)
  const event = new EventHub()

  event.on('event', foo1)
  event.on('event', foo2)
  console.log('EventHub on')
  event.emit('event', 1, 2)

  event.off('event', foo1)
  event.off('event', foo2)
  console.log('EventHub off')
  event.emit('event', 1, 2)

  console.log('EventHub once')
  event.once('event', foo1)
  event.off('event', foo1)
  event.emit('event', 1, 2)
}