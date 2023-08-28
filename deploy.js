// Import the required libraries
import Web3 from "web3";
import fs from "fs";
import Web3HttpProvider from "web3-providers-http";
import abiJson from "./abi.json" assert { type: "json" };

var options = {
  keepAlive: true,
  withCredentials: false,
  timeout: 20000, // ms
  headers: [
    {
      name: "Access-Control-Allow-Origin",
      value: "*",
    },
  ],
  // agent: {
  //     http: http.Agent(),
  //     baseUrl: ''
  // }
};

// Connect to Blacksun RPC endpoint using Web3
const web3 = new Web3(
  new Web3HttpProvider(
    "https://api.blacksun.net/ethereum/sepolia/efb75fc91ae07767979cbb06524e2b6a"
  )
);
// const web3 = new Web3(new Web3.providers.HttpProvider(["https://polygon-mumbai.infura.io/v3/a3e310d2d9fd45a18463040538facee1"]));
// const provider = new Web3HttpProvider('https://api.blacksun.net/ethereum/sepolia/efb75fc91ae07767979cbb06524e2b6a', options);
// const web31 = new Web3("https://polygon-mumbai.infura.io/v3/a3e310d2d9fd45a18463040538facee1");
// const web3 = new Web3(provider)

// Replace 'YOUR_PRIVATE_KEY' with your private key
const privateKey =
  "0x627dbd15ceac53ddb912b13c521a82dc25f8f6e36e26562459220ef03caa65ae";
// const privateKeyBuffer = Buffer.from(privateKey, 'hex')
// Create an account object from the private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
console.log(account.address);
// Add the account to the wallet
web3.eth.accounts.wallet.add(account);

// Read the ABI and bytecode files
const abi = fs.readFileSync("./abi.json", "utf8");
// console.log(JSON.parse(abi[0]))
const bytecode = fs.readFileSync("./bytecode.txt", "utf8");

// Create a new contract instance with the ABI
const myContract = new web3.eth.Contract(abiJson.abi);

// Define an async function to deploy the contract
const deploy = async () => {
  // Get the current gas price
  const gasPrice = await web3.eth.getGasPrice();
  // Estimate the gas required to deploy the contract
  const gasEstimate = await myContract.deploy({ data: bytecode }).estimateGas();

  // Deploy the contract
  const deployTx = myContract.deploy({ data: bytecode });

  const contractTx = await deployTx
    .send({ from: account.address, gas: 100000, gasPrice: gasEstimate })
    // Log the transaction hash
    .on("transactionHash", (hash) => console.log("Transaction Hash:", hash))
    // Log the confirmation number
    .on("confirmation", (confirmationNumber, receipt) =>
      console.log("Confirmation:", confirmationNumber)
    )
    // Log any errors
    .once("error", (error) => console.error("Error:", error));
  // Log the deployed contract address
  // .then((newContractInstance) =>
  //   console.log('Contract Address:', newContractInstance.options.address)
  // );
  console.log(`Contract deployed at ${contractTx.options.address}`);
  console.log(
    `Add DEMO_CONTRACT to the.env file to store the contract address: ${contractTx.options.address}`
  );
};

// Call the deploy function
deploy();
