import { UserRole } from "@/app/redux/types";
import formatString from "@/app/utils/formatString";
import React from "react";

export default function RoleTag({
  role,
  options,
}: {
  role: UserRole;
  options?: { pendingObserverVerification?: boolean };
}) {
  return (
    <div className="w-fit">
      {
        {
          'super-admin': (
            <span className="py-1 px-2 text-xs font-medium bg-brand-50 rounded-full text-brand-600">
              {formatString.kebabToNormalCase(role)}
            </span>
          ),
          admin: (
            <span className="py-1 px-2 text-xs font-medium bg-gray-200 rounded-full text-gray-600">
              {formatString.normalCase(role)}
            </span>
          ),
          observer: (
            <span className="py-1 px-2 text-xs font-medium bg-blue-100 rounded-full text-blue-600 whitespace-nowrap">
              {options?.pendingObserverVerification
                ? "Pending Observer"
                : formatString.normalCase(role)}
            </span>
          ),
          volunteer: (
            <span className="py-1 px-2 text-xs font-medium bg-warning-100 rounded-full text-warning-500">
              {formatString.normalCase(role)}
            </span>
          ),
        }[role]
      }
    </div>
  );
}
