//connect to server and retain the socket
//connect to same host that served the document

//const socket = io('http://' + window.document.location.host)
const socket = io() //by default connects to same server that served the page
let username = ''
let registeredUsers = []
let userOwnMessages = []

socket.on('serverSays', function(message, isPrivate) {
  if (!registeredUsers.includes(socket)) //if the socket is not a registered user, don't emit message to the socket
    return
  
  let msgDiv = document.createElement('div')

  msgDiv.textContent = message

  if (userOwnMessages.includes(message)) {
    msgDiv.style.color = 'blue'
  }

  if (isPrivate === true) {
    msgDiv.style.color = 'red'
  }

  document.getElementById('messages').appendChild(msgDiv)
})

function sendUsername() {
  username = document.getElementById('username_text').value.trim()
  console.log("Entered username: " + username)

  if (username === '') {
    console.log("nothing has entered as a username")
    return
  }

  if (!username.charAt(0).match(/[a-zA-Z]/)) {
    console.log("the entered username does not start with a letter")
    document.getElementById('username_text').value = ''
    return
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    console.log("the entered username does not only include letters and numbers")
    document.getElementById('username_text').value = ''
    return
  }

  document.getElementById("msgBox").disabled = false //enable the msgBox to enter text
  socket.emit('clientName', username)
  registeredUsers.push(socket)
  
  document.getElementById('usernameDiv').replaceChildren()//clean up the div
}


function sendMessage() {
  let message = document.getElementById('msgBox').value.trim()
  if(message === '') return //do nothing

  message = username + ': ' + message
  socket.emit('clientSays', message)

  userOwnMessages.push(message)
  document.getElementById('msgBox').value = ''
}

function handleKeyDown(event) {
  const ENTER_KEY = 13 //keycode for enter key
  if (event.keyCode === ENTER_KEY) {
    if (document.getElementById('msgBox').value.trim() !== '')
      sendMessage()
    else if (document.getElementById('username_text').value.trim() !== '') sendUsername()
    return false //don't propogate event
  }
}

function clear() {
  let msgDiv = document.createElement('div')
  msgDiv.textContent = 'You are connected to CHAT SERVER' 
  document.getElementById('messages').replaceChildren(msgDiv)
}

//Add event listeners
document.addEventListener('DOMContentLoaded', function() {
  //This function is called after the browser has loaded the web page

  //add listener to buttons
  document.getElementById('username_button').addEventListener('click', sendUsername)
  document.getElementById('send_button').addEventListener('click', sendMessage)
  document.getElementById('clear_button').addEventListener('click', clear)

  //add keyboard handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  //document.addEventListener('keyup', handleKeyUp)
})
