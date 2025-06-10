"use client";
import LandingLayout from "@/app/components/landing/_layout";
import React, { useEffect } from "react";
import "@/app/components/landing/resources/Resources.css";
import ResourceTabs from "@/app/components/landing/resources/ResourceTabs";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Layout({ children }: any) {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const imageCarouselItems = [
    {
      id: 1,
      image: "/assets/resources/videos.png",
      title: "Videos",
      subtitle: "Watch Tutorial Videos on How Citizen Monitors Works",
      link: '/resources/tutorials',
    },
    {
      id: 2,
      image: "/assets/resources/guidelines.png",
      title: "Guidelines",
      subtitle: "Learn More About Election Guidelines in Nigeria according to INEC",
      link: '/resources/guidelines',
    },
    {
      id: 3,
      image: "/assets/resources/support.png",
      title: "Support",
      subtitle: "Reach and contact Citizen Monitors",
      link: '/resources/support',
    },
  ];

  return (
    <LandingLayout>
      <div className="container pb-16">
        <header className="text-display-sm lg:text-display-lg font-league text-center leading-tight tracking-tight font-bold mb-5 mt-3 lg:mt-[55px] lg:mb-10 lg:text-left">
          <h1 className="text-brand-500">YOUR RESOURCE HUB:</h1>{" "}
          <h2 className="leading-[0.94] text-gray-700">
            Find training videos, INEC guidelines and contact support all in one place.
          </h2>
        </header>

        <section className="gap-6 justify-center mb-12 hidden lg:flex">
          {imageCarouselItems.map((item) => (
            <div
              className="isolate w-[500px] rounded-xl overflow-hidden h-[200px] xl:h-[250px] relative text-white hover:scale-[1.01] transition-all hover:cursor-pointer"
              key={item.id}
              onClick={() => {
                router.push(item.link);
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                className="-z-10 absolute top-0 left-0 w-full h-full object-fit-contain"
                width={800}
                height={400}
              />
              <div className="absolute top-0 left-0 w-full h-full p-4 pb-2 flex flex-col justify-between">
                <h3 className="uppercase font-semibold tracking-[20%]">{item.title}</h3>
                <p className="font-league text-display-sm tracking-tight leading-[1.1] font-bold">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </section>

        <ResourceTabs />

        {children}
      </div>
    </LandingLayout>
  );
}
