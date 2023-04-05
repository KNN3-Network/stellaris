
import React, { useState, useEffect } from "react";
import P1 from '../statics/img/browser.png'
import { loginAccountState, starkProviderState, useAddressList } from "../store/state";
import { useRouter } from "next/router";
import { shortenAddr } from './../lib/tool'
import useWeb3Context from "../hooks/useWeb3Context";
import dynamic from 'next/dynamic'
import Web3 from 'web3'
import Step from '../components/Step'
import { toast } from "react-toastify";
import { connect } from "get-starknet"
import { starkNetContract } from './../config'
import Image from 'next/image'
import Warning from '../statics/bot-warning.gif'
import BotGif from './../components/BotGif'

export default function Home() {
  const router = useRouter();
  const { loginAccount, setLoginAccount } = loginAccountState()
  const { addressList, setAddressList } = useAddressList();
  const { provider, setProvider } = starkProviderState()
  const { connectWallet } = useWeb3Context();

  const connector = async () => {

    const starknetX: any = await connect({
      modalMode: "alwaysAsk",
      modalTheme: "dark",
      storeVersion: "chrome"
    })

    console.log(starknetX)

    if (!starknetX) {
      toast.info('User rejected wallet selection or silent connect found nothing')
      return
    }

    await starknetX.enable()

    if (starknetX.isConnected) {
      if (starknetX.id === 'argentX') {
        if (starknetX.chainId !== 'SN_GOERLI') {
          toast.error('Switch your wallet to the Testnet!')
          return false
        }
      }

      if (starknetX.id === 'braavos') {
        if (starknetX.account.baseUrl !== 'https://alpha4.starknet.io') {
          toast.error('Switch your wallet to the SN Goerli!')
          return false
        }
      }

      setProvider(starknetX)

      setLoginAccount(starknetX.account.address)

      const res = await starknetX.provider.callContract(
        {
          contractAddress: starkNetContract,
          entrypoint: 'balanceOf',
          calldata: [Web3.utils.hexToNumberString(starknetX.account.address)]
        }
      )

      if (res && res.result) {
        toast.success('Connect successed!')
        if (res.result[0] === '0x0') {
          setAddressList([])
          router.push('/bundle')
        }
        if (res.result[0] === '0x1') {
          router.push('/note')
        }

      }
    } else {

    }
  }

  return (
    <div className="w-full h-full home-bg relative">
      <div onClick={() => connector()} className="flex justify-center items-center absolute bottom-[30%] right-[15%] text-[#fff] w-[24%] border-[1px] border-[#4A4A4A] px-[10px] py-[10px] font-[600] rounded-[4px] mb-[10px] cursor-pointer">
        <span>Connect Wallet</span>
      </div>
      <div className="absolute bottom-[60px] left-[50%] translate-x-[-51%] w-full flex items-center justify-center">
        <Step num={1} />
      </div>
      <BotGif/>
    </div>
  )
}
