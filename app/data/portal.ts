import { Calendar, DocumentText1, DocumentUpload, Edit2, HomeHashtag, Icon, Microphone2, Notepad2, Setting, SliderVertical1 } from "iconsax-react";
import { UserRole } from "../redux/types";

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
    title: "Pulse",
    icon: Microphone2,
    href: "/portal/pulse",
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

export type SettingsRouteItem = {
  route: string;
  name: string;
  onlyRoles?: UserRole[];
  excludeRoles?: UserRole[];
  section?: "main" | "footer";
};

const settingsRoutes: SettingsRouteItem[] = [
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
    excludeRoles: ["public-viewer"],
  },
  {
    route: `${settingsPath}/upgrade-volunteer`,
    name: "Upgrade to Volunteer",
    onlyRoles: ["public-viewer"],
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
    route: `${settingsPath}/polling-unit-locator`,
    name: "Polling Unit Locator",
  },
  {
    route: `${settingsPath}/feedback`,
    name: "Give Feedback",
  },
  {
    route: `${settingsPath}/citizen-academy`,
    name: "Citizen Academy",
    section: "footer",
  },
  {
    route: "/privacy-policy",
    name: "Privacy Policy",
    section: "footer",
  },
  {
    route: "/terms-of-use",
    name: "Terms of Use",
    section: "footer",
  },
];

function isSettingsRouteVisible(route: SettingsRouteItem, role: UserRole) {
  if (route.onlyRoles && !route.onlyRoles.includes(role)) return false;
  if (route.excludeRoles?.includes(role)) return false;
  return true;
}

function getSettingsRoutes(role: UserRole) {
  return settingsRoutes.filter((route) => isSettingsRouteVisible(route, role));
}

function getSettingsMainRoutes(role: UserRole) {
  return getSettingsRoutes(role).filter((route) => route.section !== "footer");
}

function getSettingsFooterRoutes(role: UserRole) {
  return getSettingsRoutes(role).filter((route) => route.section === "footer");
}

export {
  dashboardRoutes,
  dashboardPaths,
  settingsRoutes,
  getSettingsRoutes,
  getSettingsMainRoutes,
  getSettingsFooterRoutes,
};