const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");

const server = http.createServer(app);
const io = socketio(server);

// server (emit) --> client(receive) -- countUpdated
//client (emit) --> server (receive) -- increment

// let count = 0;
// io.on("connection", (socket) => {
//   console.log("connected with socket.io");

//   socket.emit("countUpdated", count);

//   socket.on("increment", () => {
//     count++;

//     // socket.emit("countUpdated", count);
//     io.emit("countUpdated", count);
//   });
// });

io.on("connection", (socket) => {
  console.log("connected with socket.io");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username,
      room,
    });

    if (error) {
      return callback(error);
    }
    socket.join(user.room); // Special method for separate joining chatRooms (Applicable only on server side)

    socket.emit("message", generateMessage("Admin", "welcome!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined!`)
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  //socket.emit  ,   io.emit     ,     socket.broadcast.emit  -->> GENERAL
  // io.to.emit   ,   socket.broadcast.to.emit   -->> for Rooms
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity not allowed!");
    }
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left!`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use(express.static(publicDirectoryPath));
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("connected to server!");
});
