import React from "react";
import { Modal } from 'antd';
import Image from 'next/image'
import Plogin from '../../statics/img/login-head-icon.png'
import P1 from '../../statics/img/browser.png'
import P2 from '../../statics/img/wallect1.png'
import useWeb3Context from "../../hooks/useWeb3Context";
import { CloseOutlined } from "@ant-design/icons";

const LoginConnect = (props: any) => {
    const { onConnect } = props

    const {connectWallet} = useWeb3Context();

    const handleOk = () => {
        props.onCancel();
    };

    const handleCancel = () => {
        props.onCancel();
    };

    const connector = async (walletName: string) => {
        const res = await connectWallet(walletName);
        if(res){
            handleCancel();
            onConnect();
        }
    }

    return (
        <Modal title="Basic Modal" open={true} onOk={handleOk} onCancel={handleCancel} width={'500px'}>
            <div className='flex items-center pb-3 border-b-[1px] border-[#4A4A4A] mb-2'>
                <div className='flex items-center'>
                    <Image
                        src={Plogin}
                        alt=""
                    />
                    <span className='font-[600] text-[20px]'>Login</span>
                </div>
                <div className='ml-[auto] cursor-pointer' onClick={() => handleCancel()}>
                    <CloseOutlined className='text-[20px]' />
                </div>
            </div>
            <div className="text-[16px] text-[rgba(255,255,255,0.8)]">
                <div className="text-[#EEFBFF] text-[20px]">Connect your wallet.</div>
                <div className="text-[#6C747D] text-[14px]">Connect with one of available wallet providers or create a new one.</div>
                <div className="mt-4">
                    <div onClick={()=> connector('injected') } className="flex items-center border-[1px] border-[#4A4A4A] px-[10px] py-[8px] font-[600] rounded-[4px] mb-[10px] cursor-pointer">
                        <span>Browser Wallet</span>
                        <Image
                            className="ml-[auto]"
                            src={P1}
                            alt=""
                        />
                    </div>
                    <div onClick={()=> connector('walletconnect') } className="flex items-center border-[1px] border-[#4A4A4A] px-[10px] py-[8px] font-[600] rounded-[4px] cursor-pointer">
                        <span>WalletConnect</span>
                        <Image
                            className="ml-[auto]"
                            src={P2}
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default LoginConnect