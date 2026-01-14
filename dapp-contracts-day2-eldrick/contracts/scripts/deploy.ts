
import { viem } from "hardhat";

async function main() {
  const contract = await viem.deployContract("SimpleStorage");
  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
