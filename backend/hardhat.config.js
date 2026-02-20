require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: process.env.GANACHE_RPC || "http://127.0.0.1:7545", // default to Ganache GUI RPC
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // ensures it's not undefined
    },
  },
};