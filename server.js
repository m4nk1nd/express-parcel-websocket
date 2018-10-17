const path = require('path')
const Bundler = require('parcel-bundler')
const bundler = new Bundler(path.join(__dirname, 'src', 'index.html'), {})
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const server_messages = [
  { id: 1, title: 'message_one' }
]

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.get('/server_messages', function (req, res) {
  res.json([...server_messages, { id: '999', title: 'via fetch button' }])
})

io.on('connection', function (socket) {
  socket.on('server_messages', function () {
    socket.emit('server_messages', server_messages)
  })

  socket.on('server_message_add', function (message) {
    server_messages.push(message)
    socket.emit('server_messages', server_messages)
  })
});

app.use(bundler.middleware())

server.listen(2999, () => console.log('started at http://localhost:2999'))