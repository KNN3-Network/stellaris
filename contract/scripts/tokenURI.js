const fs = require("fs");
const { Provider, ec, Account, json, Contract, uint256 } = require("starknet");
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
  const tokenId = toUint256WithFelts("1");
  console.log("tokenId", tokenId);
  const res = await myContract.call("tokenURI", [tokenId]);

  console.log("res", feltArrToStr(res.tokenURI));
}

function toUint256WithFelts(num) {
  const n = uint256.bnToUint256(num);
  return {
    low: BigInt(n.low.toString()),
    high: BigInt(n.high.toString()),
  };
}

function feltArrToStr(felts) {
  return felts.reduce(
    (memo, felt) => memo + Buffer.from(felt.toString(16), "hex").toString(),
    ""
  );
}

main();
