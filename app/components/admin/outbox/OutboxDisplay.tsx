"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import React, { useEffect, useMemo, useState } from "react";
import { initialOutboxFilterData } from "./data";
import copyObject from "@/app/utils/copyObject";
import moment from "moment";
import AppFilter from "../../shared/AppFilter";
import OutboxTable from "./OutboxTable";

export default function OutboxDisplay() {
  const dispatch = useAppDispatch();
  const outboxState = useAppSelector((state) => state.adminOutbox);
  const { podcasts } = outboxState;
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

      if (filterData.userType.selected !== "all users" && 
          !podcast.recipients.includes(filterData.userType.selected)) {
        return false;
      }

      if (filterData.date.selected !== "all dates" && 
          filterData.date.selected !== year) {
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
      <OutboxTable filteredPodcasts={filteredPodcasts} />
    </section>
  );
} 