import { FilterData } from "../../shared/AppFilter";

export const initialOutboxFilterData: FilterData = {
  userType: {
    selected: "all users",
    options: ["all users", "observer", "volunteer", "admin", "super-admin"],
    placeholder: "User Type",
  },
  date: {
    selected: "all dates",
    options: ["all dates"],
    placeholder: "Date",
  }
}; 