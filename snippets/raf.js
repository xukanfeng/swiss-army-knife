{
  const setInterval = (callback, interval, ...args) => {
    let timer
    let endTime = startTime = Date.now()

    const loop = () => {
      timer = window.requestAnimationFrame(loop)
      endTime = Date.now()
      if (endTime - startTime >= interval) {
        callback(...args)
        endTime = startTime = now()
      }
    }

    timer = window.requestAnimationFrame(loop)
    return timer
  }

  let timer = setInterval((...args) => {
    console.log(...args)
  }, 1000, 1, 2, 3)
}

{
  const setTimeout = (callback, interval, ...args) => {
    let timer
    let endTime = startTime = Date.now()

    const loop = () => {
      timer = window.requestAnimationFrame(loop)
      endTime = Date.now()
      if (endTime - startTime >= interval) {
        callback(...args)
        window.cancelAnimationFrame(timer)
      }
    }

    timer = window.requestAnimationFrame(loop)
    return timer
  }

  let timer = setInterval((...args) => {
    console.log(...args)
  }, 1000, 1, 2, 3)
}