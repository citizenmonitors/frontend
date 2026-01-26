import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "tax-forged-01",
  shortTitle: "Forged Tax Law",
  title:
    "Forged Tax Law: Citizen Monitors Demands Accountability",
  description:
    "Citizen Monitors condemns the circulation of a forged 2025 Tax Law by the Nigeria Revenue Service (NRS) and the silence of the Federal Government, describing it as a grave threat to constitutional governance and public trust.",
  readingTimeInMinutes: 5,
  date: "2025-01-15",
  author: "Press Office",
  featuredImage: "/assets/press/articles/tax-forged-01.png",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full max-h-[346px]">
            <Image
              src="/assets/press/articles/tax-forged-01.png"
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
            Citizen Monitors condemns the circulation of a forged 2025 Tax Law by the Nigeria Revenue Service (NRS) and the silence of the Federal Government, describing it as a grave threat to constitutional governance and public trust.
          </p>
          <p className="text-justify">
            "A tax law not validly passed by the legislature and assented to cannot be enforced in any democracy," said Olajumoke Alawode-James, Spokesperson for Citizen Monitors. "This is an attempt to replace legality with convenience and it is unacceptable."
          </p>
          <p className="text-justify">
            Citizen Monitors notes that Nigerian law is clear on how legislation, especially tax legislation, must be made and enforced: Any parallel or forged framework has no legal standing. Citizen Monitors emphasized that taxation must be grounded in transparency, due process, and legislative authority. Any deviation from these principles undermines citizens' confidence in government institutions and exposes the public to arbitrary enforcement.
          </p>
          <p className="text-justify">
            The creation or circulation of forged public documents constitutes a criminal offence under Sections 465 to 467 of the Criminal Code Act, and similar provisions under the Penal Code, carrying serious penalties for forgery and uttering false documents.
          </p>
          <p className="text-justify">
            "What has happened is criminal. In any serious country, those who draft, circulate, or enforce a forged law are investigated and prosecuted. If a government confronted by allegations of forgery will not confront the forgery of laws, what hope remains for the rule of law?" said Adeshope Haastrup, Co-founder, Citizen Monitors.
          </p>
        </article>
      ),
    },
    {
      id: "press-section-3",
      heading: "Citizen Monitors calls for",
      content: (
        <article className="grid gap-5 text-gray-700">
          <ol className="list-decimal list-inside space-y-2 text-justify">
            <li>
              An independent investigation to determine how a forged or irregular document entered official use.
            </li>
            <li>
              Prosecution and accountability for all individuals and agencies involved in drafting, circulating, or enforcing the invalid law.
            </li>
          </ol>
          <p className="text-justify">
            "This is not just about taxes," Alawode-James added. "It is about defending constitutional governance. If forged laws can be enforced without consequence, then no citizen is safe from arbitrary power."
          </p>
          <p className="text-justify">
            Citizen Monitors reaffirms its commitment to promoting accountability, transparency, and citizen participation, and calls on civil society organizations, professional bodies, and the media to join in demanding clarity and justice on this matter.
          </p>
        </article>
      ),
    },
  ],
};

export default press;

