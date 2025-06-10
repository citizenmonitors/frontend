import "./layout.css";

import inter from "./fonts/inter";
import league_spartan from "./fonts/league_spartan";
import Providers from "./providers/Providers";
import primaryMetadata from "./metadata";
import { Metadata } from "next";

export const metadata: Metadata = primaryMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${league_spartan.variable} font-inter`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
