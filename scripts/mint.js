const hre = require("hardhat");

// 🔧 Попълни IPFS URI-тата тук СЛЕД като качиш metadata/client1-4.json в Pinata
// (виж README_MINT.md за инструкции стъпка по стъпка)
const CLIENTS = [
  {
    name: "Kristin Apostolova",
    wallet: "0xA58Ed79C02B2e2239900678140cD694b73b732a7",
    skinType: "Fitzpatrick III",
    metadataURI: "ipfs://bafkreiajlj3w6ckbdfjlglsx7ch75jjz6sjhepmgu3rzh3ck3ido7czhf4",
  },
  {
    name: "Sonya Georgieva",
    wallet: "0x788378E41025F695154eF3346660c2F8f46E6e9d",
    skinType: "Fitzpatrick II",
    metadataURI: "ipfs://bafkreia5n3l2sbanu53ysl3bavbg37ftwg5vtkzvvujhtqh4nv5fydg2hm",
  },
  {
    name: "Tanya Petrova",
    wallet: "0x6b411955296398B8BA97b21B9176BefDF29D7B5E",
    skinType: "Fitzpatrick IV",
    metadataURI: "ipfs://bafkreic2o6f6eq4wzr74xkqu4z7egyi7d6avhikenjs43gcjmtsit4w5fa",
  },
  {
    name: "Iva Georgieva",
    wallet: "0x8b99517b10DFCa301e89385567Cf53BB6a0e3E14",
    skinType: "Fitzpatrick III",
    metadataURI: "ipfs://bafkreihdnuxfceinsb677iualsx3l3ddie3cdgbwibidt542tv2ieuqh5y",
  },
];

const CONTRACT_ADDRESS = "0xD9ee2a27e41B1350406F6c9D42f680A869Bd6A52"; // Base MAINNET

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Minting from operator wallet:", signer.address);

  const passport = await hre.ethers.getContractAt("SkinPassport", CONTRACT_ADDRESS, signer);

  for (const client of CLIENTS) {
    if (client.metadataURI.includes("PASTE_CID")) {
      console.log(`⏭️  Skipping ${client.name} — metadata URI not set yet`);
      continue;
    }

    console.log(`\nMinting passport for ${client.name} (${client.wallet})...`);
    try {
      const tx = await passport.mintPassport(client.wallet, client.skinType, client.metadataURI);
      const receipt = await tx.wait();
      console.log(`✅ Minted! Tx: https://basescan.org/tx/${receipt.hash}`);
    } catch (err) {
      console.error(`❌ Failed for ${client.name}:`, err.reason || err.message);
    }
  }

  console.log("\nDone. Check all passports at:");
  console.log(`https://basescan.org/address/${CONTRACT_ADDRESS}#readContract`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
