{
  const data = {
    'text': ''
  }
  const input = document.createElement('input')
  const span = document.createElement('span')

  defineProperty(data, 'text', {
    set(newVal) {
      input.value = newVal
      span.innerHtml = newVal
    }
  })

  //proxy
  const handler = {
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver)

      input.value = value
      span.innerHtml = value

      return success
    }
  }
  const proxy = new Proxy(data, handler)

  input.addEventListener('keyup', e => data.text = e.target.value)
}