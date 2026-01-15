const userRepository = require('../repository/userRepository');
const jwtHelper = require('../utils/jwtHelper');

const loginUser = async (username,password) =>{
    const user = await userRepository.getUser(username);
    if(!user) throw new Error("User not found");

    const match = await user.comparePassword(password);
    if(!match) throw new Error("Incorrect password.");

    const accessToken = jwtHelper.generateAccessToken(username);
    const refreshToken = jwtHelper.generateRefreshToken(username);

    await userRepository.updateRefreshToken(username,refreshToken);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

const refreshAccessToken = async (refreshToken) =>{
    const decode = jwtHelper.verifyRefreshToken(refreshToken);
    if(!decode) throw new Error("Invalid Token Signature");

    const user = await userRepository.getUser(decode.username);
    if(!user) throw new Error("User not found");
    if(user.refreshToken!==refreshToken) throw new Error("Invalid Refresh Token");

    return {username:user.username,accessToken:jwtHelper.generateAccessToken(user.username)};
}

const logoutUser = async (refreshToken) => {
    const decode = jwtHelper.verifyRefreshToken(refreshToken);
    if(!decode) throw new Error("Invalid Token Signature");

    const user = await userRepository.getUser(decode.username);
    if(!user) throw new Error("User not found");
    if(user.refreshToken!==refreshToken) throw new Error("Invalid Refresh Token");

    await userRepository.removeRefreshToken(user.username);
}

module.exports = {
    loginUser,
    refreshAccessToken,
    logoutUser
}

