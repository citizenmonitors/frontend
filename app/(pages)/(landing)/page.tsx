import React from "react";
import LandingLayout from "@/app/components/landing/_layout";
import Intro from "@/app/components/landing/home/intro/Intro";
import About from "@/app/components/landing/home/about/About";
import Showcase from "@/app/components/landing/home/showcase/Showcase";
import Disclaimer from "@/app/components/shared/Disclaimer";
import FAQ from "@/app/components/landing/home/FAQ/FAQ";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.METADATA_BASEURL!}/`,
  }
}

export default function Home() {
  return (
    <LandingLayout>
      <main className="landing-container">
        <Intro />
        <About />
        <Showcase />
        <section className="container">
          <Disclaimer />
        </section>
        <FAQ />
      </main>
    </LandingLayout>
  );
}
