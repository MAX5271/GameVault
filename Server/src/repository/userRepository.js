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
  const user = await User.findOne({ username });
  if (user && (await user.comparePassword(password))) {
    await user.deleteOne().exec();
    console.log(`User ${username} deleted successfully`);
  } else throw new Error("User not found or password is incorrect");
};

const getUser = async (username) => {
  const res = await User.findOne({ username });
  if (!res) throw new Error("No User Found");
  const result = {
    username: res.username,
    wantToPlay: res.wantToPlay,
    reviews: res.reviews,
  };
  return result;
};

const addWantToPlay = async (username,gameId)=>{
    const user = await User.findOne({username});
    if(!user) throw new Error("User not found.");
    await user.updateOne({
        $addToSet: {
            wantToPlay: gameId
        }
    });
    return gameId;
}

const removeWantToPlay = async (username,gameId)=>{
    const user = await User.findOne({username});
    if(!user) throw new Error("User not found.");
    await user.updateOne({
        $pull: {
            wantToPlay: gameId
        }
    });
}

module.exports = {
  createUser,
  updateUserPassword,
  deleteUser,
  getUser,
  addWantToPlay,
  removeWantToPlay
};
