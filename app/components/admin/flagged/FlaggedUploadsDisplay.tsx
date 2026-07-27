"use client";
import { useAppSelector } from "@/app/hooks/redux";
import copyObject from "@/app/utils/copyObject";
import React, { useEffect, useMemo, useState } from "react";
import { initialFlaggedUploadsFilterData } from "./data";
import formatString from "@/app/utils/formatString";
import moment from "moment";
import { AdminFlaggedUpload } from "@/app/redux/types";
import AppFilter from "../../shared/AppFilter";
import AppExport from "../../shared/AppExport";
import FlaggedUploadsTable from "./FlaggedUploadsTable";
import sortByCreatedAtAsc from "@/app/utils/sortByCreatedAtAsc";

export default function FlaggedUploadsDisplay() {
  const flaggedUploadState = useAppSelector((state) => state.adminFlaggedUpload);
  const { uploads } = flaggedUploadState;
  const [filterData, setFilterData] = useState(
    copyObject(initialFlaggedUploadsFilterData)
  );

  useEffect(() => {
    const filters = copyObject(initialFlaggedUploadsFilterData);
    // populating the filters
    uploads.forEach((upload) => {
      const election = formatString.kebabToNormalCase(upload.election);
      const pollingUnit = formatString.kebabToNormalCase(upload.pollingUnit);
      const year = moment(upload.createdAt).format("YYYY");
      const priority = upload.hidden ? "High" : "Low";

      if (!filters.election.options.includes(election)) {
        filters.election.options.push(election);
      }
      if (!filters.pollingUnit.options.includes(pollingUnit)) {
        filters.pollingUnit.options.push(pollingUnit);
      }
      if (!filters.date.options.includes(year)) {
        filters.date.options.push(year);
      }
      if (!filters.uploadType.options.includes(upload.resultUploaded)) {
        filters.uploadType.options.push(upload.resultUploaded);
      }
      if (!filters.priority.options.includes(priority)) {
        filters.priority.options.push(priority);
      }
    });
    setFilterData(filters);
  }, [uploads]);

  const filteredUploads = useMemo(() => {
    return sortByCreatedAtAsc(
      uploads.filter((upload) => {
        const election = formatString.kebabToNormalCase(upload.election);
        const pollingUnit = formatString.kebabToNormalCase(upload.pollingUnit);
        const year = moment(upload.createdAt).format("YYYY");
        const priority = upload.hidden ? "High" : "Low";

        if (
          filterData.election.selected !== "all elections" &&
          filterData.election.selected !== election
        )
          return false;

        if (
          filterData.pollingUnit.selected !== "all polling units" &&
          filterData.pollingUnit.selected !== pollingUnit
        )
          return false;

        if (filterData.date.selected !== "all dates" && filterData.date.selected !== year)
          return false;

        if (
          filterData.uploadType.selected !== "all types" &&
          filterData.uploadType.selected !== upload.resultUploaded
        )
          return false;

        if (
          filterData.priority.selected !== "all priorities" &&
          filterData.priority.selected !== priority
        )
          return false;

        return true;
      })
    );
  }, [uploads, filterData]);

  const exportHeaderKeyMap: Record<string, keyof AdminFlaggedUpload> = {
    ["First Name"]: "firstName",
    ["Last Name"]: "lastName",
    ["Email"]: "email",
    ["Uploader Verification"]: "role",
    ["State"]: "state",
    ["Election"]: "election",
    ["Uploaded On"]: "createdAt",
    ["Type"]: "resultUploaded",
    ["Image Links"]: "pictures",
    ["Video Links"]: "videos",
    ["Priority"]: "hidden",
    ["Priority Level (%)"]: "priorityLevel",
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-4 items-center justify-between flex-wrap mb-4">
        <AppFilter filterData={filterData} setFilterData={setFilterData} />
        <AppExport
          filename="Export (Flagged Uploads)"
          data={filteredUploads.map((upload) => ({
            ...upload,
            election: formatString.kebabToNormalCase(upload.election),
            state: formatString.normalCase(upload.state) + " State",
            createdAt: moment(upload.createdAt).format("YYYY-MM-DD"),
            pictures: upload.pictures?.map((picture) => picture.url).join(", "),
            videos: upload.videos?.map((video) => video.url).join(", "),
            hidden: upload.hidden ? "High" : "Low",
          }))}
          headerKeyMap={exportHeaderKeyMap}
        />
      </div>

      <FlaggedUploadsTable filteredUploads={filteredUploads} />
    </div>
  );
}
