const User = require("../model/User");

const createUser = async (username, password) => {
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) {
    throw new Error("Username already taken");
  }
  const newUser = await User.create({ username, password });
  return { username: newUser.username };
};

const updateUserPassword = async (username, password, newPassword) => {
  const user = await User.findOne({ username });
  if (user && (await user.comparePassword(password))) {
    user.password = newPassword;
    await user.save();
  } else throw new Error("Incorrect Password");
};

const deleteUser = async (username, password) => {
  const user = await User.findOne({ username }).exec();
  if (user && (await user.comparePassword(password))) {
    await user.deleteOne().exec();
    console.log(`User ${username} deleted successfully`);
  } else throw new Error("User not found or password is incorrect");
};

const getUser = async (username) => {
  const res = await User.findOne({ username }).exec();
  if (!res) throw new Error("No User Found");
  return res;
};

const addStatus = async (username, gameId, status = "WANT_TO_PLAY") => {
  const exists = await User.findOne({
    username,
    "games.gameId": gameId,
  });

  if (exists) {
    throw new Error("Game already in library");
  }
  const updatedUser = await User.findOneAndUpdate(
    { username },
    {
      $push: {
        games: {
          gameId: gameId,
          status: status,
        },
      },
    },
    { new: true, runValidators: true },
  );

  if (!updatedUser) throw new Error("User not found");
  return updatedUser;
};

const getStatus = async (username, gameId) => {
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error("User not found");
  const game = user.games.find((g) => g.gameId === gameId);
  if (!game) throw new Error("Game not found");
  return game.status;
};

const updateStatus = async (username, gameId, status) => {
  const user = await User.findOneAndUpdate(
    { username, "games.gameId": gameId },
    {
      $set: {
        "games.$.status": status,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!user) throw new Error("User or game not found");
  return user;
};

const updateRefreshToken = async (username, refreshToken) => {
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error("User not found");
  user.refreshToken = refreshToken;
  await user.save();
};

const removeRefreshToken = async (username) => {
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error("User not found");
  user.refreshToken = "";
  await user.save();
};

const getUserGames = async (username) => {
  const user = await User.findOne({username}).select('games -_id').exec();
  if (!user) throw new Error("User not found");
  return user.games;
}

module.exports = {
  createUser,
  updateUserPassword,
  deleteUser,
  getUser,
  updateRefreshToken,
  removeRefreshToken,
  addStatus,
  getStatus,
  updateStatus,
  getUserGames
};
