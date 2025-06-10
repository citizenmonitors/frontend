import { Route } from "@/app/data/portal";
import Link from "next/link";

export default function SideBarLinkDesktop({
  link,
  pathName,
}: {
  link: Route;
  pathName: string;
}) {
  const isActive = pathName.startsWith(link.href);
  // Find the sub-route that matches the current pathName, if any
  // If no sub-route matches, use the main link as the priority
  // This is useful for links that have sub-routes, like "Records" with "Result Upload" and "Report Upload"
  const priorityLink = link.subRoutes?.find((subRoute) => pathName.startsWith(subRoute.href))
    || link;

  return (
    <li className="relative">
      <span
        className={`absolute right-0 top-0 -translate-y-1/4 bg-brand-50 border border-brand-500 rounded-full p-1 text-[8px] font-medium text-brand-500`}
        style={!link.comingSoon ? { display: "none" } : {}}
      >
        Coming soon
      </span>
      <Link
        href={link.href}
        className={`
          flex items-center gap-[10px] border-[0.5px] transition-all
          p-3 rounded-md
          ${
            link.comingSoon
              ? "text-gray-300 border-white/0 pointer-events-none"
              : isActive
              ? "text-brand-500 bg-brand-25 border-brand-500"
              : "text-gray-500 bg-white/0 border-white/0 hover:bg-gray-100 hover:text-gray-700"
          }
        `}
      >
        <priorityLink.icon
          variant={priorityLink.title === "Live" ? "Bold" : "Linear"}
          className={priorityLink.title === "Live" ? "!text-error-500" : ""}
        />
        <span>{priorityLink.title}</span>
      </Link>
    </li>
  );
}
