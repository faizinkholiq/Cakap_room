const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".my-chat");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const messageTxt = document.getElementById("msg");

// Get username & room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room & users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", e => {
  e.preventDefault();

  // Get message text
  let msg = messageTxt.innerText.trim();

  if (!msg) return false;

  // Emit message to server
  socket.emit("chatMessage", {
    text: msg,
    bot: false
  });

  // Clear Input
  messageTxt.innerText = "";
  messageTxt.focus();
});

// Output message
function outputMessage(message) {
  const div = document.createElement("div");
  if (message.bot) {
    div.classList.add("list-chat", "bot");
  } else {
    div.classList.add("list-chat", "my");
  }
  div.innerHTML = `
    <img class="avatar" src="images/user-male.jpg" />
    <div class="bubble">
      <div class="info">
        ${message.username}
        <span class="time">${message.time}</span>
      </div>
      <div class="message">${message.text}</div>
    </div>
  `;

  document.querySelector(".my-chat").appendChild(div);
}

// Output room name
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add user to Rom
function outputUsers(users) {
  userList.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.classList.add("user");
    div.innerHTML = `
      <img class="avatar" src="images/user-female.jpg" />
      <span class="name">${user.username}</span>
    `;

    userList.appendChild(div);
  });
}
