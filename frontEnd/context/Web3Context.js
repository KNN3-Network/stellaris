import { useState, createContext, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import Web3 from "web3";
import config from "../config";
import { ethers } from "ethers";
import api from "../api";
import { useRecoilState } from "recoil";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { switchChain } from "../lib/tool";
import { LoadingOutlined } from "@ant-design/icons";
import useWeb3Modal from "../hooks/useWeb3Modal";
// import starknet from 'starknet'

const actionMapping = [
  "Transaction being processed",
  "Transaction Success",
  "Transaction Failed",
];

const errorMsg = `Metamask plugin not found or not active. Please check your browser's plugin list.`

export const Web3Context = createContext({
  web3: null,
  signer: null,
  chainId: null,
  networkId: null,
  blockNumber: null,
  account: null,
  connector: null,
  connectWallet: async (walletName) => {
    return "";
  },
  resetWallet: async () => { },
  estimateGas: async () => { },
  signMessage: async (message) => {
    return "";
  },
  sendTx: async () => { },
  doLogin: async () => { },
  doLogout: async () => { },

});

export const Web3ContextProvider = ({ children }) => {
  const web3Modal = useWeb3Modal();
  const [web3, setWeb3] = useState("");
  const [signer, setSigner] = useState("");
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [networkId, setnetworkId] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const [wcProvider, setWcProvider] = useState("");
  const [connector, setConnector] = useState("");

  const listenProvider = () => {
    if (!window.ethereum) {
      return
    }
    window.ethereum.on("close", () => {
      resetWallet();
    });
    window.ethereum.on("accountsChanged", async (accounts) => {
      setAccount(accounts[0]);
      localStorage.removeItem("knn3Token");
      localStorage.removeItem("knn3RefreshToken");
      api.defaults.headers.authorization = "";
      // setKnn3TokenValid(false);
      // setCurrentProfile('')
    });
    window.ethereum.on("chainChanged", (chainId) => {
      setChainId(parseInt(chainId, 16));
    });
  };

  const connectWallet = useCallback(async (walletName) => {

    // console.log('web3',web3Modal)
    // console.log('phan',window.phantom)
    console.log('metamask', window.ethereum)
    if (!window.ethereum) {
      toast.info(errorMsg)
      return
    }
    try {
      let web3Raw = null;
      if (walletName === "walletconnect") {
        const provider = new WalletConnectProvider({
          infuraId: config.infuraId,
        });
        await provider.enable();
        setWcProvider(provider);
        setConnector("walletconnect");
        console.log(provider)
        web3Raw = new Web3(provider);
      } else if (walletName === "injected") {
        await window.ethereum.enable();
        setConnector("");
        console.log(window.ethereum)
        web3Raw = new Web3(window.ethereum);
      } else if (walletName === "starknet") {
        const starknetX = await connect()
        // const provider = new Provider({ sequencer: { network: "goerli-alpha" } });
        // await provider.connect();
        // web3Raw = new Web3(provider);
      }

      setWeb3(web3Raw);

      // get account, use this variable to detech if user is connected
      const accounts = await web3Raw.eth.getAccounts();

      // setAccount(accounts[0]);

      // get signer object
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

      const signerRaw = ethersProvider.getSigner();

      setSigner(signerRaw);

      
      // get network id
      setnetworkId(await web3Raw.eth.net.getId());

      // get chain id
      setChainId(await web3Raw.eth.getChainId());

      // init block number
      setBlockNumber(await web3Raw.eth.getBlockNumber());

      switchChain(config.chainId);

      const signature = await web3Raw.eth.personal.sign('Hello Starknet', accounts[0])

      if(signature){
        setAccount(accounts[0]);
        return accounts[0];
      }

      // return doLogin(accounts[0])
    } catch (error) {
      setWeb3(new Web3(config.provider));
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Modal]);

  useEffect(() => {
    if (chainId !== config.chainId && window.ethereum) {
      switchChain(config.chainId)
    }
  }, [chainId])

  const resetWallet = useCallback(async () => {
    console.log("ready to reset", connector, wcProvider);

    if (wcProvider) {
      localStorage.removeItem("walletconnect");
      setWcProvider(null);
      setConnector(null)
    } else {
      // wallet.reset();
    }

    setConnector("");
    setAccount("");
  }, []);

  useEffect(() => {
    listenProvider();
  }, [])

  const estimateGas = async (func, value = 0) => {
    try {
      const gas = await func.estimateGas({
        from: account,
        value,
      });
      return Math.floor(gas * 1.5);
    } catch (error) {
      console.log("eee", error);
      const objStartIndex = error.message.indexOf("{");
      const obj = JSON.parse(error.message.slice(objStartIndex));
      toast.error(obj.message);
    }
  };

  const doLogin = async (loginAccount) => {
    const signature = await web3.eth.personal.sign('Hello Starknet', loginAccount)
    if(signature){
      setAccount(loginAccount);
      return loginAccount;
    }
  };

  const doLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("knn3Token");
    localStorage.removeItem("knn3RefreshToken");
    api.defaults.headers.authorization = "";
    // setKnn3TokenValid(false)
    resetWallet();
    // setCurrentProfile('')
  };

  /**
   *
   * @param {*} func , required
   * @param {*} actionType , required
   * @param {*} value , default 0
   * @returns
   */

  const sendTx = async (func, value = 0) => {
    const gasLimit = await estimateGas(func, value);

    // gas price is necessary for matic
    const gasPrice = Number(await web3.eth.getGasPrice());

    if (!isNaN(gasLimit)) {
      return func
        .send({
          gas: gasLimit,
          gasPrice,
          from: account,
          value,
        })
        .on("transactionHash", (txnHash) => {
          toast.info(actionMapping[0], {
            icon: <LoadingOutlined />,
          });
        })
        .on("receipt", async (receipt) => {
          // const txnHash = receipt?.transactionHash;
          toast.success(actionMapping[1], {});
        })
        .on("error", async (err, txn) => {
          // const txnHash = txn?.transactionHash;

          if (err.code === 4001) {
            toast.error("User canceled action");
          } else {
            toast.error(actionMapping[2], {});
          }
        });
    }
  };

  /**
   * Sign message
   */

  const signMessage = async (message,loginAccount) => {
    return await web3.eth.personal.sign(message, loginAccount);
  };

  // useEffect(() => {
  //   if (autoConnect) {
  //     connectWallet();
  //   }
  // }, [autoConnect]);

  return (
    <Web3Context.Provider
      value={{
        web3,
        signer,
        chainId,
        networkId,
        account,
        connector,
        blockNumber,
        connectWallet,
        resetWallet,
        estimateGas,
        sendTx,
        signMessage,
        doLogin,
        doLogout,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const Web3ContextConsumer = Web3Context.Consumer;
