const users = [];

//Adding USER..................................................................................................................................................
const addUser = ({ id, username, room }) => {
  //clean the data.......................................................
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validate the data...................................................
  if (!username || !room) {
    return {
      error: "Username and Room is Required!",
    };
  }

  //check for existing user................................................
  const existingUser = users.find((user) => {
    return user.username === username && user.room === room;
  });

  //validate username.................................................
  if (existingUser) {
    return {
      error: "Username is in Use!",
    };
  }

  //store user...........................................................
  const user = {
    id,
    username,
    room,
  };

  users.push(user);
  return { user };
};

//REMOVING USER..................................................................................................................................................
const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//GET USER..................................................................................................................................................
const getUser = (id) => {
  //   return users.find((user) => {
  //     return user.id === id;
  //   });
  return users.find((user) => user.id === id);
};

//GET USER OF PARTICULAR ROOM.......................................................................................................................................
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};

//CALLING FUNCTIONS
// addUser({
//   id: 24,
//   username: "sunay",
//   room: "123",
// });

// addUser({
//   id: 25,
//   username: "jay",
//   room: "123",
// });

// addUser({
//   id: 26,
//   username: "dev",
//   room: "456",
// });

// const res = addUser({
//   id: 24,
//   username: "sunay",
//   room: "123",
// });

// console.log(res);

// const removedUser = removeUser(25);
// console.log(removedUser);
// console.log(users);

// const user = getUser(24);
// console.log(user);

// const userList = getUsersInRoom("123");
// console.log(userList);
