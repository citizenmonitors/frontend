import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "pat-utomi-x-space-01",
  shortTitle: "Prof. Pat Utomi on 72-Hour X Space",
  title:
    "Pat Utomi Joins Citizen Monitors’ 72-Hour X Space on Nigeria’s 2027 Elections",
  description:
    "Renowned political economist, public intellectual, and democracy advocate, Prof. Pat Utomi, will join the Citizen Monitors’ 72-hour X Space focused on Credible 2027 elections, the future of Nigeria’s democracy, governance, accountability, and citizen participation; from May 29-31, 2026.",
  readingTimeInMinutes: 4,
  date: "2026-05-11",
  author: "Press Office",
  featuredImage: "/assets/press/articles/pat-utomi-x-space-01.jpeg",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full max-h-[346px]">
            <Image
              src="/assets/press/articles/pat-utomi-x-space-01.jpeg"
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
            Renowned political economist, public intellectual, and democracy
            advocate, Prof. Pat Utomi, will join the Citizen Monitors’ 72-hour X
            Space focused on Credible 2027 elections, the future of Nigeria’s
            democracy, governance, accountability, and citizen participation;
            from May 29-31, 2026.
          </p>
          <p className="text-justify">
            The special conversation is part of Citizen Monitors’ commitment to
            promoting civic engagement, democratic accountability, and informed
            public discourse on issues shaping Nigeria’s political landscape, as
            a prelude to the Citizen Monitors App launch on June 1st, 2026.
          </p>
          <p className="text-justify">
            Professor Pat Utomi’s participation, &quot;The Economics of Stolen
            Elections&quot;, is expected to deepen conversations around
            leadership, electoral integrity, institutional reforms, and the role
            of citizens in strengthening democratic institutions.
          </p>
          <p className="text-justify">
            The 72-hour X Space has attracted citizens, activists, policy
            experts, media professionals, and political observers from across
            Nigeria and the diaspora; creating an open platform for robust
            engagement on matters of national importance.
          </p>
          <p className="text-justify">
            Speaking ahead of the session, organisers described Professor
            Utomi’s participation as &quot;a significant contribution to the
            national conversation at a critical time for Nigeria’s
            democracy.&quot;
          </p>
          <p className="text-justify">
            Citizens are encouraged to join the live conversation, contribute
            perspectives, and engage directly with leading voices committed to
            democratic development and national progress.
          </p>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="font-league text-display-xs md:text-display-sm font-semibold tracking-tight text-brand-600 mb-5">
              Event Details:-
            </h3>
            <dl className="grid gap-3 text-justify sm:grid-cols-[minmax(0,140px)_1fr] sm:gap-x-6 sm:gap-y-3">
              <dt className="font-semibold text-gray-800 sm:pt-0.5">
                Platform
              </dt>
              <dd>X Spaces</dd>
              <dt className="font-semibold text-gray-800 sm:pt-0.5">Host</dt>
              <dd>@CitizenMonitors</dd>
              <dt className="font-semibold text-gray-800 sm:pt-0.5">Theme</dt>
              <dd>Nigeria’s Credible 2027 Elections</dd>
              <dt className="font-semibold text-gray-800 sm:pt-0.5">
                Duration
              </dt>
              <dd>
                72 Hours, From Friday 29th of May to Sunday, 31st of May, 2026.
              </dd>
            </dl>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="font-league text-display-xs md:text-display-sm font-semibold tracking-tight text-brand-600 mb-4">
              Media inquiries
            </h3>
            <p className="text-justify">
              For media inquiries, interviews, and partnership opportunities,
              please contact:
              <br />
              <a
                className="text-brand-600 underline hover:text-brand-700 font-medium"
                href="mailto:media@citizenmonitors.com"
              >
                media@citizenmonitors.com
              </a>
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-justify">
              <span className="font-league text-display-xs md:text-display-sm font-semibold text-brand-600">
                About:
              </span>{" "}
              Citizen Monitors is a civic accountability platform strengthening
              democracy through citizen participation, election monitoring, and
              evidence-based advocacy across Nigeria.
            </p>
          </div>

          <footer className="mt-10 pt-8 border-t border-gray-200">
            <p className="font-league text-lg font-semibold text-gray-800">
              Olajumoke Alawode-James
            </p>
            <p className="mt-1 text-justify text-gray-600">
              Spokesperson and Head of Communications, Citizen Monitors
            </p>
            <p className="mt-2">
              <a
                className="text-brand-600 font-medium underline hover:text-brand-700"
                href="tel:+2348033539465"
              >
                08033539465
              </a>
            </p>
          </footer>
        </article>
      ),
    },
  ],
};

export default press;
