import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Picker from "./Picker";
import formatNumber from "@/app/utils/formatNumber";

const optionGroups = {
  hours: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => ({
    value: formatNumber.prependZeroes(i, 2),
    label: formatNumber.prependZeroes(i, 2),
  })),
  minutes: Array.from({ length: 60 }, (_, i) => ({
    value: formatNumber.prependZeroes(i, 2),
    label: formatNumber.prependZeroes(i, 2),
  })),
  ampm: [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ],
};

type TimeScrollPickerProps = {
  onChange: (value: string) => void;
};

export default function TimeScrollPicker({ onChange }: TimeScrollPickerProps) {
  const timeScrollContainerRef = useRef<HTMLDivElement>(null);
  const [valueGroups, setValueGroups] = useState({
    hours: formatNumber.prependZeroes(moment().hour() % 12, 2),
    minutes: formatNumber.prependZeroes(moment().minute(), 2),
    ampm: moment().hour() > 11 ? "PM" : "AM",
  });
  const [pageLoaded, setPageLoaded] = useState(false);

  function handleChange(name: string, value: string) {
    setValueGroups((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    const time = `${valueGroups.hours}:${valueGroups.minutes}${valueGroups.ampm}`;
    onChange(time);
  }, [valueGroups]);

  // prevent scrolling on mobile
  function handleMove(e: TouchEvent) {
    e.preventDefault();
  }

  useEffect(() => {
    setPageLoaded(true);
    // reset time
    setValueGroups({
      hours: formatNumber.prependZeroes(moment().hour() % 12, 2),
      minutes: formatNumber.prependZeroes(moment().minute(), 2),
      ampm: moment().hour() > 11 ? "PM" : "AM",
    });

    timeScrollContainerRef.current?.addEventListener("touchstart", () => {
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.getElementById("portal-content")!.style.overflow = "hidden";
    });
    timeScrollContainerRef.current?.addEventListener("touchend", () => {
      document.removeEventListener("touchmove", handleMove);
      document.getElementById("portal-content")!.style.overflow = "auto";
    });
    return () => {
      setPageLoaded(false);
      document.removeEventListener("touchmove", handleMove);
      document.getElementById("portal-content")!.style.overflow = "auto";
    };
  }, []);

  return (
    <div id="time-scroll-picker" ref={timeScrollContainerRef}>
      {pageLoaded && (
        <Picker
          optionGroups={optionGroups}
          valueGroups={valueGroups}
          onChange={handleChange}
          height={150}
          itemHeight={50}
        />
      )}
    </div>
  );
}
