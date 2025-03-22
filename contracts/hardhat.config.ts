import "dotenv/config"
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./tasks/test-token"
import "./tasks/service-provider"

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    "holesky": {
      url: process.env.RPC_URL, 
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
