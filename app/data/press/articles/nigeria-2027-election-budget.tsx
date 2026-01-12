import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "nigeria-2027-election-budget",
  shortTitle: "₦1.01 Trillion Budget for 2027 Elections",
  title:
    "Citizen Monitors Queries ₦1.01 Trillion Budget for Nigeria’s 2027 Elections",
  description:
    "Citizen Monitors raises concerns over the ₦1.01 trillion budget for Nigeria's 2027 elections, calling for transparency, accountability, and measurable outcomes.",
  readingTimeInMinutes: 6,
  date: "2025-01-12",
  author: "Press Office",
  featuredImage: "/assets/press/articles/nigeria-2027-election-budget.jpg",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full max-h-[346px]">
            <Image
              src="/assets/press/articles/nigeria-2027-election-budget.jpg"
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
          <p className="text-justify">
            Lagos, Nigeria — Citizen Monitors, a civic technology and election
            integrity organisation, has raised serious concerns over the
            reported ₦1.01 trillion budget for Nigeria’s 2027 general elections,
            warning that the figure is excessive, unjustified, and disconnected
            from measurable electoral outcomes.
          </p>
          <p className="text-justify">
            Nigeria is grappling with rising insecurity, failing infrastructure,
            and severe fiscal strain. In this context, allocating over one
            trillion Naira to conduct an election demands a level of
            transparency, efficiency, and accountability that has not been
            demonstrated.
          </p>
          <p className="text-justify">
            “Elections are a public service, not a spectacle,” said Olajumoke
            Alawode-James, spokesperson for Citizen Monitors. “₦1.01 trillion
            without a clear, itemised and performance-based framework is not
            reform—it is institutionalised waste. If Nigerians are going to get
            elections like 2023, where INEC’s result-upload system failed, then
            this level of spending is indefensible.”
          </p>
          <p className="text-justify">
            Nigeria spent over ₦300 billion on the 2023 elections, yet the
            process was marred by technology failures, missing or altered
            polling unit results, logistical breakdowns, and a credibility
            crisis that persists today. Despite this, no comprehensive public
            audit has been released showing how funds were used, what failed, or
            what has been fixed.
          </p>
          <p className="text-justify">
            “Before Nigerians are asked to fund a ₦1.01 trillion election, they
            deserve to know what went wrong in 2023, who was responsible, and
            what will be done differently in 2027,” the organisation stated.
          </p>
          <p className="text-justify">
            Citizen Monitors warned that increasing the budget without fixing
            the systems will not produce credible elections. Across parts of
            Africa, elections are often used as theatre to legitimise power
            rather than reflect the will of the people. Nigeria, facing urgent
            needs in security, jobs, healthcare, and infrastructure, cannot
            afford to fund elections that merely create the appearance of
            democracy.
          </p>
          <p className="text-justify">
            The organisation is calling for:
            <ul className="list-disc list-outside ml-8">
              <li>A full forensic audit of 2023 election spending</li>
              <li>A public, line-by-line breakdown of the proposed 2027 budget</li>
              <li>
                Clear performance indicators tied to funding, including secure
                electronic voting and transparent result transmission
              </li>
              <li>
                Independent citizen and civil-society oversight of election
                spending
              </li>
              <li>
                Open access to polling-unit results and procurement data
              </li>
            </ul>
          </p>
          <p className="text-justify">
            “At a time when Nigerians are struggling to afford food, fuel, and
            school fees, spending ₦1.01 trillion on an election that may still
            fail is not just irresponsible—it is immoral,” Citizen Monitors
            said.
          </p>
          <p className="text-justify">
            Credible elections are vital to national stability, but credibility
            is built on transparency, data, and accountability—not just
            spending. “If INEC and the political class want public trust, they
            must open the books, show the data, and prove that every naira will
            translate into verifiable, auditable votes.”
          </p>
        </article>
      ),
    },
  ],
};

export default press;
