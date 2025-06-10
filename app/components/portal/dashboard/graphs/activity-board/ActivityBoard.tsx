import React from "react";
import ActivityBoardData from "./ActivityBoardData";
import ActivityNotifications from "./ActivityNotifications";

export default function ActivityBoard() {
  return (
    <section className="grid grid-cols-12 gap-5 bg-white rounded">
      <div className="col-span-12 lg:col-span-6 xl:col-span-7">
        <ActivityBoardData />
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-5">
        <ActivityNotifications />
      </div>
    </section>
  );
}
