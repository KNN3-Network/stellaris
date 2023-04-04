const fs = require("fs");
const { Provider, ec, Account, json, Contract } = require("starknet");
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
  const url =
    "ipfs://bafybeiewid2x6rwy2dxf43ft6wm3xmni6g4khflqf47ezhmqemaxw7hddm/";
  const baseTokenURI = strToFeltArr(url);

  console.log("baseTokenURI", baseTokenURI);
  const res = await myContract.invoke("setBaseURI", [
    [
      "186294699441980128605075782287294891093507238512329683357240547776367178598",
      "205330173550886158057568023912808718874657495427391943428186613987581392695",
      "448360901935",
    ],
  ]);

  console.log("res", res);
}

function strToFeltArr(str) {
  const size = Math.ceil(str.length / 31);
  const arr = Array(size);

  let offset = 0;
  for (let i = 0; i < size; i++) {
    const substr = str.substring(offset, offset + 31).split("");
    const ss = substr.reduce(
      (memo, c) => memo + c.charCodeAt(0).toString(16),
      ""
    );
    arr[i] = BigInt("0x" + ss);
    offset += 31;
  }
  return arr;
}

main();
