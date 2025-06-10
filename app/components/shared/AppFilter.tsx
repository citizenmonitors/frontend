import copyObject from "@/app/utils/copyObject";
import formatString from "@/app/utils/formatString";
import { Button, Select } from "antd";
import { Filter, Refresh2 } from "iconsax-react";
import React, { Dispatch, SetStateAction } from "react";

export type FilterData = Record<
  string,
  {
    selected: string;
    options: string[];
    placeholder: string;
  }
>;

export default function AppFilter({
  filterData,
  setFilterData,
}: {
  filterData: FilterData;
  setFilterData: Dispatch<SetStateAction<FilterData>>;
}) {
  function resetFilter() {
    const newFilterData: any = copyObject(filterData);
    Object.keys(newFilterData).forEach((key) => {
      newFilterData[key].selected = newFilterData[key].options[0];
    });
    setFilterData(newFilterData);
  }

  return (
    <div
      id="upload-filters"
      className="flex flex-col md:flex-row ring-1 md:bg-white ring-gray-200 rounded-lg text-gray-500 md:w-fit overflow-hidden bg-gray-25"
    >
      <div className="border-b md:border-r md:border-b-0 border-gray-200 flex text-sm">
        <div className="py-3 px-4 flex items-center gap-3 justify-center flex-1">
          <Filter size={20} /> Filter By
        </div>
        <Button
          className="!text-error-500 hover:!bg-error-50 flex items-center h-[45px] rounded-none justify-center border-y-0 border-r-0 border-l border-gray-200 md:hidden"
          type="text"
          icon={<Refresh2 size={16} />}
          onClick={resetFilter}
        >
          Reset
        </Button>
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
                label: formatString.kebabToNormalCase(option),
                value: option,
              }))}
              onChange={(selectedValue) =>
                setFilterData({
                  ...filterData,
                  [key]: { ...value, selected: selectedValue },
                })
              }
              variant="borderless"
              rootClassName="!min-w-[100px] w-full"
              popupClassName="!min-w-[200px]"
              placeholder={value.placeholder}
            />
          </div>
        );
      })}
      <Button
        className="!text-error-500 hover:!bg-error-50 items-center h-[45px] rounded-none justify-center hidden md:flex"
        type="text"
        icon={<Refresh2 size={16} />}
        onClick={resetFilter}
      >
        Reset Filter
      </Button>
    </div>
  );
}
