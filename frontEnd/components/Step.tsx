import React from "react";
import { Modal } from 'antd';
import Image from 'next/image'
import { CheckOutlined } from "@ant-design/icons";

const Step = (props: any) => {
    const { num } = props
    return (
        <div className="flex items-center">
            <div className="w-[30px] h-[30px] bg-[#BBE7E6] flex items-center justify-center rounded-[50%]">
                {
                    num === 1 ? (
                        <div className="h-[10px] w-[10px] bg-[#000] rounded-[50%]"></div>
                    ) : (
                        <CheckOutlined style={{ color: '#000' }} className="text-[#000]" />
                    )
                }
            </div>
            <div className="w-[100px] h-[2px] bg-[#BBE7E6]">
            </div>
            <div className={`w-[30px] h-[30px] ${num < 2 ? 'border-[#BBE7E6] border-[2px]' : 'bg-[#BBE7E6]'} flex items-center justify-center rounded-[50%]`}>
                {
                    num === 2 ? (
                        <div className="h-[10px] w-[10px] bg-[#000] rounded-[50%]"></div>
                    ) : <CheckOutlined style={{ color: '#000' }} className="text-[#000]" />
                }
            </div>
            <div className="w-[100px] h-[2px] bg-[#BBE7E6]">
            </div>
            <div className={`w-[30px] h-[30px] ${num < 3 ? 'border-[#BBE7E6] border-[2px]' : 'bg-[#BBE7E6]'} flex items-center justify-center rounded-[50%]`}>
                {
                    num === 3 ? (
                        <div className="h-[10px] w-[10px] bg-[#000] rounded-[50%]"></div>
                    ) : <CheckOutlined style={{ color: '#000' }} className="text-[#000]" />
                }
            </div>
            <div className="w-[100px] h-[2px] bg-[#BBE7E6]">
            </div>
            <div className={`w-[30px] h-[30px] ${num < 4 ? 'border-[#BBE7E6] border-[2px]' : 'bg-[#BBE7E6]'} flex items-center justify-center rounded-[50%]`}>
                {
                    num === 4 ? (
                        <div className="h-[10px] w-[10px] bg-[#000] rounded-[50%]"></div>
                    ) : <CheckOutlined style={{ color: '#000' }} className="text-[#000]" />
                }
            </div>
        </div>
    )
}

export default Step