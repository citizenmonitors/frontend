"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import React, { useEffect, useMemo, useState } from "react";
import { initialOutboxFilterData } from "./data";
import copyObject from "@/app/utils/copyObject";
import formatString from "@/app/utils/formatString";
import moment from "moment";
import AppFilter from "../../shared/AppFilter";
import InboxTable from "./InboxTable";
import { Spin } from "antd";

export default function InboxDisplay() {
  const dispatch = useAppDispatch();
  const inboxState = useAppSelector((state) => state.inbox);
  const { podcasts, status } = inboxState;
  const [filterData, setFilterData] = useState(copyObject(initialOutboxFilterData));

  // Update filter options based on available data
  useEffect(() => {
    const filters = copyObject(initialOutboxFilterData);
    // Populating the filters
    podcasts.forEach((podcast) => {
      const year = moment(podcast.createdAt).format("YYYY");
      if (!filters.date.options.includes(year)) {
        filters.date.options.push(year);
      }
    });
    setFilterData(filters);
  }, [podcasts]);

  // Filter podcasts based on selected filters
  const filteredPodcasts = useMemo(() => {
    return podcasts.filter((podcast) => {
      const year = moment(podcast.createdAt).format("YYYY");
      const read = !!podcast.read;

      if (
        filterData.status.selected !== "read-/-unread" &&
        read !== (filterData.status.selected === "read")
      ) {
        return false;
      }

      if (filterData.date.selected !== "all dates" && filterData.date.selected !== year) {
        return false;
      }

      return true;
    });
  }, [podcasts, filterData]);

  return (
    <section>
      <div className="mb-6">
        <AppFilter filterData={filterData} setFilterData={setFilterData} />
      </div>
      {status.getPodcasts !== "fulfilled" ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <InboxTable filteredPodcasts={filteredPodcasts} />
      )}
    </section>
  );
}
