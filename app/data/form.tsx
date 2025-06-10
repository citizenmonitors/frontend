import React from "react";
import { BinaryOption, RatingOption } from "../redux/types";

export const binarySelectOptions: Array<{
  value: BinaryOption;
  label: string;
}> = [
  {
    value: "yes",
    label: "Yes",
  },
  {
    value: "no",
    label: "No",
  },
];

export const ratingSelectOptions: Array<{
  value: RatingOption;
  label: React.ReactElement;
}> = [
  {
    value: "good",
    label: (
      <div className="flex gap-2 items-center">
        <span className="h-2 w-2 rounded-full bg-brand-500" />
        <span className="">Good</span>
      </div>
    ),
  },
  {
    value: "okay",
    label: (
      <div className="flex gap-2 items-center">
        <span className="h-2 w-2 rounded-full bg-bluegray-500" />
        <span className="">Okay</span>
      </div>
    ),
  },
  {
    value: "poor",
    label: (
      <div className="flex gap-2 items-center">
        <span className="h-2 w-2 rounded-full bg-error-500" />
        <span className="">Poor</span>
      </div>
    ),
  },
];

export const electionIncidentTypes = [
  "Thuggery and Violence",
  "Lack of electoral materials",
  "Fraudulent electoral officers",
  "Late commencement",
  "Over voting",
  "Other",
];

export const electionIncidentOptions = electionIncidentTypes.map((option) => ({
  value: option,
  label: option,
}));
