import { FilterData } from "../../shared/AppFilter";

export const initialPollingUnitUploadsFilterData: FilterData = {
  uploadType: {
    selected: "all types",
    options: ["all types", "reports", "results"],
    placeholder: "Upload Type",
  },
  electionYear: {
    selected: "all years",
    options: ["all years"],
    placeholder: "Election Year",
  },
};