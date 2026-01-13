const authServices = require("../services/authServices");
const handleLogin = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await authServices.loginUser(
      req.body.username,
      req.body.password
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ username: req.body.username, accessToken });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      Message: error.message,
    });
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(400);

    const refreshToken = cookies.jwt;

    const accessToken = await authServices.refreshAccessToken(refreshToken);

    return res.json({ accessToken: accessToken });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      Message: error.message,
    });
  }
};

const handleLogout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    await authServices.logoutUser(cookies.jwt);

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.sendStatus(204);
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      Message: error.message,
    });
  }
};

module.exports = {
  handleLogin,
  handleRefreshToken,
  handleLogout,
};
