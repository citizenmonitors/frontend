import Press1 from "./articles/rivers-01";
import Press2 from "./articles/edo-01";
import Press3 from "./articles/benue-01";
import Press4 from "./articles/mock-01";
import Press5 from "./articles/inec-01";
import Press6 from "./articles/debt-01";
import Press7 from "./articles/tax-01";
import Press8 from "./articles/nigeria-2027-election-budget";
import Press9 from "./articles/tax-forged-01";
import Press10 from "./articles/pat-utomi-x-space-01";

import { Press } from "./types";

const staticPressArticles: Array<Press> = [
  Press10,
  Press9,
  Press8,
  Press7,
  Press6,
  Press5,
  Press4,
  Press3,
  Press2,
  Press1,
];

/** Bundled press releases (committed in repo). */
export const staticPress = staticPressArticles;

const now = new Date();
export const currentPress = staticPressArticles.filter((article) => {
  const date = new Date(article.date);
  date.setHours(0);
  return date <= now;
});

export default staticPressArticles;
