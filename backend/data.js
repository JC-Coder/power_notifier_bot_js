require("dotenv").config();

module.exports = {
  token: process.env.BOT_TOKEN,
  admin: process.env.ADMIN,
  botUsername: process.env.BOT_USERNAME,
  PORT: +process.env.PORT,
  groupsAndChannels: [-1001594195982, -1001843642902],
  serverUrl: process.env.SERVER_URL,
};
