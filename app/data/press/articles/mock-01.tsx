import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";
import Link from "next/link";

const press: Press = {
  id: "mock-01",
  shortTitle: "Mock Elections",
  title: "Citizen Monitors Conducts Mock Elections on Saturday, July 12, 2025",
  description:
    "Citizen Monitors responds to the Benue massacre, calling for leadership, accountability, and justice in the face of tragedy.",
  readingTimeInMinutes: 7,
  date: "2025-07-07",
  author: "Press Office",
  featuredImage: "/assets/press/articles/mock-01.jpeg",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full max-h-[346px]">
            <Image
              src="/assets/press/articles/mock-01.jpeg"
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
            In a significant step towards enhancing democratic engagement and
            electoral integrity in Nigeria, Citizen Monitors, Nigeria’s pioneer
            civic tech platform dedicated to crowdsourcing and verifying
            real-time electoral data, will hold mock elections on Saturday, July
            12, 2025, from 9:00am to 5:00pm Nigerian time.{" "}
          </p>
          <p>
            This initiative aims to educate election Observers and Volunteers on
            how to promote transparency and credible elections, through
            gathering and sharing of authentic election results; providing
            useful data for upcoming elections in Nigeria.
          </p>
          <p className="text-justify">
            This landmark simulation allows Nigerians across the country (and in
            the diaspora), practice how to track, report, and verify election
            results at the polling unit level. The mock elections will recreate
            a real polling environment on our platform, using real election
            results and give participants the chance to experience firsthand,
            how Citizen Monitors empowers the electorates to take control of
            election transparency.
          </p>
          <p className="text-justify">
            “These Mock elections are a vital part of empowering citizens and
            ensuring we are well-prepared for real elections,” said Olajumoke
            Alawode-James, Spokesperson and Head of Communications for Citizen
            Monitors.
          </p>
          <p className="text-justify">
            “By participating in this event, citizens will not only learn how to
            navigate the Citizen Monitors platform, but also understand the
            significance of citizens’ engagement in shaping the outcome of our
            elections”, she said.
          </p>
          <p className="text-justify">
            <b>Why Join the Mock Elections?</b>
            <ol className="list-outside ml-8 list-decimal">
              <li>
                Familiarise yourself with live results gathering, uploads and
                reporting.
              </li>
              <li>Learn how to track and validate polling unit data.</li>
              <li>
                Experience the power of collective monitoring on results’
                collations.
              </li>
              <li>
                Be part of the movement to make Nigerian elections almost
                impossible to rig.
              </li>
            </ol>
          </p>

          <p className="text-justify">
            <b>How to Participate:</b>
            <ul className="list-disc list-outside ml-8">
              <li>
                Visit{" "}
                <Link
                  href="/"
                  className="text-brand-500 underline hover:text-brand-600 transition-colors"
									target="_blank"
                >
                  citizenmonitors.com
                </Link>
              </li>
              <li>Sign up as a volunteer or observer before July 12th, 2025</li>
              <li>
                You will receive past voting results from INEC’s IREV to post on
                the platform
              </li>
              <li>
                At the end of the mock election day simulation, you will see
                collated results real-time
              </li>
            </ul>
          </p>

          <p className="text-justify">
            Citizen Monitors invites registered voters to participate in this
            educational simulation. First-time voters are especially encouraged
            to attend, as the mock elections will provide a safe and informative
            environment for learning how to facilitate credible elections in
            Nigeria.
          </p>

          <p className="text-justify">
            Join us in strengthening our democracy and ensuring that every voice
            is heard during elections!
          </p>

          <p className="text-justify">
            <b>About Citizen Monitors:</b>
            <br />
            Citizen Monitors is dedicated to promoting electoral integrity and
            encouraging civic engagement. Through education, outreach, and
            advocacy, and the use of technology; we strive to empower citizens
            to take an active role in the democratic process.
          </p>
        </article>
      ),
    },
  ],
};

export default press;
