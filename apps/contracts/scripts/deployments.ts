import { network, viem } from 'hardhat';
import { parseAbiItem } from 'viem';
import Artifact from '../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  // Wallet client (signer)
  const [walletClient] = await viem.getWalletClients();

  // Public client (read-only)
  const publicClient = await viem.getPublicClient();

  console.log('Deploying with acount:', walletClient.account.address);

  // Deploy contract
  const hash = await walletClient.deployContract({
    abi: Artifact.abi,
    bytecode: Artifact.bytecode as `0x${string}`,
    args: [],
  });

  console.log('Deployment tx hash:', hash);

  // Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log('SimpleStorage deployed at:', receipt.contractAddress);

  // Task 2 - Event Validation
  console.log('\n--- Checking Events ---');

  const ownerSetLogs = await publicClient.getLogs({
    address: receipt.contractAddress!,
    event: parseAbiItem('event OwnerSet(address indexed oldOwner, address indexed newOwner)'),
    fromBlock: receipt.blockNumber,
    toBlock: receipt.blockNumber,
  });

  if (ownerSetLogs.length > 0) {
    console.log('OwnerSet event emitted during deployment');
    console.log('Old Owner:', ownerSetLogs[0].args.oldOwner);
    console.log('New Owner:', ownerSetLogs[0].args.newOwner);
  }

  // Task 3 - Deploy Ulang
  const deploymentInfo = {
    contractAddress: receipt.contractAddress,
    transactionHash: hash,
    blockNumber: receipt.blockNumber.toString(),
    deployer: walletClient.account.address,
    network: 'avalancheFuji',
    timestamp: new Date().toISOString(),
    abi: Artifact.abi,
  };

  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `SimpleStorage_${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

  console.log(`\nDeployment info saved to ${filepath}`);

  const contract = await viem.getContractAt('SimpleStorage', receipt.contractAddress!);

  const setValueHash = await contract.write.setValue([42n]);
  console.log('setValue tx hash:', setValueHash);

  const setValueReceipt = await publicClient.waitForTransactionReceipt({ hash: setValueHash });

  const valueUpdatedLogs = await publicClient.getLogs({
    address: receipt.contractAddress!,
    event: parseAbiItem('event ValueUpdated(uint256 newValue)'),
    fromBlock: setValueReceipt.blockNumber,
    toBlock: setValueReceipt.blockNumber,
  });

  if (valueUpdatedLogs.length > 0) {
    console.log('✓ ValueUpdated event emitted');
    console.log('  New Value:', valueUpdatedLogs[0].args.newValue);
  }

  // Test setMessage
  console.log('\n=== Testing setMessage ===');

  const setMessageHash = await contract.write.setMessage(['Hello Avalanche!']);
  console.log('setMessage tx hash:', setMessageHash);

  const setMessageReceipt = await publicClient.waitForTransactionReceipt({ hash: setMessageHash });

  const messageUpdatedLogs = await publicClient.getLogs({
    address: receipt.contractAddress!,
    event: parseAbiItem('event MessageUpdated(string newMessage)'),
    fromBlock: setMessageReceipt.blockNumber,
    toBlock: setMessageReceipt.blockNumber,
  });

  if (messageUpdatedLogs.length > 0) {
    console.log('✓ MessageUpdated event emitted');
    console.log('  New Message:', messageUpdatedLogs[0].args.newMessage);
  }

  // Read values
  const storedValue = await contract.read.getValue();
  const storedMessage = await contract.read.getMessage();

  console.log('\n=== Current State ===');
  console.log('Stored Value:', storedValue);
  console.log('Stored Message:', storedMessage);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
