import { Calendar, DocumentText1, DocumentUpload, Edit2, HomeHashtag, Icon, Note, Notepad2, Setting, SliderVertical1 } from "iconsax-react";

export type Route = {
  title: string,
  icon: Icon,
  href: string,
  comingSoon?: boolean,
  subRoutes?: Array<{ title: string, icon: Icon, href: string }>
}

const dashboardRoutes: Array<Route> = [
  {
    title: "Home",
    icon: HomeHashtag,
    href: "/portal/dashboard",
  },
  {
    title: "Elections",
    icon: DocumentUpload,
    href: "/portal/elections",
  },
  {
    title: "Records",
    icon: DocumentText1,
    href: "/portal/uploads",
    subRoutes: [
      {
        title: "Result Upload",
        icon: Edit2,
        href: "/portal/uploads/result",
      },
      {
        title: "Report Upload",
        icon: Edit2,
        href: "/portal/uploads/report",
      },
    ]
  },
  {
    title: "Calendar",
    icon: Calendar,
    href: "/portal/calendar",
  },
  {
    title: "",
    icon: HomeHashtag,
    href: "",
  },
  {
    title: "Live",
    icon: SliderVertical1,
    href: "/portal/live",
  },
  {
    title: "Press room",
    icon: Note,
    href: "/portal/press/create",
  },
  {
    title: "Polls & Surveys",
    icon: Notepad2,
    href: "/portal/polls-and-surveys",
    comingSoon: true,
  },
  {
    title: "",
    icon: HomeHashtag,
    href: "",
  },
  {
    title: "Settings",
    icon: Setting,
    href: "/portal/settings",
  },
];


const settingsPath = dashboardRoutes.find((route) => route.title === "Settings")!.href;
const dashboardPaths = {
  settings: settingsPath
}

const settingsRoutes = [
  {
    route: `${settingsPath}/profile`,
    name: "Profile Details",
  },
  {
    route: `${settingsPath}/email`,
    name: "Change Email",
  },
  {
    route: `${settingsPath}/coverage`,
    name: "Coverage Details",
  },
  {
    route: `${settingsPath}/verify`,
    name: "Observer Verification",
  },
  {
    route: `${settingsPath}/notifications`,
    name: "Notifications",
  },
  {
    route: `${settingsPath}/password`,
    name: "Password",
  },
  {
    route: "/privacy-policy",
    name: "Privacy Policy",
  },
  {
    route: "/terms-of-use",
    name: "Terms of Use"
  }
];

export { dashboardRoutes, dashboardPaths, settingsRoutes };