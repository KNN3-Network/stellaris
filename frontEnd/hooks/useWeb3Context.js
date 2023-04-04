import { Web3Context } from "../context/Web3Context";
import { useContext } from "react";

export default function useWeb3Context() {
  return useContext(Web3Context);
}
