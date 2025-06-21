import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "edo-01",
  shortTitle: "Edo Tribunal Verdict Deepens Crisis",
  title:
    "Edo Tribunal Verdict Deepens Crisis of Confidence in Electoral and Judicial Institutions",
  description:
    "Citizen Monitors reacts to the Edo State Tribunal verdict, highlighting deepening mistrust in Nigeria’s electoral and judicial institutions and calling for accountability and reform.",
  readingTimeInMinutes: 5,
  date: "2025-04-03",
  author: "Press Office",
  featuredImage: "/assets/press/articles/edo-01.png",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full h-[346px]">
            <Image
              src="/assets/press/articles/edo-01.png"
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
            The decision of the Edo State Election Petition Tribunal on April 2, 2025, to
            uphold the declared outcome of the last gubernatorial election has further
            deepened public mistrust in Nigeria’s democratic institutions. What was
            expected to be an opportunity for judicial intervention and correction has
            instead reinforced concerns about institutional complicity and a systemic
            failure to protect the people’s mandate.
          </p>
          <p className="text-justify">
            Throughout the election, numerous reports of result collation breakdowns,
            non-transmission of polling unit outcomes, and interference at collation
            centers were documented by observers and citizens alike. These irregularities
            were not addressed meaningfully by the Independent National Electoral
            Commission (INEC), nor were they given sufficient weight in the judicial
            process.
          </p>
          <p className="text-justify">
            The result is a growing sense among citizens that both the electoral body and
            the courts are no longer neutral arbiters of democracy but actors in a broken
            system. When institutions designed to safeguard democratic order appear
            indifferent to public outcry and evidence, they risk losing legitimacy
            entirely.
          </p>
          <p className="text-justify">
            We call on the Nigerian judiciary to reflect deeply on its role in this
            fragile democratic moment. The courts must rise above technicalities and
            political pressure to protect democratic integrity. The survival of our
            democracy depends not just on elections, but on the willingness of our
            institutions to ensure that every vote counts—and is seen to count.
          </p>
          <p className="text-justify">
            More than ever, Nigerians must reclaim their stake in the democratic process.
            Democracy is not just about what happens on election day—it is about
            accountability, transparency, and justice every day after.
          </p>
        </article>
      ),
    },
  ],
};

export default press;
