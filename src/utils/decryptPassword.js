const bcrypt = require("bcryptjs");

const decryptPassword = async (password, oldPassword) => {
  const matchPassword = await bcrypt.compare(password, oldPassword);
  return matchPassword;
};

module.exports = decryptPassword;
