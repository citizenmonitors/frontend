"use client";

import { getPvcIssueLabel } from "@/app/data/pvcIssues";
import { useAppSelector } from "@/app/hooks/redux";
import { AdminTablePvcIssue } from "@/app/redux/admin-features/pvcIssuesSlice";
import copyObject from "@/app/utils/copyObject";
import formatString from "@/app/utils/formatString";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import AppExport from "../../shared/AppExport";
import AppFilter from "../../shared/AppFilter";
import { initialPvcIssuesFilterData } from "./data";
import PvcIssuesTable from "./PvcIssuesTable";
import sortByCreatedAtAsc from "@/app/utils/sortByCreatedAtAsc";

export default function PvcIssuesDisplay() {
  const pvcIssuesState = useAppSelector((state) => state.adminPvcIssues);
  const { reports } = pvcIssuesState;
  const [filterData, setFilterData] = useState(copyObject(initialPvcIssuesFilterData));

  useEffect(() => {
    const filters = copyObject(initialPvcIssuesFilterData);

    reports.forEach((report) => {
      const state = formatString.normalCase(report.state) + " State";
      const lga = formatString.normalCase(report.lga);
      const issueType = getPvcIssueLabel(report.issueType);
      const year = moment(report.createdAt).format("YYYY");

      if (!filters.state.options.includes(state)) {
        filters.state.options.push(state);
      }
      if (!filters.lga.options.includes(lga)) {
        filters.lga.options.push(lga);
      }
      if (!filters.issueType.options.includes(issueType)) {
        filters.issueType.options.push(issueType);
      }
      if (!filters.date.options.includes(year)) {
        filters.date.options.push(year);
      }
    });

    setFilterData(filters);
  }, [reports]);

  const filteredReports = useMemo(() => {
    return sortByCreatedAtAsc(
      reports.filter((report) => {
        const state = formatString.normalCase(report.state) + " State";
        const lga = formatString.normalCase(report.lga);
        const issueType = getPvcIssueLabel(report.issueType);
        const year = moment(report.createdAt).format("YYYY");

        if (
          filterData.state.selected !== "all states" &&
          filterData.state.selected !== state
        ) {
          return false;
        }

        if (filterData.lga.selected !== "all lgas" && filterData.lga.selected !== lga) {
          return false;
        }

        if (
          filterData.issueType.selected !== "all issue types" &&
          filterData.issueType.selected !== issueType
        ) {
          return false;
        }

        if (filterData.date.selected !== "all dates" && filterData.date.selected !== year) {
          return false;
        }

        return true;
      })
    );
  }, [reports, filterData]);

  const exportHeaderKeyMap: Record<string, keyof AdminTablePvcIssue | "issueTypeLabel"> = {
    ["Full Name"]: "fullName",
    ["Phone Number"]: "phoneNumber",
    ["Email"]: "email",
    ["State"]: "state",
    ["LGA"]: "lga",
    ["Polling Unit"]: "pollingUnit",
    ["Issue Type"]: "issueTypeLabel",
    ["Submitted On"]: "createdAt",
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <AppFilter filterData={filterData} setFilterData={setFilterData} />
        <AppExport
          filename="Export (PVC Issues)"
          data={filteredReports.map((report) => ({
            ...report,
            state: formatString.normalCase(report.state) + " State",
            lga: formatString.normalCase(report.lga),
            issueTypeLabel: getPvcIssueLabel(report.issueType),
            createdAt: moment(report.createdAt).format("YYYY-MM-DD"),
            email: report.email || "",
          }))}
          headerKeyMap={exportHeaderKeyMap}
        />
      </div>
      <PvcIssuesTable filteredReports={filteredReports} />
    </div>
  );
}
