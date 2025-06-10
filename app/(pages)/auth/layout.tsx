import React from "react";
import "./Auth.css";
import Link from "next/link";
import LogoFlat from "@/app/components/shared/svg/LogoFlat";

function AuthLayout({ children }: any) {
  const backgroundStyles: React.CSSProperties = {
    background: `
      url('/assets/auth/auth-background.webp')
    `,
    backgroundSize: "cover",
    backgroundPosition: "bottom",
  };

  return (
    <main
      className="w-full min-h-[100vh] bg-white grid place-items-center p-5 md:p-8"
      style={backgroundStyles}
    >
      <div className="auth-container w-full max-w-[480px] md:max-w-[950px] rounded-lg bg-white px-5 md:px-8 py-8 flex flex-col place-items-center shadow-lg">
        <Link href={"/"} className="logo-container sm:hidden mb-[28px]">
          <LogoFlat size={32} />
        </Link>
        <Link href={"/"} className="logo-container hidden sm:block md:hidden mb-[32px]">
          <LogoFlat size={40} />
        </Link>
        <Link href={"/"} className="logo-container hidden md:block mb-[32px]">
          <LogoFlat size={55} />
        </Link>
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;
