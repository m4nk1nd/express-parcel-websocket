import io from 'socket.io-client/lib'

const socket = io()

const app = (function (socket) {

  let messages = []

  const server_messages = function (server_messages) {
    messages = server_messages
    document.getElementById('messages').innerText = JSON.stringify(messages)
  }

  return {
    init() {
      document.getElementById('add_message').addEventListener('click', function () {
        socket.emit('server_message_add', {
          id: messages.length + 1,
          title: document.getElementById('message').value
        })
        document.getElementById('message').value = ''
      })

      // disable add message button if message field is empty
      document.getElementById('message').addEventListener('input', function (e) {
        var value = e.target.value.trim()
        if (value === '') document.getElementById('add_message').disabled = true
        else document.getElementById('add_message').disabled = false
      })

      document.getElementById('fetch_button').addEventListener('click', function (e) {
        // ajax
        fetch('/server_messages', { method: 'GET' })
          .then(result => result.json())
          .then(result => server_messages(result))
      })

      // request server messages via socket
      socket.emit('server_messages')
      // proccess server messages in response
      socket.on('server_messages', server_messages)
    },
    dispose() {
      socket.off('server_messages', server_messages)
    }
  }

})(socket)

app.init()