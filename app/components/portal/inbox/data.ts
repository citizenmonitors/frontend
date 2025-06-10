import { FilterData } from "../../shared/AppFilter";

export const initialOutboxFilterData: FilterData = {
  status: {
    selected: "read-/-unread",
    options: ["read-/-unread", "read", "unread"],
    placeholder: "Status",
  },
  date: {
    selected: "all dates",
    options: ["all dates"],
    placeholder: "Date",
  }
}; 