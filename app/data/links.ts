import { StaticImport } from "next/dist/shared/lib/get-img-props";
import LinkedInIcon from "@/public/assets/socials/linkedIn.svg";
import XIcon from "@/public/assets/socials/x.svg";
import YoutubeIcon from "@/public/assets/socials/youtube.svg";
import InstagramIcon from "@/public/assets/socials/instagram.svg";
import LinkedInBrandIcon from "@/public/assets/socials/linkedInBrand.svg";
import XBrandIcon from "@/public/assets/socials/xBrand.svg";
import YoutubeBrandIcon from "@/public/assets/socials/youtubeBrand.svg";
import InstagramBrandIcon from "@/public/assets/socials/instagramBrand.svg";

const email = "info@citizenmonitors.com";

type Social = {
  name: string;
  href: string;
  icon: StaticImport;
  brandIcon: StaticImport;
  color: string;
};

const socials: Array<Social> = [
  {
    name: "Youtube",
    href: "https://www.youtube.com/@citizenmonitors",
    icon: YoutubeIcon,
    brandIcon: YoutubeBrandIcon,
    color: "!bg-[#FF0000]",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/citizenmonitors",
    icon: InstagramIcon,
    brandIcon: InstagramBrandIcon,
    color: "!bg-[#FF005F]",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/citizen-monitors",
    icon: LinkedInIcon,
    brandIcon: LinkedInBrandIcon,
    color: "!bg-[#006192]",
  },
  {
    name: "X",
    href: "https://x.com/citizenmonitors",
    icon: XIcon,
    brandIcon: XBrandIcon,
    color: "!bg-[#1A1A1A]",
  },
];

export { email, socials };
