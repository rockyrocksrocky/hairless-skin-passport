const hre = require("hardhat");

async function main() {
  console.log("Deploying SkinPassport to", hre.network.name, "...");

  const SkinPassport = await hre.ethers.getContractFactory("SkinPassport");
  const passport = await SkinPassport.deploy();
  await passport.waitForDeployment();

  const address = await passport.getAddress();
  console.log("✅ SkinPassport deployed to:", address);
  console.log("   Network:", hre.network.name);
  console.log("   Explorer:", explorerUrl(hre.network.name, address));
  console.log("\nNext: verify with");
  console.log(`  npx hardhat verify --network ${hre.network.name} ${address}`);
}

function explorerUrl(network, address) {
  const map = {
    baseSepolia: `https://sepolia.basescan.org/address/${address}`,
    base: `https://basescan.org/address/${address}`,
    polygonAmoy: `https://amoy.polygonscan.com/address/${address}`,
  };
  return map[network] || "(unknown network)";
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
