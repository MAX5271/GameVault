const { OAuth2Client } = require('google-auth-library');
const userRepository = require('../repository/userRepository');
const jwtHelper = require('../utils/jwtHelper');
const { isValidUsername } = require('../utils/validators');

const googleClient = new OAuth2Client();

const deriveUsernameFromEmail = (email) => {
    const local = (email || '').split('@')[0] || '';
    let base = local.replace(/[^A-Za-z0-9_-]/g, '');
    if (!/^[A-Za-z]/.test(base)) base = `u${base}`;
    base = base.slice(0, 24);
    if (base.length < 3) base = `${base}user`.slice(0, 24);
    return isValidUsername(base) ? base : 'player';
};

const generateUniqueUsername = async (email) => {
    const base = deriveUsernameFromEmail(email);
    let candidate = base;
    let attempt = 0;

    while (await userRepository.isUsernameTaken(candidate)) {
        attempt += 1;
        if (attempt > 50) throw new Error('Could not generate a unique username.');
        const suffix = `${attempt}`;
        candidate = `${base.slice(0, 24 - suffix.length)}${suffix}`;
    }

    return candidate;
};

const loginUser = async (username,password) =>{
    const user = await userRepository.getUser(username).catch(() => null);
    const match = user ? await user.comparePassword(password) : false;
    if(!user || !match) throw new Error("Invalid username or password.");

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

const loginWithGoogle = async (idToken) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error("Google sign-in is not configured on this server.");
    }
    if (!idToken || typeof idToken !== 'string') {
        throw new Error("Missing Google credential.");
    }

    let payload;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (error) {
        throw new Error("Invalid Google credential.");
    }

    if (!payload || !payload.sub) {
        throw new Error("Invalid Google credential.");
    }

    let user = await userRepository.getUserByGoogleId(payload.sub);

    if (!user) {
        const username = await generateUniqueUsername(payload.email);
        user = await userRepository.createGoogleUser({
            username,
            email: payload.email,
            googleId: payload.sub,
        });
    }

    const accessToken = jwtHelper.generateAccessToken(user.username);
    const refreshToken = jwtHelper.generateRefreshToken(user.username);

    await userRepository.updateRefreshToken(user.username, refreshToken);

    return {
        username: user.username,
        accessToken,
        refreshToken,
    };
}

module.exports = {
    loginUser,
    refreshAccessToken,
    logoutUser,
    loginWithGoogle
}

