import { Calendar, CalendarEdit, DocumentUpload, Flag, HomeHashtag, Icon, Messages1, Notepad2, Profile2User, Setting, Task, UserOctagon, Verify, Warning2 } from "iconsax-react";

export type Route = {
  title: string,
  icon: Icon,
  href: string,
  comingSoon?: boolean,
}

const adminRoutes: Array<Route> = [
  {
    title: "Home",
    icon: HomeHashtag,
    href: "/admin/dashboard",
  },
  {
    title: "Elections",
    icon: Notepad2,
    href: "/admin/elections",
  },
  {
    title: "Uploads",
    icon: DocumentUpload,
    href: "/admin/uploads",
  },
  {
    title: "Flagged Uploads",
    icon: Flag,
    href: "/admin/flagged",
  },
  {
    title: "Users",
    icon: Profile2User,
    href: "/admin/users",
  },
  {
    title: "PVC Issues",
    icon: Warning2,
    href: "/admin/pvc-issues",
  },
  {
    title: "Verification",
    icon: Verify,
    href: "/admin/verification",
  },
  {
    title: "Calendar",
    icon: Calendar,
    href: "/admin/calendar",
  },
  {
    title: "Schedule",
    icon: CalendarEdit,
    href: "/admin/schedule",
  },
  {
    title: "Outbox",
    icon: Messages1,
    href: "/admin/outbox",
  },
  {
    title: "Activity Log",
    icon: Task,
    href: "/admin/activity-log",
  },
  {
    title: "Admin(s)",
    icon: UserOctagon,
    href: "/admin/admins",
  },
  {
    title: "",
    icon: HomeHashtag,
    href: "",
  },
  {
    title: "Settings",
    icon: Setting,
    href: "/admin/settings",
  },
];

const settingsPath = adminRoutes.find((route) => route.title === "Settings")!.href;
const dashboardPaths = {
  settings: settingsPath
}

const settingsRoutes = [
  {
    route: `${settingsPath}/profile`,
    name: "Profile Details",
  },
  {
    route: `${settingsPath}/coverage`,
    name: "Coverage Details",
  },
  {
    route: `${settingsPath}/password`,
    name: "Password",
  },
  {
    route: `${settingsPath}/citizen-academy`,
    name: "Citizen Academy",
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

export { adminRoutes, settingsRoutes }