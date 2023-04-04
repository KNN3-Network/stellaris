
import React, { useState, useEffect } from "react";
import Image from 'next/image'
import P1 from '../statics/img/browser.png'
import { connect, WalletProvider } from "@argent/get-starknet"
import { loginAccountState,starkProviderState,useAddressList } from "../store/state";
import { useRouter } from "next/router";
import { shortenAddr } from './../lib/tool'
import useWeb3Context from "../hooks/useWeb3Context";
import Web3 from 'web3'
import Step from '../components/Step'
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const { loginAccount, setLoginAccount } = loginAccountState()
  const { addressList, setAddressList } = useAddressList();
  const { provider, setProvider } = starkProviderState()
  const { connectWallet } = useWeb3Context();
  
  const connector = async () => {

    const starknetX: any = await connect({ modalMode: "alwaysAsk" })

    if (!starknetX) {
      toast.info('User rejected wallet selection or silent connect found nothing')
    }

    await starknetX.enable()

    if (starknetX.isConnected) {
      
      console.log(starknetX)

      toast.success('Connect successed!')

      setProvider(starknetX)

      setLoginAccount(starknetX.account.address)

      const res = await starknetX.provider.callContract(
        {
          contractAddress: '0x00b2a79e54ff9c6b5a50cb6b60366c4ddb432ff44db1a847ccf7db6ea19c1eaf',
          entrypoint: 'balanceOf',
          calldata:[Web3.utils.hexToNumberString(starknetX.account.address)]
        }
      )
      console.log(res)
      if(res && res.result && res.result[0] === '0x0'){
        setAddressList([])
        router.push('/bundle')
      }

      if(res && res.result && res.result[0] === '0x1'){
        router.push('/note')
      }
      
    } else {

    }
  }

  return (
    <div className="w-full h-full home-bg relative">
      <div onClick={() => connector()} className="flex justify-center items-center absolute bottom-[30%] right-[15%] text-[#fff] w-[24%] border-[1px] border-[#4A4A4A] px-[10px] py-[10px] font-[600] rounded-[4px] mb-[10px] cursor-pointer">
        <span>Connect Wallet</span>
      </div>
      <div className="absolute bottom-[40px] left-[50%] translate-x-[-51%] w-full flex items-center justify-center">
        <Step num={1}/>
      </div>
    </div>
  )
}
