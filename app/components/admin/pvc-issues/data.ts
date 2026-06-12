import { FilterData } from "../../shared/AppFilter";

export const initialPvcIssuesFilterData: FilterData = {
  state: {
    selected: "all states",
    options: ["all states"],
    placeholder: "State",
  },
  lga: {
    selected: "all lgas",
    options: ["all lgas"],
    placeholder: "LGA",
  },
  issueType: {
    selected: "all issue types",
    options: ["all issue types"],
    placeholder: "Issue Type",
  },
  date: {
    selected: "all dates",
    options: ["all dates"],
    placeholder: "Submission Date",
  },
};
