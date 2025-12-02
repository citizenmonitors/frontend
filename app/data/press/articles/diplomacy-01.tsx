import Image from "next/image";
import { Press } from "../types";
import { v4 } from "uuid";

const press: Press = {
  id: "diplomacy-01",
  shortTitle: "Nigeria's Diplomatic Excellence",
  title:
    "Nigeria's Diplomatic Excellence: We Have the Talent, Now Let the Best Represent Us",
  description:
    "Citizen Monitors reflects on Nigeria's rich diplomatic history and calls for merit-based diplomatic appointments that honor our legacy of excellence.",
  readingTimeInMinutes: 6,
  date: "2025-12-02",
  author: "Press Office",
  featuredImage: "/assets/press/articles/diplomacy-01.png",
  sections: [
    {
      id: "press-section-1",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <div className="w-full max-h-[346px]">
            <Image
              src="/assets/press/articles/diplomacy-01.png"
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
            We are not short of capable people. Our diplomatic history proves it. From the very beginning, we produced men and women who walked into the world's biggest rooms and commanded respect through sheer character and competence.
          </p>
          <p className="text-justify">
            Jaja Wachukwu set the example in 1960 when he raised our flag at the United Nations. He spoke boldly, thought clearly, and carried himself in a way that made the world pay attention to a young nation finding its voice.
          </p>
          <p className="text-justify">
            Others followed in the same spirit. Simeon Adebo, Edwin Ogbu, and their peers helped shape Nigeria's early identity abroad, at a time when Africa was still fighting to be heard.
          </p>
        </article>
      ),
    },
    {
      id: "press-section-3",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <p className="text-justify">
            In the decades that followed, we saw figures like Maitama Sule, Joseph Garba, and Ibrahim Gambari take Nigeria to even greater heights. Garba became President of the UN General Assembly. Gambari went on to serve at the highest levels of the UN. These were people whose names opened doors not because of political connections but because of the respect they earned through their work.
          </p>
          <p className="text-justify">
            Our ambassadors to major capitals were no different. Udochi, Olisemeka, Obiozor, Aminu in Washington; Mbu, Kolade and others in London, they carried Nigeria's image with dignity and depth.
          </p>
          <p className="text-justify">
            Women like Joy Ogwu, Maria Laose, and Uzoma Emenike proved that excellence has no gender. And of course, Emeka Anyaoku's leadership of the Commonwealth remains one of Nigeria's proudest diplomatic achievements.
          </p>
          <p className="text-justify">
            This is the kind of pedigree we have. It is the standard we once held ourselves to. And, need to continue to hold ourselves to.
          </p>
        </article>
      ),
    },
    {
      id: "press-section-4",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <p className="text-justify">
            Which is why this moment matters. The world is shifting, economically, politically, and strategically. We are under pressure on many fronts. Our global reputation needs rebuilding, and our national interests need strong, steady hands to defend them.
          </p>
          <p className="text-justify">
            This is not the time for diplomatic appointments based on favour or loyalty. It is the time for people of integrity, men and women who understand the weight of representing our nation, not themselves. People who can speak with conviction, negotiate intelligently, and earn the kind of respect that cannot be bought or forced.
          </p>
        </article>
      ),
    },
    {
      id: "press-section-5",
      heading: "",
      content: (
        <article className="grid gap-5 text-gray-700">
          <p className="text-justify">
            We have the talent na! We always have. What we need now is so simple: let the best among us represent all of us.
          </p>
          <p className="text-justify">
            Anything less is too costly for the moment we are in. Let's not lose sight of what is at stake.
          </p>
        </article>
      ),
    },
  ],
};

export default press;

