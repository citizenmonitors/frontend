import { Verify } from "iconsax-react";
import { User } from "../redux/types";
import { ReactNode } from "react";

export default function getUserRole(user: Pick<User, "role" | "pendingObserverVerification">) {
  const output = {
    name: "",
    icon: null as null | ReactNode,
  };

  if (user.role === "super-admin") {
    output.name = "Super Admin";
    output.icon = <Verify variant="Bold" className="text-[#05A39C]" />;
  }
  else if (user.role === "admin") {
    output.name = "Admin";
    output.icon = <Verify variant="Bold" className="text-gray-400" />;
  } else if (user.role === "observer") {
    output.name = user.pendingObserverVerification ? "Pending Observer" : "Observer";
    output.icon = user.pendingObserverVerification ? null : (
      <Verify variant="Bold" className="text-[#EAA613]" />
    );
  } else {
    output.name = "Volunteer";
  }

  return output;
}
