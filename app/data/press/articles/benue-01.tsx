import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "benue-01",
  shortTitle: "Benue Massacre",
  title:
    "Benue Massacre: We Asked for Leadership, Not Neutrality in the Face of Evil",
  readingTimeInMinutes: 5,
  date: "2025-06-18",
  author: "Press Office",
  featuredImage: "/assets/press/articles/benue-01.png",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full h-[346px]">
            <Image
              src="/assets/press/articles/benue-01.png"
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
            Citizen Monitors is deeply alarmed by the President’s response to
            the recent massacre in Benue State, where over 100, possibly 200
            Nigerians were slaughtered in cold blood. The nation expected moral
            clarity and urgent action. Instead, we received a generic statement
            marked by false equivalence, political deflection, and a dangerous
            lack of empathy.
          </p>
          <p className="text-justify">
            To call this a “conflict with sides” is a grave mischaracterization.
            Civilians - many already displaced were butchered in their sleep.
            This is not a time for balance. It is a time for accountability.
          </p>
          <p className="text-justify">
            The President’s decision to direct security agencies to act “on all
            sides” of an undefined conflict ignores the asymmetry of violence
            and evades the state’s responsibility to protect the vulnerable. His
            call for restraint from “political and community leaders” shifts the
            blame away from federal inaction and years of unchecked killings.
          </p>
          <p className="text-justify">
            Furthermore, we urge the judiciary to expedite the hearing of suits
            challenging this unconstitutional action and to uphold its role as
            the guardian of the Constitution. The courts must act decisively to
            check any overreach of executive authority and to preserve the
            democratic framework of our nation.
          </p>
          <p className="text-justify">
            Democracy thrives when the will of the people is respected and
            upheld. Any deviation from constitutional governance not only
            threatens the stability of Rivers State but also endangers the
            democratic fabric of Nigeria as a whole.
          </p>
          <p className="text-justify">
            <b>We ask:</b>
            <ul className="list-disc list-outside ml-8">
              <li>Who are these ‘sides’? Name them.</li>
              <li>Where is the justice for the dead?</li>
              <li>
                What does a Wednesday visit accomplish after yet another
                preventable bloodbath?
              </li>
            </ul>
          </p>

          <p className="text-justify">
            Calling for dialogue while bodies are still being counted is not
            statesmanship — it’s abandonment dressed as diplomacy.
          </p>

          <p className="text-justify">
            <b>We demand:</b>
            <ul className="list-disc list-outside ml-8">
              <li>
                A full withdrawal and retraction of this tone-deaf, equivocal
                statement
              </li>
              <li>
                Immediate naming, arrest, and prosecution of perpetrators - not
                vague directives
              </li>
              <li>
                Real security deployment to vulnerable areas - not photo ops
              </li>
            </ul>
          </p>

          <p className="text-justify">
            Leadership must begin with truth. And the truth is that this
            massacre happened on the government’s watch. If the current
            leadership cannot acknowledge that, or take swift, unambiguous
            action - then it is time for that leadership to step aside.
          </p>
        </article>
      ),
    },
  ],
};

export default press;
