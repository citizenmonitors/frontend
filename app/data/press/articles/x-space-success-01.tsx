import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const speakers = [
  "Professor Pat Utomi, Political Economist and Founder of the Centre for Values in Leadership",
  "Funso Doherty, National Democratic Coalition (NDC) Gubernatorial Candidate in Lagos State",
  "Dayo Israel, APC National Youth Leader",
  "Demola Olarewaju, Senior Political Assistant to Atiku Abubakar",
  "Seun Onigbinde, Co-Founder, BudgIT",
  "Gov. Amuneke, Comedian and Political Satirist",
  "Rinu Oduala, Human Rights Advocate",
  "Barrister Evans Ufeli, Human Rights Lawyer",
  "Barrister Festus Ogun, Legal Practitioner and Public Affairs Commentator",
  "Dr. Olufunmilayo, Medical Doctor and Public Affairs Analyst",
  "Idris Zekeri, Political Analyst",
  "Henry Shield, Leadership and Accountability Initiative",
  "Ife Salako, NDC Candidate for Alimosho Constituency",
  "Cheta Nwanze, Lead Partner at SBM Intelligence",
  "Sir Collins, Finance Professional",
  "Lola Okunrin, Social Media Influencer",
  "Chinjindu Nwajei, Cybersecurity Expert",
  "Emir SirDam, Media and Tech",
  "Jumoke Alawode-James, Journalist",
  "Mindset, Political Analyst",
];

const press: Press = {
  id: "x-space-success-01",
  shortTitle: "72 Hours X Space Success",
  title:
    "Citizen Monitors 72 Hours X Space Records Resounding Success with Leading Voices in Governance, Politics and Civil Society",
  description:
    "Citizen Monitors announces the successful conclusion of its 72-hour X Space from May 29–31, 2026, bringing together prominent voices from politics, governance, civil society, media, and public policy.",
  readingTimeInMinutes: 6,
  date: "2026-06-03",
  author: "Press Office",
  featuredImage: "/assets/press/articles/x-space-success-01.jpg",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full max-h-[346px]">
            <Image
              src="/assets/press/articles/x-space-success-01.jpg"
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
            Citizen Monitors has announced the successful conclusion of the
            Citizen Monitors 72 Hours X Space, held from Friday, May 29 to
            Sunday, May 31, 2026, bringing together prominent voices from
            politics, governance, civil society, media, finance, technology, and
            public policy for three days of continuous engagement on the future
            of Nigeria.
          </p>
          <p className="text-justify">
            The event served as a platform for robust discussions on democratic
            accountability, governance, economic development, electoral reforms,
            citizen participation, national security, youth engagement, and the
            road to the 2027 general elections.
          </p>

          <div className="mt-6">
            <h3 className="font-league text-display-xs md:text-display-sm font-semibold tracking-tight text-brand-600 mb-4">
              A distinguished line-up of speakers contributed to the
              conversations, including:
            </h3>
            <ul className="list-disc list-outside ml-8 space-y-2 text-justify">
              {speakers.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>

          <p className="text-justify">
            Throughout the seventy-two-hour marathon conversation, speakers and
            participants examined the challenges and opportunities facing
            Nigeria’s democracy, emphasizing the need for stronger institutions,
            greater transparency in governance, responsible political
            leadership, and active citizen engagement.
          </p>
          <p className="text-justify">
            The discussions highlighted the critical role of informed citizens
            in safeguarding democratic processes and ensuring accountability at
            all levels of government. Participants also explored strategies for
            enhancing electoral credibility ahead of the 2027 elections and
            strengthening public trust in government institutions.
          </p>
          <p className="text-justify">
            Speaking on the significance of the initiative, organisers noted that
            Citizen Monitors 72 Hours X Space, a vibrant civic engagement
            platform in Nigeria’s digital space, providing citizens with direct
            access to policymakers, political actors, experts, and thought
            leaders; was organised to herald the launch of the Citizen Monitors
            App.
          </p>
          <p className="text-justify">
            The success of the event reflects a growing appetite among Nigerians
            for issue-based conversations that transcend partisan divides and
            focus on practical solutions to national challenges; as well as a tool
            for elections results collation that prevents errors and
            falsifications of election results at collation centres going
            forward.
          </p>
          <p className="text-justify">
            Citizen Monitors extends its appreciation to all speakers, partners,
            volunteers, and thousands of listeners who contributed to making the
            Space a remarkable success.
          </p>
          <p className="text-justify">
            As Nigeria continues its democratic journey, Citizen Monitors remains
            committed to promoting civic education, accountability, citizen
            participation, and constructive dialogue that advances national
            development.
          </p>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="font-league text-display-xs md:text-display-sm font-semibold tracking-tight text-brand-600 mb-4">
              About Citizen Monitors
            </h3>
            <p className="text-justify">
              Citizen Monitors is a civic engagement platform dedicated to
              promoting transparency, accountability, democratic participation,
              and informed public discourse through digital media, public
              conversations, and citizen-centred advocacy initiatives.
            </p>
          </div>
        </article>
      ),
    },
  ],
};

export default press;
