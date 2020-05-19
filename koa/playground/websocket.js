const ws = require('ws')
const WebSocketServer = ws.Server

function _createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
  let wss = new WebSocketServer({
    server: server,
  })
  wss.broadcast = data => {
    wss.clients.forEach(client => client.send(data))
  }
  onConnection = onConnection || function () {
    console.log('[WebSocket] connected.')
  }
  onMessage = onMessage || function (msg) {
    console.log('[WebSocket] message received: ' + msg)
  }
  onClose = onClose || function (code, message) {
    console.log(`[WebSocket] closed: ${code} - ${message}`)
  }
  onError = onError || function (err) {
    console.log('[WebSocket] error: ' + err)
  }
  wss.on('connection', function (ws, req) {
    ws.on('message', onMessage)
    ws.on('close', onClose)
    ws.on('error', onError)
    ws.wss = wss
    onConnection.call(ws, req)
  })
  console.log('WebSocketServer was attached.')

  return wss
}

function createWebSocketServer(server, serivce) {
  return _createWebSocketServer(server, serivce.onConnect, serivce.onMessage, serivce.onClose)
}

module.exports = createWebSocketServer
