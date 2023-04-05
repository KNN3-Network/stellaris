import React from "react";
import Image from 'next/image'
import Warning from '../statics/bot-warning.gif'

const BotGif = (props: any) => {
    return (
        <div className="w-full flex items-center justify-center absolute bottom-[10px] left-0 w-[1920px]">
        <Image
          className="w-[1920px]"
          src={Warning}
          alt=""
        />
      </div>
    )
}

export default BotGif