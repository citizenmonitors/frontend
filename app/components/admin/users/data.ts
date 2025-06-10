import { FilterData } from "../../shared/AppFilter";

export const initialUploadsFilterData: FilterData = {
  verification: {
    selected: "all verifications",
    options: ["all verifications"],
    placeholder: "Verification",
  },
  date: {
    selected: "all dates",
    options: ["all dates"],
    placeholder: "Registration Date",
  },
  state: {
    selected: "all states",
    options: ["all states"],
    placeholder: "State",
  },
  gender: {
    selected: "all genders",
    options: ["all genders"],
    placeholder: "Gender",
  },
};