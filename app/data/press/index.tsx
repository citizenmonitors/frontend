import Press1 from "./articles/rivers-01";
import Press2 from "./articles/edo-01";
import Press3 from "./articles/benue-01";
import { Press } from "./types";

const press: Array<Press> = [
  Press1,
  Press2,
  Press3,
];

const currentPress = press.filter((p) => new Date(p.date) <= new Date());
 
export default currentPress;
