import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "rivers-01",
  shortTitle: "Democracy Under Siege",
  title:
    "Democracy Under Siege: Tinubu’s Unconstitutional Takeover in Rivers State Must Be Resisted",
  readingTimeInMinutes: 5,
  date: "2025-03-19",
  author: "Press Office",
  featuredImage: "/assets/press/articles/rivers-01.png",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full h-[346px]">
            <Image
              src="/assets/press/articles/rivers-01.png"
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
            The recent declaration of a state of emergency in Rivers State by President
            Bola Ahmed Tinubu, resulting in the suspension of Governor Siminalayi Fubara,
            his deputy, and the state’s House of Assembly, is a direct affront to
            Nigeria’s constitutional democracy. The appointment of retired Vice Admiral
            Ibok-Ete Ibas as the sole administrator of the state further exacerbates
            concerns regarding the erosion of democratic principles and the rule of law.
          </p>
          <p className="text-justify">
            The Nigerian Constitution delineates clear procedures for addressing
            governance challenges within states, none of which endorse the unilateral
            removal of duly elected officials without due process. The suspension of the
            executive and legislative branches in Rivers State undermines the foundational
            tenets of federalism and sets a dangerous precedent for the arbitrary exercise
            of executive power.
          </p>
          <p className="text-justify">
            We stand in solidarity with the people of Rivers State and call upon all
            Nigerians to peacefully resist this unconstitutional usurpation of their
            democratic rights. It is imperative that civil society organizations, legal
            practitioners, and all stakeholders advocate for the immediate reinstatement
            of the elected government in Rivers State.
          </p>
          <p className="text-justify">
            Furthermore, we urge the judiciary to expedite the hearing of suits
            challenging this unconstitutional action and to uphold its role as the
            guardian of the Constitution. The courts must act decisively to check any
            overreach of executive authority and to preserve the democratic framework of
            our nation.
          </p>
          <p className="text-justify">
            Democracy thrives when the will of the people is respected and upheld. Any
            deviation from constitutional governance not only threatens the stability of
            Rivers State but also endangers the democratic fabric of Nigeria as a whole.
          </p>
        </article>
      ),
    },
  ],
};

export default press;
