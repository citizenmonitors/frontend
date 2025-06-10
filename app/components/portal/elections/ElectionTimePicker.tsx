import TimeScrollPicker from "@/app/components/shared/time-scroll-picker/TimeScrollPicker";
import React, { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Add } from "iconsax-react";
import moment from "moment";

export default function ElectionTimePicker({
  onChange,
}: {
  onChange: (time: string) => void;
}) {
  const [value, setValue] = useState("12:00AM");
  return (
    <>
      <div className="h-[1px] w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 hidden lg:block" />
      <div className="block lg:hidden">
        <TimeScrollPicker onChange={onChange} />
      </div>
      <div className="hidden lg:block">
        <TimePicker
          id="election-time-picker"
          format="hh:mma"
          clockIcon={null}
          className="w-full !outline-0 !border-none"
          value={value}
          onChange={(value) => {
            if (value) {
              setValue(value);
              onChange(moment(value, "hh:mm").format("hh:mmA"));
            }
          }}
          disableClock
          clearIcon={
            <button
              className="h-[24px] w-[24px] grid place-content-center"
              onClick={() => {
                setValue("12:00AM");
                onChange(moment("12:00AM", "hh:mm").format("hh:mmA"));
              }}
            >
              <Add className="rotate-45" />
            </button>
          }
        />
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 hidden lg:block" />
    </>
  );
}
