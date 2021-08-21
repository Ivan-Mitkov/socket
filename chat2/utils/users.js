const users = [];

//join user to the chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

//get curren user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}
//user leave chat
function userLeave(id) {
  console.log(users);
  return users.filter((user) => user.id === id)[0];
}
//get room user
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
