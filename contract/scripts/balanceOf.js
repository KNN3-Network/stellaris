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
  const res = await myContract.call("balanceOf", [
    "2764509738225222730632001221651244256434311306728969895596721352716317423526", //  "0x061ca8353f215aa7cdd07098d95ff0a709d08288849f537a85e85470ed0cf7a6",
  ]);

  console.log("res", res.balance);
}

main();
