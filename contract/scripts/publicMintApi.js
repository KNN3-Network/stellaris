const fs = require("fs");
const { Provider, ec, Account, json, Contract } = require("starknet");
const { pedersen, sign, getPublicKey } = require("micro-starknet");

require("dotenv").config();

const provider = new Provider({ sequencer: { network: "goerli-alpha" } });

const privateKey = process.env.PRIVATEKEY;
const starkKeyPair = ec.getKeyPair(privateKey);
const accountAddress = process.env.ADDRESS;
("");

const account = new Account(provider, accountAddress, starkKeyPair);

console.log("account", account);

const contractAddress = process.env.CONTRACT;

const compiledContract = json.parse(
  fs.readFileSync("./out/main.json").toString("ascii")
);

// connect the contract
const myContract = new Contract(
  compiledContract.abi,
  contractAddress,
  provider
);

myContract.connect(account);

async function main() {
  const res1 = await myContract.invoke("publicMint", [
    [
      "3504902912260337818606573901823127429527707267560453436075831392742030843661",
      "2873382600252044108255374177220086729550382102923987496833291172493170296575",
    ], //  "0x2b0c236ca7ddb15ab12a1bc1eeeb9e32c9cca1c8a480bd84059d29fa359de5b",
  ]);

  console.log("res1", res1);
}

main();
