const hre = require("hardhat");

const CONTRACT_ADDRESS = "0x262a7032b4E7415B13C5C7c4318069910797b336";
const NEW_OPERATOR = "0x008F1a9a6eCC0868A6ab09d8Bf0e8552838B8501";

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Authorizing new operator using current wallet:", signer.address);

  const passport = await hre.ethers.getContractAt("SkinPassport", CONTRACT_ADDRESS, signer);

  console.log(`\nGranting operator rights to ${NEW_OPERATOR}...`);
  const tx = await passport.setOperator(NEW_OPERATOR, true);
  const receipt = await tx.wait();
  console.log(`✅ Done! Tx: https://sepolia.basescan.org/tx/${receipt.hash}`);

  const isAuthorized = await passport.authorizedOperators(NEW_OPERATOR);
  console.log(`\nVerification — is new operator authorized? ${isAuthorized}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});