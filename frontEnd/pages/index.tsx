
import React, { useState, useEffect } from "react";
import Image from 'next/image'
import I1 from '../statics/i1.svg'
import I2 from '../statics/i2.svg'
import I3 from '../statics/i3.svg'
import I4 from '../statics/i4.svg'
import Dh from '../statics/dh.gif'
import I5 from '../statics/i5.svg'
import I6 from '../statics/i6.svg'
import I7 from '../statics/i7.svg'
import I8 from '../statics/i8.svg'
import I9 from '../statics/i9.png'
import I10 from '../statics/i10.png'
import I11 from '../statics/i11.png'
import I12 from '../statics/i12.svg'
import I13 from '../statics/i13.svg'
import I14 from '../statics/i14.svg'
import I15 from '../statics/i15.svg'
import I16 from '../statics/i16.svg'
import { useRouter } from "next/router";

const tabs = [I5, I6, I7]

const descro = [{
  name: 'What is Stellar Odyssey (Crux)?',
  des: "“Stellar Odyssey” is a soulbound NFT on the Starknet. To obtain a Stellar Odyssey NFT,you need to bundle your Layer 1 EVM wallets and get verified. The token serves as a bridge between your on-chain reputation on Layer 1 and Starknet. By using Stellar Odyssey, you can seamlessly leverage your existing reputation on Layer 1 to establish yourself on Starknet."
}, {
  name: 'What can Stellar Odyssey be used for?',
  des: "Stellar Odyssey can be used in many ways. By bridging your Layer 1 reputation to Starknet, you can avoid the need to establish a new reputation from the start and instead benefit from your existing on-chain reputation. One of the most common use cases is the creation of a Sybil-resistant identity. Leveraging your on-chain reputation enables you to prove your identity and reputation in Starknet. And also new projects on Starknet will likely attract users with a particular reputation. By leveraging your existing on-chain L1 reputation, you may have early access and maximize the value of your reputation. And more interesting is Attestations. Based on the Stellar Odyssey allowed users to verify, proof, and vote on other users' Identifiers, Credentials, and more."
}, {
  name: 'What’s the current stage?',
  des: 'We are currently in the testing stage. Stellar Odyssey NFT contract is deployed on the Testnet of Starknet. Once completed, we will deploy to the Starknet mainnet; The estimated completion time is mid-May.'
}]

export default function Index() {
  const router = useRouter();
  const [step, setStep] = useState(2)

  const [activeIdx, setActiveIdx] = useState(0)

  const [actIdx,setActIdx] = useState<any>('')

  const actOnchange = (i) => {
    if(actIdx === i){
      setActIdx('')
    }else{
      setActIdx(i)
    }
    
  }

  return (
    <div className="w-full h-full boundle-bg relative text-[#fff] overflow-auto">
        <div className="h-[100vh] w-[100vw] p-5">
          <div className="flex items-center">
            <Image
              className="mr-5"
              src={I1}
              alt=""
            />
            <div className="text-[18px]">where your on-chain reputation becomes a beacon across the chains guiding you forward in Starknet</div>
          </div>
          <div className="h-[calc(100%-88px)] flex items-center justify-center relative w-full">
            <div className="absolute z-50">
              <div className="flex items-center justify-center">
                <Image
                  className="mr-5 w-[100%]"
                  src={I2}
                  alt=""
                />
              </div>
              <div className="flex items-center justify-center mt-5">
                <div className="w-[100%] flex items-center">
                  <div><p className="font-[600] text-[24px]">Don't start from scratch!</p>
                    <p>Launch your Layer 1 reputation across the Chain on Starknet</p></div>
                  <Image
                    className="ml-[auto] cursor-pointer hover:opacity-70"
                    onClick={() => router.push('/home')}
                    src={I3}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <Image
              className="absolute top-0 h-[100%] right-[10%] z-40"
              src={Dh}
              alt=""
            />
          </div>
          <div className="h-[44px] flex items-center justify-center">
            <Image
              src={I4}
              className="hover:opacity-70"
              alt=""
            />
          </div>
        </div>
        <div className="w-[100vw] p-5">
          <div className="flex">
            <div className="bg-[#fff] w-[120px] h-[2px] mt-5 mr-5"></div>
            <div className="text-[16px] text-[rgba(255,255,255,0.5)]">
              <p className="text-[30px] mb-5 text-[rgba(255,255,255,1)]">How It works</p>
              <Image
                src={I8}
                alt=""
              />
            </div>
          </div>

          <div className="flex justify-between gap-10 px-20 mt-10">
            <div className="w-1/2 flex items-center h-[446px]">
              <div>
                {
                  tabs.map((t, i) => (
                    <div key={i} className={`flex items-center  ${i === 0 || i === 1 ? ' mb-10' : ''}`}>
                      <div className={`mr-5 ${i === 0 ? 'ml-20' : i === 1 ? 'ml-10' : ''} ${activeIdx === i ? 'opacity-100' : 'opacity-40'}`}>{`0${i + 1}`}</div>
                      <div>
                        <Image
                          src={t}
                          onClick={() => setActiveIdx(i)}
                          className={`${activeIdx === i ? 'opacity-100' : 'opacity-40'} cursor-pointer`}
                          alt=""
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="w-1/2 h-[446px]">
              {
                activeIdx === 0 &&
                <Image
                  src={I9}
                  className='h-[446px]'
                  alt=""
                />
              }
              {
                activeIdx === 1 &&
                <Image
                  src={I10}
                  className='h-[446px]'
                  alt=""
                />
              }
              {
                activeIdx === 2 &&
                <Image
                  src={I11}
                  className='h-[446px]'
                  alt=""
                />
              }
              {
                activeIdx === 0 &&
                <Image
                  src={I12}
                  className='mt-[-40px]'
                  alt=""
                />
              }
              {
                activeIdx === 1 &&
                <Image
                  src={I13}
                  className='mt-[-40px]'
                  alt=""
                />
              }
              {
                activeIdx === 2 &&
                <Image
                  src={I14}
                  className='mt-[-40px]'
                  alt=""
                />
              }

            </div>
          </div>
          <div className="mt-[120px] mb-20 w-[80%] mx-[auto]">
            {
              descro.map((t, i) => (
                <div>
                  <div className="text-[24px] py-4 border-b-[2px] border-[rgba(255,255,255,0.5)] cursor-pointer flex items-center" onClick={() => actOnchange(i)}>
                    <div>{t.name}</div>
                    {
                      actIdx === i ?(
                      <Image
                      src={I15}
                      className='ml-[auto] h-[30px] w-[30px] border-[rgba(255,255,255,0.5)] rotate-45'
                      alt=""
                    />):(
                      <Image
                      src={I15}
                      className='ml-[auto] h-[30px] w-[30px] border-[rgba(255,255,255,0.5)]'
                      alt=""
                    />
                    )
                    }
                  </div>
                  {
                    actIdx === i &&
                    <div className="mt-4 text-[rgba(255,255,255,0.5)]">{t.des}</div>
                  }
                
                </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}
