import { useAppSelector } from "@/app/hooks/redux";
import { Button, Spin, Tooltip } from "antd";
import { ArrowRight2, Profile } from "iconsax-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function AdminList() {
  const router = useRouter();
  function handleActivityLog() {
    router.push("/admin/activity-log");
  }
  const { graphs, status } = useAppSelector((state) => state.adminAdmin);
  const graphData = graphs.admins;
  const admins = graphData.map((user) => ({
    fullName: user.firstName + " " + user.lastName,
    name: user.firstName,
    email: user.email,
    profilePicture: user.profileImage?.url || null,
  }));

  return (
    <article className="grid col-span-1 rounded-md md:bg-white xl:col-span-2 ring-1 ring-gray-200 bg-gray-25">
      <section className="grid gap-6 p-4 md:p-6 relative">
        <Spin
          className={`absolute top-4 right-5 ${
            status.fetchAdmins === "pending" ? "opacity-100" : "opacity-0"
          } transition-all duration-500`}
        />
        <header className="font-inter font-medium text-gray-700 leading-[1]">
          Admins
        </header>
        <div className="overflow-x-scroll">
          <ul className="flex gap-5 justify-content-center min-h-[92px]">
            {admins.map((admin, index) => (
              <AdminCard key={index} admin={admin} />
            ))}
          </ul>
        </div>
      </section>
      <div className="flex justify-end px-4 py-3 mt-auto border-t border-gray-200 md:px-6 md:py-4 actions">
        <Button
          type="text"
          className="flex items-center gap-1 px-1 text-brand-500"
          onClick={handleActivityLog}
        >
          <span className="text-sm font-medium">Activity Log</span>{" "}
          <ArrowRight2 size={20} />
        </Button>
      </div>
    </article>
  );
}

type AdminCardProps = {
  admin: {
    fullName: string;
    name: string;
    email: string;
    profilePicture: string | null;
  };
};
function AdminCard({ admin }: AdminCardProps) {
  return (
    <li className="flex flex-col items-center gap-2 max-w-[80px]">
      {admin.profilePicture ? (
        <Image
          src={admin.profilePicture}
          alt={admin.name}
          className="w-12 h-12 rounded-full"
          height={48}
          width={48}
        />
      ) : (
        <div className="grid w-12 h-12 text-white rounded-full user-card-profile place-content-center bg-gradient-to-b from-brand-600 to-brand-500">
          <Profile size={20} />
        </div>
      )}
      <div className="w-full">
        <Tooltip title={admin.fullName}>
          <h3 className="text-xs font-medium text-center text-gray-700 truncate">
            {admin.name}
          </h3>
        </Tooltip>
        <Tooltip title={admin.email}>
          <p className="text-xs text-gray-500 truncate">{admin.email}</p>
        </Tooltip>
      </div>
    </li>
  );
}
