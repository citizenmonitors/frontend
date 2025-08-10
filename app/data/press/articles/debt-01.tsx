import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "debt-01",
  shortTitle: "Unchecked Borrowings",
  title: "Unchecked Borrowings: Citizen Monitors Demands Transparency.",
  description:
    "Citizen Monitors reacts to the alarming rise in Nigeria's public debt, calling for transparency and accountability in government borrowing practices.",
  readingTimeInMinutes: 5,
  date: "2025-08-11",
  author: "Press Office",
  featuredImage: "/assets/press/articles/debt-01.png",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full max-h-[346px]">
            <Image
              src="/assets/press/articles/debt-01.png"
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
            Civic-tech platform, Citizen Monitors, today, called on the Federal
            Government to couple Nigeria’s rising borrowing, with radical
            transparency, stronger debt-risk controls, and citizen-level
            tracking of project results.
          </p>
          <p className="text-justify">
            According to the Debt Management Office (DMO), Nigeria’s total
            public debt stood at ₦149.39 trillion (≈ $97.24bn) as of March 31,
            2025, with nearly half in foreign currency.
          </p>
          <p className="text-justify">
            With a new external borrowing plan exceeding $21 Billion recently
            cleared by the Senate, Citizen Monitors says Nigerians deserve a
            clear view of what is being borrowed, on what terms, and for what
            outcomes.
          </p>
          <p className="text-justify">
            “Debt isn’t the enemy, opacity is,” said Adeshope Haastrup,
            Co-founder of Citizen Monitors. “If loans are truly for classrooms,
            clinics, power and jobs, then publish the term sheets, publish the
            project milestones, and let citizens see the outputs, month by
            month.”
          </p>
          <p className="text-justify">
            <b>
              Citizen Monitors outlined six immediate actions to rebuild public
              trust:
            </b>
            <ul className="list-disc list-outside ml-8">
              <li>
                Publish non-confidential loan terms and project annexes for
                every new facility.
              </li>
              <li>
                Quarterly, machine-readable debt data (by lender, currency,
                rate, maturity, and disbursement).
              </li>
              <li>
                Cap non-concessional FX borrowing and disclose hedging/risk
                policy.
              </li>
              <li>
                Project dashboards for each loan, with physical progress and
                community verification.
              </li>
              <li>
                Clear public notes on commodity-backed and para-sovereign deals
                (like crude prepayments).
              </li>
              <li>
                Open contracting (OCDS) and independent monitors for all
                loan-funded procurements.
              </li>
            </ul>
          </p>
          <p className="text-justify">
            The call follows recent lender actions, including World Bank
            approvals of $2.25 Billion (June 2024) for macro reforms and $1.08
            Billion (April 2025) for education, nutrition and resilience; a
            $254.76 Million release from China Development Bank for the
            Kano–Kaduna rail; and China Exim-backed roads finance approvals—all
            of which heighten the need for clear, public, project-level
            tracking.{" "}
          </p>
          <p className="text-justify">
            <em>“Citizen Monitors is ready to help”</em> Olajumoke Alawode-James,
            Spokesperson and Head of Communications, added. “Give the public
            data, and we’ll provide the dashboard. Every kilometer of road,
            every classroom, every megawatt built with borrowed funds should be
            visible and verifiable.”
          </p>
          <p className="text-justify">
            Citizen Monitors is a civic tech platform that crowd-sources
            elections and governance data, enabling Nigerians to upload
            evidence, track elections, and hold institutions accountable.
          </p>
          <p className="text-justify"></p>
        </article>
      ),
    },
  ],
};

export default press;
