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

const getUserGames = async (username) => {
  const res = await userRepository.getUserGames(username);
  return res;
}

const addStatus = async (username,gameId,status) =>{
  const res = await userRepository.addStatus(username,gameId,status);
  return res;
}

const getStatus = async (username,gameId) => {
  const res = await userRepository.getStatus(username,gameId);
  return res;
}

const updateStatus = async (username,gameId,status) => {
  const res = await userRepository.updateStatus(username,gameId,status);
  return res;
}

const removeGame = async (username,gameId) => {
  const res = await userRepository.removeGame(username,gameId);
  return res;
}

const setPcSpecs = async (username,cpu,gpu,ram) => {
  const res = await userRepository.setPcSpecs(username,cpu,gpu,ram);
  return res;
}

const getPcSpecs = async (username) => {
  const res = await userRepository.getPcSpecs(username);
  return res;
}

const addReview = async (username,gameId,rating) => {
  const res = await userRepository.addReview(username,gameId,rating);
  return res;
}

const updateReview = async (username,gameId,rating) => {
  const res = await userRepository.updateReview(username,gameId,rating);
  return res;
}

const getReview = async (username,gameId) => {
  const res = await userRepository.getReview(username,gameId);
  return res;
}

module.exports = {
  createUser,
  updateUserPassword,
  deleteUser,
  getUser,
  addStatus,
  getStatus,
  updateStatus,
  getUserGames,
  removeGame,
  setPcSpecs,
  getPcSpecs,
  addReview,
  updateReview,
  getReview
};
