import { v4 } from "uuid";
import { Insight } from "../types";
import Link from "next/link";
import Image from "next/image";

const insight: Insight = {
  id: "case-study-venezuela-01",
  shortTitle: "Venezuela Case Study",
  title: "Venezuela’s Citizen-Led Election Monitoring and Its Relevance to Nigeria",
  readingTimeInMinutes: 7,
  description:
    "Both Venezuela and Nigeria share striking similarities in their electoral challenges, rooted in deep-seated manipulation and fraud...",
  featuredImage: "/assets/case-study/venezuela-01/01.png",
  sections: [
    {
      id: "case-study-section-1",
      heading: "Introduction",
      subHeading: "Historical Failures in Electoral Integrity in Nigeria and Venezuela",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/venezuela-01/01.png"
            className="w-full rounded-xl aspect-[209/100]"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              Both Venezuela and Nigeria share striking similarities in their electoral
              challenges, rooted in deep-seated manipulation and fraud. Nigeria’s
              struggles with election rigging, particularly during the collation
              process, have been evident since the infamous 2007 elections that ushered
              in Umaru Yar’Adua as president. These elections were so flawed that
              Yar’Adua himself acknowledged the issues, marking the start of a pattern
              that has persisted through subsequent elections, including the
              controversial 2023 general elections. Meanwhile, Venezuela, despite having
              an electronic transmission system for election results, has faced similar
              issues with electoral manipulation by a compromised National Electoral
              Council (CNE). Both nations, despite the potential for free and fair
              elections, are trapped in cycles of distrust due to the lack of
              transparent electoral processes.
            </p>
            <p className="text-justify">
              In Nigeria, the rigging often occurs at the ward and LGA collation
              centers, far from public scrutiny, where security forces frequently harass
              or intimidate party agents and citizen monitors. The only part of the
              process the public can reliably access is the polling unit, making it
              nearly impossible for citizen monitors to verify tally sheets beyond the
              initial voting stage. In contrast, Venezuela has the technology to
              electronically transmit results but continues to face manipulation during
              the final announcement of election outcomes. This case study explores how
              Venezuela’s citizen-led election monitoring model, despite facing its own
              challenges, can provide valuable lessons for Nigeria, where an independent
              monitoring framework could help ensure the authenticity of election
              results before they are manipulated in the collation stages.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-2",
      heading: "The Venezuelan Monitoring Model",
      subHeading: "A Blueprint for “Citizen Monitors”",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/venezuela-01/02.png"
            className="w-full rounded-xl aspect-[209/100]"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <h3 className="text-brand-500 font-medium ">
              1. Establishing a Neutral Monitoring Framework:
            </h3>
            <p className="text-justify">
              In Venezuela, independent citizen-led monitors have become a crucial part
              of the election process. Their neutral and non-partisan nature helps to
              ensure that electoral irregularities are documented and brought to public
              attention. In Nigeria, the need for such a framework is even more
              pressing. With the public and party agents frequently prevented from
              accessing collation centres at the ward and LGA levels, independent
              monitors like “Citizen Monitors” could play a vital role in preventing
              electoral theft by focusing on real-time data aggregation from polling
              units before results reach the collation centres.
            </p>
            <div className="my-2" />
            <h3 className="text-brand-500 font-medium ">
              2. Training and Deploying Monitors Across Polling and Collation Centres:
            </h3>
            <p className="text-justify">
              In Venezuela, trained volunteer monitors are deployed at polling stations
              to ensure the voting activity is accurately reported and free for
              inducement. In Nigeria, where electoral manipulation often occurs at
              collation centres, monitors should be stationed to report results and or
              irregularities at polling units. This data can then be aggregated
              independently to counter discrepancies at the ward and LGA collation
              levels. Given the security challenges that often arise during collation,
              deploying monitors with a clear mandate to report issues in real-time
              would help ensure that any attempts to manipulate the process are
              documented.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-3",
      heading: "Election Day Monitoring",
      subHeading: "Ensuring Transparency in Nigeria",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/venezuela-01/03.png"
            className="w-full rounded-xl aspect-[209/100]"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <h3 className="text-brand-500 font-medium ">
              1. Real-Time Monitoring and Reporting:
            </h3>
            <p className="text-justify">
              In Venezuela, volunteer monitors use mobile apps to submit reports on
              irregularities in real-time. This model adopted by “Citizen Monitors”
              would be beneficial for Nigeria, especially since the polling unit is the
              only place where citizen monitors can reliably access and report verified
              election data without interference. By aggregating the data in real-time
              from polling units, independent monitors can create a transparent record
              that will help counteract manipulations at higher levels of collation.
            </p>
            <div className="my-2" />
            <h3 className="text-brand-500 font-medium ">
              2. Strategic Deployment Across Collation Centres:
            </h3>
            <p className="text-justify">
              Given that the manipulation of results typically occurs at the ward and
              LGA levels, citizen monitors would strategically deploy accredited
              observers to collect polling unit results, then we verify their
              authenticity, make it available for public appraisals and then we approve
              for aggregation after data quality checks to be LIVE for the world to see.
              While monitors may not be able to physically access these centres, their
              work in getting the polling unit results would play a critical role in
              ensuring accurate reporting from the beginning of the process.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-4",
      heading: "Post-Election Monitoring",
      subHeading: "Aggregating and Appraising Results",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/venezuela-01/04.png"
            className="w-full rounded-xl aspect-[209/100]"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <h3 className="text-brand-500 font-medium ">
              1. Aggregating Results from Polling Units:
            </h3>
            <p className="text-justify">
              Unlike verifying tally sheets at the collation centres, which remain
              inaccessible due to the influence of security forces and or thugs at
              collation centres, “Citizen Monitors” in Nigeria can focus on
              authenticating the results at polling units through our baked in public
              appraisal process and peer review process. After verifying the polling
              unit records, the data can be independently aggregated. Members from the
              same polling units within the *Citizen Monitors* network can appraise
              these results to ensure they are accurate, effectively bypassing potential
              manipulation at higher levels of the collation process.
            </p>
            <div className="my-2" />
            <h3 className="text-brand-500 font-medium ">
              2. Public Reporting and Transparency:
            </h3>
            <p className="text-justify">
              Transparency is key to the success of any election monitoring effort. In
              Venezuela, citizen monitors have regularly shared their findings with the
              public and international observers. In Nigeria, “Citizen Monitors” intends
              to do well to follow this model by publishing their aggregated results,
              allowing the public to compare them with the official announcements. This
              would provide an additional layer of accountability, ensuring that
              discrepancies are brought to light before they can be officially
              manipulated.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-5",
      heading: "Current Political Situation",
      subHeading: "Lessons from Venezuela’s 2024 Elections for Nigeria",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/venezuela-01/05.png"
            className="w-full rounded-xl aspect-[209/100]"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              Despite Venezuela’s advanced electronic transmission system, the 2024
              elections still faced significant allegations of fraud, as tally sheets
              submitted by opposition groups revealed discrepancies from the official
              government-announced results. In Nigeria, where there is no electronic
              transmission system, election results are even more vulnerable to
              manipulation at collation centres, as evidenced by the 2023 general
              elections and subsequent state elections in Edo, Kogi, and Imo states.
              Security forces routinely prevent monitors and party agents from observing
              the collation process, allowing for results to be altered without public
              scrutiny. This is where “Citizen Monitors” can step in, ensuring that
              polling unit results are accurately recorded and aggregated to counteract
              discrepancies that may occur during collation.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-6",
      heading: "Conclusion",
      subHeading: "How Citizen Monitoring Can Improve Nigeria’s Elections",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/cm.png"
            className="w-full rounded-xl aspect-[209/100]"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              Venezuela’s experience with citizen-led election monitoring offers a
              compelling model for Nigeria. Despite Venezuela’s use of electronic
              transmission, manipulation by compromised electoral bodies still
              undermines the integrity of the election process. In Nigeria, where
              elections are often stolen during the collation process at ward and LGA
              levels, citizen monitoring initiatives like “Citizen Monitors” could play
              a crucial role in ensuring transparency. By focusing on real-time
              reporting, aggregating polling unit results, and providing public
              transparency, Nigeria can reduce the likelihood of electoral fraud and
              restore public trust in the democratic process.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-7",
      heading: "",
      subHeading: "References",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              1. Venezuelan Opposition Claims Fraud in 2024 Elections: Center for
              Economic and Policy Research (CEPR).{" "}
              <Link
                href="https://cepr.net/report/venezuelas-disputed-election-and-the-path-forward/"
                className="text-brand-500 underline hover:text-brand-600 transition-colors"
              >
                https://cepr.net
              </Link>
            </p>
            <p className="text-justify">
              2. Challenges in Venezuela’s Electronic Transmission System: WLRN,
              covering Venezuela’s electoral challenges and tally sheet manipulation.{" "}
              <Link
                href="https://www.wlrn.org/americas/2024-10-03/venezuela-election-nicolas-maduro/"
                className="text-brand-500 underline hover:text-brand-600 transition-colors"
              >
                https://www.wlrn.org
              </Link>
            </p>
            <p className="text-justify">
              3. Yar’Adua’s Acknowledgment of Flawed Elections in Nigeria: Human Rights
              Watch, on the flaws of the 2007 Nigerian elections and Yar’Adua’s
              admission of fraud.{" "}
              <Link
                href="https://www.hrw.org/news/2011/05/16/nigeria-post-election-violence-killed-800/"
                className="text-brand-500 underline hover:text-brand-600 transition-colors"
              >
                https://www.hrw.org
              </Link>
            </p>
            <p className="text-justify">
              4. Historical Overview of Electoral Challenges in Nigeria: SpringerLink,
              providing a comprehensive look at electoral manipulation in Nigeria since
              1999.{" "}
              <Link
                href="https://link.springer.com/chapter/10.1007/978-3-030-73375-9_1/"
                className="text-brand-500 underline hover:text-brand-600 transition-colors"
              >
                https://link.springer.com
              </Link>
            </p>
            <p className="text-justify">
              5. Washington Post’s Work on Venezuela Elections:{" "}
              <Link
                href="https://www.nytimes.com/2024/09/08/world/americas/edmundo-gonzalez-venezuela-opposition-candidate.html?smid=nytcore-ios-share&referringSource=articleShare&sgrp=c-cb/"
                className="text-brand-500 underline hover:text-brand-600 transition-colors"
              >
                https://www.nytimes.com
              </Link>
            </p>
          </div>
        </article>
      ),
    },
  ],
}

export default insight;