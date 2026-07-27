"use client";
import React, { useEffect, useMemo, useState } from "react";
import UploadsTable from "./UploadsTable";
import { useAppSelector } from "@/app/hooks/redux";
import copyObject from "@/app/utils/copyObject";
import { initialUploadsFilterData } from "./data";
import AppFilter from "../../shared/AppFilter";
import formatString from "@/app/utils/formatString";
import moment from "moment";
import AppExport from "../../shared/AppExport";
import { AdminElectionUpload } from "@/app/redux/types";
import sortByCreatedAtAsc from "@/app/utils/sortByCreatedAtAsc";

export default function UploadsDisplay() {
  const uploadState = useAppSelector((state) => state.adminUpload);
  const { uploads } = uploadState;
  const [filterData, setFilterData] = useState(copyObject(initialUploadsFilterData));
  useEffect(() => {
    const filters = copyObject(initialUploadsFilterData);
    // populating the filters
    uploads.forEach((upload) => {
      const election = formatString.kebabToNormalCase(upload.election);
      const state = formatString.normalCase(upload.state) + " State";
      const year = moment(upload.createdAt).format("YYYY");

      if (!filters.election.options.includes(election)) {
        filters.election.options.push(election);
      }
      if (!filters.state.options.includes(state)) {
        filters.state.options.push(state);
      }
      if (!filters.date.options.includes(year)) {
        filters.date.options.push(year);
      }
      if (!filters.verification.options.includes(upload.role)) {
        filters.verification.options.push(upload.role);
      }
      if (!filters.uploadType.options.includes(upload.resultUploaded)) {
        filters.uploadType.options.push(upload.resultUploaded);
      }
    });
    setFilterData(filters);
  }, [uploads]);

  const filteredUploads = useMemo(() => {
    return sortByCreatedAtAsc(
      uploads.filter((upload) => {
        const election = formatString.kebabToNormalCase(upload.election);
        const state = formatString.normalCase(upload.state) + " State";
        const year = moment(upload.createdAt).format("YYYY");

        if (
          filterData.election.selected !== "all elections" &&
          filterData.election.selected !== election
        )
          return false;

        if (
          filterData.state.selected !== "all states" &&
          filterData.state.selected !== state
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
          filterData.verification.selected !== "all verifications" &&
          filterData.verification.selected !== upload.role
        )
          return false;

        return true;
      })
    );
  }, [uploads, filterData]);

  const exportHeaderKeyMap: Record<string, keyof AdminElectionUpload> = {
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
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-4 items-center justify-between flex-wrap mb-4">
        <AppFilter filterData={filterData} setFilterData={setFilterData} />
        <AppExport
          filename="Export (Uploads)"
          data={filteredUploads.map((upload) => ({
            ...upload,
            election: formatString.kebabToNormalCase(upload.election),
            state: formatString.normalCase(upload.state) + " State",
            createdAt: moment(upload.createdAt).format("YYYY-MM-DD"),
            pictures: upload.pictures?.map((picture) => picture.url).join(", "),
            videos: upload.videos?.map((video) => video.url).join(", "),
          }))}
          headerKeyMap={exportHeaderKeyMap}
        />
      </div>

      <UploadsTable filteredUploads={filteredUploads} />
    </div>
  );
}
