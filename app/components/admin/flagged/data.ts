import { FilterData } from "../../shared/AppFilter";

export const initialFlaggedUploadsFilterData: FilterData = {
  election: {
    selected: "all elections",
    options: ["all elections"],
    placeholder: "Election",
  },
  pollingUnit: {
    selected: "all polling units",
    options: ["all polling units"],
    placeholder: "Polling Unit",
  },
  date: {
    selected: "all dates",
    options: ["all dates"],
    placeholder: "Date",
  },
  uploadType: {
    selected: "all types",
    options: ["all types"],
    placeholder: "Upload Type",
  },
  priority: {
    selected: "all priorities",
    options: ["all priorities"],
    placeholder: "Priority",
  }
};