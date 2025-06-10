import { v4 } from "uuid";
import { Insight } from "../types";
import Link from "next/link";
import Image from "next/image";

const insight: Insight = {
  id: "test-01",
  shortTitle: "Test Case Study",
  title: "Test title",
  readingTimeInMinutes: 7,
  description: "description...",
  featuredImage: "/assets/case-study/test-01/01.png",
  sections: [
    {
      id: "case-study-section-1",
      heading: "Introduction",
      subHeading: "Intro",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/test-01/01.png"
            className="w-full rounded-xl"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore suscipit
              sed ipsa, repellendus asperiores ratione architecto similique assumenda
              necessitatibus blanditiis expedita tenetur voluptatum nobis quam distinctio,
              corporis voluptate ex explicabo cupiditate! Quia temporibus totam quas
              pariatur, inventore laudantium et accusantium veniam impedit repellendus sit
              explicabo fuga quod quasi dolorem velit.
            </p>
            <p className="text-justify">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui, doloremque
              numquam sapiente, voluptate amet adipisci perferendis, modi aliquid
              quibusdam eveniet earum quasi harum facilis asperiores odio alias rerum
              incidunt pariatur! Nulla culpa numquam soluta assumenda id fugiat nesciunt
              reiciendis iure iste ea, enim alias quos laudantium molestiae quidem
              voluptatibus asperiores.
            </p>
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-2",
      heading: "Test heading",
      subHeading: "Test subheading",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/test-01/02.png"
            className="w-full rounded-xl"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <h3 className="text-brand-500 font-medium ">
              1. Lorem ipsum dolor sit amet:
            </h3>
            <p className="text-justify">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui, doloremque
              numquam sapiente, voluptate amet adipisci perferendis, modi aliquid
              quibusdam eveniet earum quasi harum facilis asperiores odio alias rerum
              incidunt pariatur! Nulla culpa numquam soluta assumenda id fugiat nesciunt
              reiciendis iure iste ea, enim alias quos laudantium molestiae quidem
              voluptatibus asperiores.
            </p>
            <div className="my-2" />
            <h3 className="text-brand-500 font-medium ">
              2. Lorem ipsum dolor sit amet:
            </h3>
            <p className="text-justify">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui, doloremque
              numquam sapiente, voluptate amet adipisci perferendis, modi aliquid
              quibusdam eveniet earum quasi harum facilis asperiores odio alias rerum
              incidunt pariatur! Nulla culpa numquam soluta assumenda id fugiat nesciunt
              reiciendis iure iste ea, enim alias quos laudantium molestiae quidem
              voluptatibus asperiores.
            </p>
            <ol className="list-decimal list-outside ml-8">
              <li>
                Ensuring Transparency: Citizen Monitors enables citizens to document,
                verify, and report polling unit activities in real time. This creates a
                layer of accountability that deters malpractice.
              </li>
              <li>
                Promoting Accountability: By aggregating and analyzing data from polling
                units, Citizen Monitors holds electoral bodies and political actors
                accountable for their actions.
              </li>
              <li>
                Encouraging Peaceful Engagement: With accurate data readily available, the
                platform reduces the uncertainty and mistrust that often lead to violence,
                fostering a culture of acceptance and dialogue.
              </li>
              <li>
                Empowering Issue-Based Politics: By highlighting data on candidates’
                performance and voter priorities, Citizen Monitors can help shift the
                narrative from ethnic and tribal affiliations to competence and
                accountability.
              </li>
            </ol>
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
          </div>
        </article>
      ),
    },
    {
      id: "case-study-section-3",
      heading: "Conclusion",
      subHeading: "Test Conclusion",
      content: (
        <article className="grid gap-5 text-gray-700">
          <Image
            src="/assets/case-study/cm.png"
            className="w-full rounded-xl"
            alt={v4()}
            width={798}
            height={381}
          />
          <div className="grid gap-4 md:text-lg">
            <p className="text-justify">
              Venezuela’s experience with citizen-led election monitoring offers a
              compelling model for Nigeria. Despite Venezuela’s use of electronic
              transmission, manipulation by compromised electoral bodies still undermines
              the integrity of the election process. In Nigeria, where elections are often
              stolen during the collation process at ward and LGA levels, citizen
              monitoring initiatives like “Citizen Monitors” could play a crucial role in
              ensuring transparency. By focusing on real-time reporting, aggregating
              polling unit results, and providing public transparency, Nigeria can reduce
              the likelihood of electoral fraud and restore public trust in the democratic
              process.
            </p>
          </div>
        </article>
      ),
    },
  ],
};

export default insight;
