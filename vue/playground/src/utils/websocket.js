const map = new Map()

const createWebSocket = url => {
  const ws = new WebSocket(url)

  ws.onopen = () => {
    console.log('[ws][open]')
  }

  ws.onmessage = event => {
    console.log('[ws][message] ' + event.data)
  }

  ws.onclose = event => {
    console.log('[ws][close] ' + 'code:' + event.code)
  }

  ws.onerror = () => {
    console.log('[ws][error]')
  }

  map.set(url, ws)
  return ws
}

export const getWebSocket = url => {
  return map.get(url) || createWebSocket(url)
}

export const websocket = new Proxy(map, {
  get: function (target, url) {
    return map.get(url) || createWebSocket(url)
  }
})