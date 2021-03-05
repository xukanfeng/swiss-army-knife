/**
 * setTimeout 实现 setInterval
 */
function mySetInterval(handler, timeout, ...args) {
  // 使用对象引用保存 value
  const timer = {
    value: -1,
    valueOf() {
      // clearTimeout 时强制转换
      return this.value
    }
  }
  const _handler = () => {
    handler.apply(this, args)
    timer.value = setTimeout(() => _handler(), timeout)
  }
  timer.value = setTimeout(() => _handler(), timeout)
  return timer
}

/*
const timer = mySetInterval((...args) => console.log(args), 1000, 1, 2)
setTimeout(() => {
  clearTimeout(timer)
}, 4000)
*/