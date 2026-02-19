require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: process.env.GANACHE_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
