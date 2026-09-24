import { topLinks } from "@/app/data/navigation";
import { Button } from "antd";
import Link from "next/link";
import React from "react";
function TopNavigation() {
  return (
    <div id="home" className="top-nav-container hidden md:grid-center">
      <nav className="top-nav container pt-6 pb-5 flex justify-between items-center border-b border-gray-200">
        <ul className="flex gap-8 items-center ml-auto">
          {topLinks.map((link) => (
            <li key={link.name}>
              <Link
                className="text-sm text-gray-400 hover:text-gray-500 transition-colors"
                href={link.href}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default TopNavigation;
