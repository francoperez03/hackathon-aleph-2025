import "dotenv/config"
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./tasks/test-token"
import "./tasks/service-provider"

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    holesky: {
      url: process.env.HOLESKY_RPC_URL, 
      accounts: process.env.HOLESKY_PRIVATE_KEY ? [process.env.HOLESKY_PRIVATE_KEY] : [],
    },
    worldchain: {
      url: process.env.WORLDCHAIN_RPC_URL, 
      accounts: process.env.WORLDCHAIN_PRIVATE_KEY ? [process.env.WORLDCHAIN_PRIVATE_KEY] : [],
    }
  },
};

export default config;
