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
  const res = await myContract.call("nonce", [
    "2764509738225222730632001221651244256434311306728969895596721352716317423526", //  "0x061ca8353f215aa7cdd07098d95ff0a709d08288849f537a85e85470ed0cf7a6",
  ]);

  console.log("res", Number(res));

  const hashMsg = pedersen(accountAddress, nonce);
  const signature = sign(hashMsg, privateKey);
  const pubKey = getPublicKey(privateKey);

  console.log("pubKey", pubKey);
  console.log("signature", signature);

  const signerPublicKey = await myContract.call("signerPublicKey");
  console.log("signerPublicKey", signerPublicKey);
  console.log("Initial signerPublicKey =", signerPublicKey.key); // .res because the  return value is called 'res' in the cairo contract

  const res1 = await myContract.invoke("publicMint", [
    [`${signature.r}`, `${signature.s}`], //  "0x2b0c236ca7ddb15ab12a1bc1eeeb9e32c9cca1c8a480bd84059d29fa359de5b",
  ]);

  console.log("res1", res1);
}

main();
