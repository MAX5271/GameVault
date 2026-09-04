const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_-]{2,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const isValidUsername = (username) =>
  typeof username === 'string' && USERNAME_REGEX.test(username);

const isValidPassword = (password) =>
  typeof password === 'string' && PASSWORD_REGEX.test(password);

module.exports = {
  isValidUsername,
  isValidPassword,
};
