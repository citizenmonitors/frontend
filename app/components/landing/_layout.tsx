import React from "react";
import TopNavigation from "./TopNavigation";
import PrimaryNavigation from "./PrimaryNavigation";
import Footer from "./Footer";

type LandingLayoutProps = {
  children: React.ReactNode;
};
export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <React.Fragment>
      <TopNavigation />
      <PrimaryNavigation />
      { children }
      <Footer />
    </React.Fragment>
  );
}
