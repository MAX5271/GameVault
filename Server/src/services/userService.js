const userRepository = require("../repository/userRepository");

const createUser = async (username, password) => {
  const res = await userRepository.createUser(username, password);
  return res;
};

const updateUserPassword = async (username, password, newPassword) => {
  const res = await userRepository.updateUserPassword(
    username,
    password,
    newPassword
  );
  return res;
};

const deleteUser = async (username, password) => {
  const res = await userRepository.deleteUser(username, password);
  return res;
};

const getUser = async (username) => {
  const res = await userRepository.getUser(username);
  return res;
};

const addWantToPlay = async (username,gameId) =>{
    const res = await userRepository.addWantToPlay(username,gameId);
    return res;
}

const removeWantToPlay = async (username,gameId) => {
    const res = await userRepository.removeWantToPlay(username,gameId);
    return res;
}

module.exports = {
  createUser,
  updateUserPassword,
  deleteUser,
  getUser,
  addWantToPlay,
  removeWantToPlay
};
