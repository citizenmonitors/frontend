import { AdminPodcast } from "@/app/redux/types";
import formatString from "@/app/utils/formatString";
import { Collapse, Empty, Button, Pagination } from "antd";
import { ArrowDown2, ArrowLeft, ArrowRight } from "iconsax-react";
import moment from "moment";
import React, { useState } from "react";

type OutboxTableProps = {
  filteredPodcasts: AdminPodcast[];
};

export default function OutboxTable({ filteredPodcasts }: OutboxTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Get current page items
  const indexOfLastItem = currentPage * PAGE_SIZE;
  const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
  const currentPodcasts = filteredPodcasts.slice(indexOfFirstItem, indexOfLastItem);

  const items = currentPodcasts.map((podcast) => ({
    key: podcast._id,
    label: (
      <div className="flex items-center justify-between">
        <h3 className="text-base">{podcast.title}</h3>
        <span className="text-sm text-gray-600">
          {moment(podcast.createdAt).format("MMM DD")}
        </span>
      </div>
    ),
    children: (
      <div className="pl-14 px-10">
        <div className="mb-2 text-gray-500 text-base">{podcast.content}</div>
        <p className="text-sm text-gray-700">
          Sent to: <span className="text-brand-600">{podcast.recipients.map(r => formatString.kebabToNormalCase(r)).join(", ")}</span>
        </p>
      </div>
    ),
  }));

  if (filteredPodcasts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No broadcasts available."
        />
      </div>
    );
  }

  return (
    <div className="ring-1 ring-gray-200 rounded-lg overflow-hidden bg-white">
      <Collapse
      size="large"
        bordered={false}
        items={items}
        
        expandIcon={({ isActive }) => (
          <ArrowDown2
            size={20}
            className={`transition-transform ${!isActive ? '-rotate-90' : ''}`}
          />
        )}
      />
      {filteredPodcasts.length > PAGE_SIZE && (
        <div className="flex justify-center border-t border-gray-200 py-4">
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={filteredPodcasts.length}
            pageSize={PAGE_SIZE}
            showSizeChanger={false}
            hideOnSinglePage={true}
            nextIcon={
              <Button
                type="text"
                className="text-gray-700 font-semibold flex gap-2 items-center ring-gray-300 ring-1"
              >
                Next <ArrowRight size={16} />
              </Button>
            }
            prevIcon={
              <Button
                type="text"
                className="text-gray-700 font-semibold flex gap-2 items-center ring-gray-300 ring-1"
              >
                <ArrowLeft size={16} /> Prev
              </Button>
            }
            className="px-4"
          />
        </div>
      )}
    </div>
  );
} 