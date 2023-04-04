import Web3 from "web3";
import { message } from "antd";
import config from "../config";

const web3 = new Web3(config.provider);

export const shortenAddr = (address, length = 3) => {
  if(!address) return ''
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const switchChain = async (chainId) => {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId.toString(16)}` }],
  });
};
