import { FilterData } from "../../shared/AppFilter";

export const initialUploadsFilterData: FilterData = {
  election: {
    selected: "all elections",
    options: ["all elections"],
    placeholder: "Election",
  },
  state: {
    selected: "all states",
    options: ["all states"],
    placeholder: "State",
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
  verification: {
    selected: "all verifications",
    options: ["all verifications"],
    placeholder: "Verification",
  }
};