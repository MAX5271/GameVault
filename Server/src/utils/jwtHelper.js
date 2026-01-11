const jwt = require('jsonwebtoken');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (username)=>{
    const accessToken = jwt.sign({username:username},accessTokenSecret,{expiresIn: '15m'});
    return accessToken;
}

const generateRefreshToken = (username)=>{
    const refreshToken = jwt.sign({username:username},refreshTokenSecret,{expiresIn: '7d'});
    return refreshToken;
}

const verifyRefreshToken = (token)=>{
    const verify = jwt.verify(token,refreshTokenSecret);
    return verify;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}