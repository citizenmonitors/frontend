import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "inec-01",
  shortTitle: "Citizen Monitors Calls for Accountability",
  title:
    "Citizen Monitors Calls For Accountability Following Removal of Election Results from INEC Portal",
  description:
    "Citizen Monitors reacts to the Edo State Tribunal verdict, highlighting deepening mistrust in Nigeria’s electoral and judicial institutions and calling for accountability and reform.",
  readingTimeInMinutes: 6,
  date: "2025-07-21",
  author: "Press Office",
  featuredImage: "/assets/press/articles/inec-01.png",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full max-h-[346px]">
            <Image
              src="/assets/press/articles/inec-01.png"
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
            Citizen Monitors is raising alarm over the recent removal of all
            election results (as recent as Ondo and Edo 2024 elections) from the
            Independent National Electoral Commission (INEC) portal. This
            unexpected action has raised significant concerns regarding data
            management, transparency, and the integrity of the electoral
            process.
          </p>
          <p className="text-justify">
            The removal of election results from the INEC portal raises critical
            questions that must be addressed to ensure public trust in the
            electoral system. Citizen Monitors is calling on INEC to provide
            clarity on the following issues:
          </p>
          <p className="text-justify">
            <ol className="list-outside ml-8 list-decimal">
              <li>
                Does INEC have a formal data retention policy for election
                results?
              </li>
              <li>
                If yes, what are the specific terms of this policy - including
                timelines and access rights?
              </li>
              <li>
                Was this policy ever communicated to Nigerians or published
                publicly?
              </li>
              <li>
                If no policy exists, was this removal due to a technical glitch
                or system failure?
              </li>
              <li>
                Did INEC’s hosting arrangement (server payments to Amazon Web
                Services) expire or lapse?
              </li>
              <li>
                Were these election records archived? If so, where, and how can
                Nigerians access them?
              </li>
            </ol>
          </p>
          <p className="text-justify">
            The absence of election results (past or present) on the INEC portal
            not only undermines the transparency of the electoral process, but
            also raises concerns about the accessibility of vital information
            for citizens, stakeholders, and international observers. As Nigeria
            continues to strengthen its democratic processes, it is crucial for
            INEC to maintain open lines of communication with the public
            regarding data management practices.
          </p>
          <p className="text-justify">
            Citizen Monitors urges INEC to promptly address these questions and
            provide a comprehensive explanation regarding the removal of the
            election results. The organisation believes transparency is
            essential for fostering trust in the electoral system and ensuring
            all stakeholders can participate meaningfully in Nigeria’s
            democracy.
          </p>
          <p className="text-justify">
            As the country looks ahead to future elections, particularly Anambra
            gubernatorial elections in November 2025, it is imperative that INEC
            demonstrates its commitment to accountability and transparency by
            clearly communicating its policies and practices to Nigerians.
          </p>
        </article>
      ),
    },
  ],
};

export default press;
