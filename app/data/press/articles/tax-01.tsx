import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "tax-01",
  shortTitle: "Tax Changes",
  title:
    "Tax Changes Must Come With Clarity, Fairness and Real Protection for Households",
  description:
    "Citizen Monitors calls for clarity and fairness in tax changes, urging the government to protect households from undue financial burdens.",
  readingTimeInMinutes: 5,
  date: "2025-09-22",
  author: "Press Office",
  featuredImage: "/assets/press/articles/tax-01.png",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full max-h-[346px]">
            <Image
              src="/assets/press/articles/tax-01.png"
              className="h-full w-full object-contain object-top rounded-xl"
              alt={v4()}
              width={798}
              height={381}
            />
          </div>
        </article>
      ),
    },
    {
      id: "press-section-2",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <p className="text-justify">The Federal Government has signed new tax legislation, due to take effect from 1st of January 2026, while pausing the proposed 5% fossil-fuel surcharge, pending further consultations. But as households and businesses prepare for 2026, citizens and stakeholders are calling for clear, honest communication; not confusion or panic.</p>
          <p className="text-justify">“Reform is welcome only if people understand it and can plan ahead,” Adeshope Haastrup, Co-Founder Citizen Monitors said. Without clarity, even good policy causes fear. The public needs facts, not rumours.”</p>
        </article>
      ),
    },
    {
      id: "press-section-3",
      heading: "1) Clear, honest communication (no more confusion)",
      content: (
        <article className="grid gap-5 text-gray-700">
          <p className="text-justify">Government should publish one plain-English guide that explains—on a single page—what is changing, what is not, and when. That guide should include a simple timeline to January 2026, FAQs for common jobs and small businesses, and a public helpline/portal for quick answers. This avoids the weekly trickle of rumours and panic.</p>
        </article>
      ),
    },
    {
      id: "press-section-4",
      heading: "2) Protect household budgets (essentials must stay affordable)",
      content: (
        <article className="grid gap-5 text-gray-700">
          <p className="text-justify">Keep reminding the public that VAT stays at 7.5%, and make sure the zero-rated essentials (food, books, medicines, some energy items) are respected in real shops and markets. Regulators should monitor prices and stop fake “VAT increases” at checkout.</p>
        </article>
      ),
    },
    {
      id: "press-section-5",
      heading: "3) Make the rollout simple for workers and small businesses",
      content: (
        <article className="grid gap-5 text-gray-700">
          <p className="text-justify">Publish the updated PAYE tables early, and give SMEs an easy onboarding window into the new e-invoicing/fiscalisation system—without retroactive penalties during transition. Clear steps and free toolkits will raise compliance and reduce fear.</p>
          <p className="text-justify">As rollout begins, Citizen Monitors will track and report the real-life impact of the changes; helping Nigerians see what is working, and where more clarity or correction is needed.</p>
        </article>
      ),
    },

  ],
};

export default press;
