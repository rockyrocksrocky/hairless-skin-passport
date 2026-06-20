require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun",
    },
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532,
    },
    base: {
      url: process.env.BASE_MAINNET_RPC || "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8453,
    },
    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
 etherscan: {
  apiKey: {
    baseSepolia: process.env.ETHERSCAN_API_KEY || "",
    base: process.env.ETHERSCAN_API_KEY || "",
    polygonAmoy: process.env.ETHERSCAN_API_KEY || "",
  },
  customChains: [
    {
      network: "baseSepolia",
      chainId: 84532,
      urls: {
        apiURL: "https://api.etherscan.io/v2/api?chainid=84532",
        browserURL: "https://sepolia.basescan.org",
      },
    },
    {
      network: "base",
      chainId: 8453,
      urls: {
        apiURL: "https://api.etherscan.io/v2/api?chainid=8453",
        browserURL: "https://basescan.org",
      },
    },
    {
      network: "polygonAmoy",
      chainId: 80002,
      urls: {
        apiURL: "https://api.etherscan.io/v2/api?chainid=80002",
        browserURL: "https://amoy.polygonscan.com",
      },
    },
  ],
},
};
