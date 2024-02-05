import io from 'socket.io-client'

var socket = null

const LOGS_WS = {
  42161: process.env.VUE_APP_BOT_LOGS_ARBITRUM,
  56: process.env.VUE_APP_BOT_LOGS_BINANCE,
  137: process.env.VUE_APP_BOT_LOGS_POLYGON,
}

const LIMIT_LOGS = 5
export function InitSocket(network, messages) {
  socket = io(LOGS_WS[network])

  socket.on('connect', () => {
    console.log('Connected to the server')
  })

  socket.on('log', (data) => {
    messages.value = [...messages.value.slice(-LIMIT_LOGS), data]
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from the server')
  })
}
