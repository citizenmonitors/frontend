import Press1 from "./articles/rivers-01";
import Press2 from "./articles/edo-01";
import Press3 from "./articles/benue-01";
import Press4 from "./articles/mock-01";
import Press5 from "./articles/inec-01";

import { Press } from "./types";

const press: Array<Press> = [Press5, Press4, Press3, Press2, Press1];

export const currentPress = press.filter(
  (p) => new Date(p.date).getUTCDate() <= new Date().getUTCDate()
);

export default press;
