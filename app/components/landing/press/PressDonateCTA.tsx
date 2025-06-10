import React from 'react'
import LogoFlat from "@/app/components/shared/svg/LogoFlat";
import { Button } from "antd";
import Image from "next/image";

export default function PressDonateCTA() {
  return (
    <div className="m-[13px] ring-[13px] ring-brand-500 rounded-lg p-4 lg:px-12 xl:px-16 flex flex-col lg:flex-row lg:justify-between items-center gap-16 relative overflow-hidden">
    <Image
      src="/assets/press/scale.png"
      alt="cursor"
      className="right-0 lg:top-0 lg:bottom-auto bottom-0 absolute translate-y-[40%] lg:-translate-y-[10%] translate-x-1/2"
      width={220}
      height={225}
    />
    <div className="relative isolate w-[180px] lg:w-[268px] lg:h-[200px] flex justify-center">
      <Image
        src="/assets/press/circle.png"
        alt="circle"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 aspect-square h-[180px]"
        width={180}
        height={180}
      />
      <Image
        src="/assets/press/phone.png"
        alt="display phone"
        className="object-contain lg:h-[391px] lg:w-[270px]"
        width={147}
        height={214}
      />
    </div>
    <div className="hidden lg:block">
      <LogoFlat size={60} />
    </div>
    <div className="relative">
      {" "}
      <Button
        type="primary"
        size="large"
        className="text-lg flex justify-center items-center w-[200px] h-[60px] rounded-lg mb-8 lg:mb-0"
        href='/donate'
      >
        Donate Now
      </Button>
      <Image
        src="/assets/press/cursor.png"
        alt="cursor"
        className="right-0 bottom-0 absolute translate-x-1/2 lg:translate-y-1/2"
        width={77}
        height={62}
      />
    </div>
  </div>
  )
}
