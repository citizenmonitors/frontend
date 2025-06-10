import { socials } from "@/app/data/links";
import { Button } from "antd";
import Image from "next/image";
import React from "react";

export default function PressSocialCTA() {
  return (
    <section className="flex flex-col gap-5 mb-24">
      <h2 className="text-display-sm lg:text-display-lg font-league text-center leading-tight tracking-[-2%] font-bold text-gray-700">
        Stay <span className="text-brand-500">Connected</span> With Us
        <span className="text-brand-500">.</span>
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        {socials.map((social) => (
          <Button
            key={social.name}
            type="primary"
            className={`flex items-center justify-center gap-3 text-lg h-[60px] w-[180px] rounded-lg ${social.color}`}
            size="large"
            href={social.href}
            target="_blank"
          >
            <Image src={social.icon} alt={social.name} width={24} height={24} />
            {social.name}
          </Button>
        ))}
      </div>
    </section>
  );
}
