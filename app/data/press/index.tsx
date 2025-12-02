import Press1 from "./articles/rivers-01";
import Press2 from "./articles/edo-01";
import Press3 from "./articles/benue-01";
import Press4 from "./articles/mock-01";
import Press5 from "./articles/inec-01";
import Press6 from "./articles/debt-01";
import Press7 from "./articles/tax-01";
import Press8 from "./articles/diplomacy-01";

import { Press } from "./types";

const press: Array<Press> = [Press8, Press7, Press6, Press5, Press4, Press3, Press2, Press1];

const now = new Date();
export const currentPress = press.filter((article) => {
  const date = new Date(article.date);
	date.setHours(0);
	return date <= now;
});

export default press;
