import { v4 } from "uuid";
import { Insight } from "../types";
import Link from "next/link";
import Image from "next/image";

const insight: Insight = {
  id: "nigeria-elections-01",
  shortTitle: "Nigeria’s Election Case Study",
  title: "Why Nigeria’s Election is Complex than anywhere in Africa",
  readingTimeInMinutes: 7,
  description:
    "Nigeria’s electoral landscape is uniquely complex, presenting challenges that are unparalleled across Africa. These complexities...",
  featuredImage: "/assets/case-study/nigeria-elections-01/01.JPG",
  sections: [
    {
      id: "case-study-section-1",
      heading: "Introduction",
      subHeading: "Navigating Nigeria’s Unique Electoral Complexity",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/nigeria-elections-01/01.JPG"
            className="w-full rounded-xl"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              Nigeria’s electoral landscape is uniquely complex, presenting challenges
              that are unparalleled across Africa. These complexities stem from a
              confluence of factors, including vast voter populations, operational
              hurdles, deep-seated socio-political dynamics and the factor of Nigerians
              being Nigerians topping it all.
            </p>
            <h3 className="text-brand-500 font-medium ">
              Sheer Scale of the Electoral Process
            </h3>
            <p className="text-justify">
              As of the 2023 general elections, Nigeria had over 93 million registered
              voters, surpassing the combined total of 74 million registered voters in the
              other 14 West African countries. This immense voter base necessitates a vast
              network of polling units to ensure accessibility and efficiency. In 2021,
              the Independent National Electoral Commission (INEC) increased the number of
              polling units from 119,974 to 176,846 to better serve the growing
              electorate.
            </p>
            <p className="text-justify">
              To contextualize, Ghana, with approximately 17 million registered voters,
              operates around 38,622 polling stations. South Africa, accommodating about
              26 million registered voters, manages roughly 23,151 voting stations. In
              contrast, Nigeria’s extensive network of 176,846 polling units underscores
              the operational challenges inherent in administering elections on such a
              massive scale.
            </p>
            <Image
              src="/assets/case-study/nigeria-elections-01/02.JPG"
              className="w-full rounded-xl"
              alt={v4()}
              width={798}
              height={381}
            />
            <p className="text-justify">
              The vast number of polling units presents significant operational
              challenges, including the distribution of materials, deployment of
              personnel, and ensuring security across diverse terrains. These challenges
              are compounded by infrastructural deficits and security concerns in various
              regions.
            </p>
            <p className="text-justify">
              Nigeria’s rich tapestry of over 250 ethnic groups and a nearly equal
              division between Islam and Christianity adds layers of complexity to the
              electoral process. Political affiliations often align with ethnic and
              religious identities, leading to tensions and, at times, violence during
              elections.
            </p>
            <p className="text-justify">
              These factors can either benefit or hinder our electoral process. However,
              the actions of certain individuals in Nigeria significantly contribute to
              the complexity and contentiousness of our elections. Issues such as the
              manipulation of election technology and the corruption of vote collation
              processes are orchestrated by individuals within the system. As long as
              these individuals hold these positions, they will continue to find ways to
              suppress the people’s voice. The ongoing decline in electoral participation
              stems from a widespread belief that, under the current Nigerian system,
              individual votes do not count, and there appears to be no effective measures
              addressing this concern.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-2",
      heading: "",
      subHeading: "The Role of Citizen Monitors",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/nigeria-elections-01/03.JPG"
            className="w-full rounded-xl"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              Addressing these multifaceted challenges requires innovative solutions that
              empower citizens and promote transparency. Citizen Monitors can play a
              pivotal role in this endeavour:
            </p>
            <ol className="list-disc list-outside ml-8">
              <li>
                Ensuring Transparency: By enabling citizens to monitor and report election
                activities in real-time, Citizen Monitors foster transparency and deter
                electoral fraud.
              </li>
              <li>
                Promoting Accountability: Providing platforms for incident reporting holds
                electoral bodies and political actors accountable, ensuring adherence to
                democratic principles.
              </li>
              <li>
                Facilitating Peaceful Engagement: Encouraging active citizen participation
                through monitoring can lead to greater acceptance of election outcomes,
                reducing post-election tensions.
              </li>
              <li>
                Educating Voters: Citizen Monitors can disseminate information on
                electoral processes and voter rights, empowering citizens to make informed
                decisions and resist manipulative practices.
              </li>
            </ol>
            <p className="text-justify">
              By integrating these practices, Citizen Monitors can help actualize the
              democratic lessons from Ghana’s 2024 election in Nigeria and across Africa,
              promoting fair and credible electoral processes that the people can trust
              and improving governance for all.
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
