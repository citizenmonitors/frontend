import { useAppSelector } from "@/app/hooks/redux";
import copyObject from "@/app/utils/copyObject";
import formatString from "@/app/utils/formatString";
import { Button, Dropdown, Select, Table, TableColumnsType } from "antd";
import { ArrowLeft, ArrowRight, Eye, Filter, MessageEdit, Refresh2 } from "iconsax-react";
import DotsVertical from "@/public/assets/dots-vertical.svg";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import getElectionName from "@/app/utils/getElectionName";
import sortByCreatedAtAsc from "@/app/utils/sortByCreatedAtAsc";

const initialFilterData = {
  uploadType: {
    selected: "all types",
    options: ["all types", "reports", "results"],
  },
  state: {
    selected: "all states",
    options: ["all states"],
  },
};

export default function UploadsTable() {
  const router = useRouter();
  const electionState = useAppSelector((state) => state.election);
  const uploads = electionState.uploads;
  const [filterData, setFilterData] = useState(copyObject(initialFilterData));

  const filteredUploads = useMemo(() => {
    const { reports, results } = uploads;
    const allUploads = [...reports, ...results];

    return sortByCreatedAtAsc(
      allUploads.filter((upload: any) => {
        if (filterData.uploadType.selected === "reports" && upload.partiesVotes) {
          return false;
        }
        if (filterData.uploadType.selected === "results" && !upload.partiesVotes) {
          return false;
        }

        if (
          filterData.state.selected !== "all states" &&
          upload.state.toLowerCase() !== filterData.state.selected.toLowerCase()
        ) {
          return false;
        }

        return true;
      })
    );
  }, [uploads, filterData]);

  useEffect(() => {
    const filters = copyObject(initialFilterData);
    const allUploads = [...uploads.reports, ...uploads.results];
    allUploads.forEach((upload) => {
      if (!filters.state.options.includes(upload.state)) {
        filters.state.options.push(upload.state);
      }
    });
    setFilterData(filters);
  }, [uploads]);

  function resetFilter() {
    const newFilterData: any = copyObject(filterData);
    Object.keys(newFilterData).forEach((key) => {
      newFilterData[key].selected = newFilterData[key].options[0];
    });
    setFilterData(newFilterData);
  }

  type DataType = {
    key: React.Key;
    election: string;
    time: string;
    type: string;
  };

  // table code
  const columns: TableColumnsType<DataType> = [
    {
      title: "Election",
      dataIndex: "election",
      key: 1,

      sorter: (a: any, b: any) => (a.election > b.election ? 1 : -1),
    },
    {
      title: "Uploaded",
      dataIndex: "time",
      key: 2,

      responsive: ["md"],
      sorter: (a: any, b: any) => (a.time > b.time ? 1 : -1),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: 3,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: 4,
      width: "80px",
      align: "center",
    },
  ];

  const dataSource = filteredUploads.map((upload) => ({
    key: upload._id,
    election: getElectionName(upload.election),
    time: moment(upload.updatedAt || Date.now()).format("DD/MM/YYYY hh:mmA"),
    type: (upload as any).partiesVotes ? "Election Result" : "Incident Report",
    actions: (
      <div onClick={(e) => e.stopPropagation()}>
        <Dropdown
          menu={{
            items: [
              {
                label: "View",
                key: "1",
                icon: <Eye size={18} />,
                className: "w-32",
                onClick: () => {
                  const uploadType = (upload as any).partiesVotes ? "result" : "report";
                  router.push(`/portal/uploads/${uploadType}/${upload.election._id}`);
                },
              },
              {
                label: "Edit",
                key: "2",
                icon: <MessageEdit size={18} />,
                className: "w-32",
                onClick: () => {
                  const uploadType = (upload as any).partiesVotes ? "result" : "report";
                  router.push(
                    `/portal/uploads/${uploadType}/${upload.election._id}?mode=edit`
                  );
                },
              },
            ],
          }}
          placement="bottomRight"
        >
          <Button type="text" className="px-1">
            <Image src={DotsVertical} alt="menu toggle" />
          </Button>
        </Dropdown>
      </div>
    ),
  }));

  return (
    <section>
      <div
        id="upload-filters"
        className="flex flex-col md:flex-row ring-1 md:bg-white ring-gray-200 rounded-lg text-gray-500 md:w-fit overflow-hidden mb-4 bg-gray-25"
      >
        <div className="border-b md:border-r md:border-b-0 border-gray-200 py-3 px-4 flex items-center text-sm gap-3 justify-center">
          <Filter size={20} /> Filter By
        </div>
        {Object.entries(filterData).map(([key, value]) => {
          return (
            <div
              className="grid place-items-center border-b md:border-r md:border-b-0 border-gray-200"
              key={key}
            >
              <Select
                key={key}
                value={value.selected}
                options={value.options.map((option) => ({
                  label: formatString.normalCase(option),
                  value: option,
                }))}
                onChange={(selectedValue) =>
                  setFilterData({
                    ...filterData,
                    [key]: { ...value, selected: selectedValue },
                  })
                }
                variant="borderless"
                rootClassName="min-w-[100px]  w-full"
              />
            </div>
          );
        })}
        <Button
          className="!text-error-500 hover:!bg-error-50 flex items-center h-[45px] rounded-none justify-center"
          type="text"
          icon={<Refresh2 size={16} />}
          onClick={resetFilter}
        >
          Reset Filter
        </Button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowClassName={"text-gray-500 hover:cursor-auto"}
        loading={
          electionState.status.fetchUploads === "pending" ||
          electionState.status.deleteElectionReport === "pending" ||
          electionState.status.deleteElectionResult === "pending"
        }
        className="bg-white ring-1 rounded-lg overflow-hidden ring-gray-300"
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          hideOnSinglePage: true,
          nextIcon: (
            <Button
              type="text"
              className="text-gray-700 font-semibold flex gap-2 items-center ring-gray-300 ring-1"
            >
              Next <ArrowRight size={16} />
            </Button>
          ),
          position: ["bottomCenter"],
          prevIcon: (
            <Button
              type="text"
              className="text-gray-700 font-semibold flex gap-2 items-center ring-gray-300 ring-1"
            >
              <ArrowLeft size={16} /> Prev
            </Button>
          ),
          className: "px-4",
        }}
      />
    </section>
  );
}
