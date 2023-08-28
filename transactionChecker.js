import Web3 from "web3";
import fs from "fs";
import Web3HttpProvider from "web3-providers-http";

const web3 = new Web3(
  new Web3HttpProvider(
    "https://api.blacksun.net/ethereum/sepolia/efb75fc91ae07767979cbb06524e2b6a"
  )
);

// Replace 'YOUR_PRIVATE_KEY' with your private key
const privateKey =
  "";
// const privateKeyBuffer = Buffer.from(privateKey, 'hex')
// Create an account object from the private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
console.log(account.address);
// Add the account to the wallet
web3.eth.accounts.wallet.add(account);

const checkBlock = async () => {
  let block = await web3.eth.getBlock("latest");
  let blockNumber = block.number;

  console.log("Searching Block", blockNumber);

  if (block != null && block.transactions != null) {
    for (let txHash of block.transactions) {
      let tx = await web3.eth.getTransaction(txHash);
      if (account == tx.to) {
        console.log(`Transaction Found on block ${blockNumber}`);
        console.log({
          address: tx.from,
          value: web3.utils.fromWei(tx.value, "ether"),
          timestamp: new Date(),
        });
      }
    }
  }
};

setInterval(() => {
  checkBlock();
}, 20000);
