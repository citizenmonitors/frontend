import { FilterData } from "../../shared/AppFilter";

export const initialVerificationFilterData: FilterData = {
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