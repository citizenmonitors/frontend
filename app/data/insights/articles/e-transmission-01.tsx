import { v4 } from "uuid";
import { Insight } from "../types";
import Image from "next/image";

const insight: Insight = {
  id: "e-transmission-01",
  shortTitle: "E-Transmission or Manual Collation",
  title: "E-Transmission or Manual Collation: which should supersede?",
  readingTimeInMinutes: 8,
  description:
    "As Nigeria prepares for future elections, one question remains unresolved: Should manual collation still coexist with electronic transmission of results—or has the time come for one to clearly supersede the other, particularly in legal disputes?",
  featuredImage: "/assets/case-study/e-transmission-01/01.jpeg",
  sections: [
    {
      id: "case-study-section-1",
      heading: "Introduction",
      subHeading: "The Core Question",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/e-transmission-01/01.jpeg"
            className="w-full rounded-xl"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              As Nigeria prepares for future elections, one question remains unresolved: Should manual collation still coexist with electronic transmission of results or has the time come for one to clearly supersede the other, particularly in legal disputes?
            </p>
            <p className="text-justify">
              This debate is often framed as manual versus electronic. In reality, the problem is deeper. It is about data integrity and data quality. Electronic transmission of results was introduced to address a long standing weakness in our electoral process: human interference between the polling unit and the final declaration of results. At its core, technology was meant to reduce discretion, limit manipulation, and restore public trust.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-2",
      heading: "",
      subHeading: "The Technical Reality",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              The BVAS machines already possess the functionality to input and transmit election results electronically. Electronic collation, therefore, is not a future aspiration, it is technically available today. The weakness lies elsewhere. Despite the availability of electronic transmission, manual collation remains not just a backup, but in practice, a parallel, and often dominant in the process.
            </p>
            <p className="text-justify">
              This duality creates a dangerous ambiguity.
            </p>
            <h3 className="text-brand-500 font-medium">
              When Two Systems Exist Side by Side
            </h3>
            <p className="text-justify">
              When two systems exist side by side, the weaker one becomes the loophole. Manual collation, vulnerable to delay, alteration, and opaque decision making, repeatedly undermines the integrity that electronic transmission promises. But if results are manipulated at the source on Form EC8 the same false figures can simply be inputted into the BVAS. Once uploaded, those manipulated figures are electronically transmitted, collated, and legitimised by technology. In such a scenario, electronic transmission does not prevent fraud; it merely digitises it.
            </p>
            <p className="text-justify">
              This exposes a critical truth: Electronic collation is only as credible as the data fed into the system.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-3",
      heading: "",
      subHeading: "The Point of Compromise",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              When votes are cast manually, counted manually, and first recorded manually, technology becomes a conveyor belt, not a safeguard. Manual processes remain the point of compromise, and electronic systems inherit their defects.
            </p>
            <p className="text-justify">
              That is why the real reform question is not whether electronic transmission should replace manual collation but whether manual data input should exist at all. Why preserve a manual process that history has shown is consistently abused, when a more transparent alternative exists?
            </p>
            <h3 className="text-brand-500 font-medium">
              The Illusion of Reform
            </h3>
            <p className="text-justify">
              If electronic transmission is adopted, it must not be symbolic. It must supersede manual collation, not merely accompany it. Anything less turns reform into performance and technology into decoration.
            </p>
            <p className="text-justify">
              Only electronic voting, where votes are captured directly and immutably at the point of casting, can truly secure electronic collation. Anything short of that leaves room for human interference before technology ever comes into play.
            </p>
            <p className="text-justify">
              A dual system manual voting with electronic transmission creates the illusion of reform while preserving the very vulnerabilities that undermine electoral credibility.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-4",
      heading: "Citizen Monitors",
      subHeading: "Demanding Clarity and Integrity",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              At Citizen Monitors, we maintain that democracy cannot be secured by half measures. Electoral credibility is built on clarity, not compromise. Nigerians deserve election results that are traceable, verifiable, and difficult to manipulate not ones negotiated in collation centres after polling has ended.
            </p>
            <p className="text-justify">
              If technology is to be used, it must protect the vote from origin to outcome, not merely speed up the collation of compromised data.
            </p>
            <p className="text-justify">
              As citizens, observers, and advocates, Nigerians must continue to ask hard questions:
            </p>
            <ul className="list-disc list-outside ml-8 space-y-2">
              <li>What role should manual collation still play, just back-up?</li>
              <li>Who benefits from maintaining it?</li>
              <li>And what does genuine reform truly require?</li>
            </ul>
            <p className="text-justify">
              The integrity of our elections depends on answering these questions honestly.
            </p>
            <p className="text-justify font-medium">
              Stay engaged. Stay informed. Demand integrity and clarity.
            </p>
          </div>
          <Image
            src="/assets/case-study/cm.png"
            className="w-full rounded-xl"
            alt={v4()}
            width={798}
            height={381}
          />
        </article>
      ),
    },
  ],
};

export default insight;

