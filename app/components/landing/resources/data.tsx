import { v4 } from "uuid";
import ResourceGuidelineCard from "./ResourceGuidelineCard";

export const guidelineCardsMap = {
  voterRegistration: (
    <ResourceGuidelineCard>
      <h3 className="font-league font-bold text-display-xs text-gray-700">
        Voter Registration
      </h3>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">Eligibility:</div>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>Must be a Nigerian citizen, 18 years or older. (Section 12(1))</li>
          <li>
            Must not have been convicted of any election-related offense within the past
            10 years. [Section 12(2)]
          </li>
        </ul>
      </div>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">Display of Voters’ Register:</div>
        <p>
          INEC must display the voters’ register publicly for at least 7 days for
          corrections or objections. [Section 19(1)]
        </p>
      </div>
    </ResourceGuidelineCard>
  ),
  voterRights: (
    <ResourceGuidelineCard>
      <h3 className="font-league font-bold text-display-xs text-gray-700">
        Rights of Voters
      </h3>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">Before Voting:</div>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>
            Citizens have the right to inspect the voters’ register and file objections if
            a name is included improperly. [Section 19(3)]
          </li>
          <li>
            Voters have the right to campaign for their preferred candidate. [Section
            94(1)]
          </li>
          <li>
            No one can be coerced or threatened to vote for a particular candidate.
            (Section 128)
          </li>
        </ul>
      </div>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">During Voting:</div>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>Voters have the right to a secret ballot. (Section 122)</li>
          <li>
            Voters must not be denied the right to vote as long as they are accredited and
            have a valid PVC. [Section 47(1)]
          </li>
          <li>
            Voters can stay at a distance to witness vote counting and ensure
            transparency. (Section 64(1))
          </li>
        </ul>
      </div>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">After Voting:</div>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>
            Citizens have the right to challenge election results at the tribunal if they
            suspect irregularities. (Section 130)
          </li>
        </ul>
      </div>
    </ResourceGuidelineCard>
  ),
  electionProcess: (
    <ResourceGuidelineCard>
      <h3 className="font-league font-bold text-display-xs text-gray-700">
        Electoral Offenses and Penalties
      </h3>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">Vote Buying and Selling:</div>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>
            Offering money, goods, or services to influence voters is an offense. [Section
            121(1)]
          </li>
          <li>
            Penalty: Fine of ₦500,000 or imprisonment for 12 months, or both. [Section
            121(2)]
          </li>
        </ul>
      </div>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">Impersonation and Multiple Voting:</div>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>
            Voting more than once or impersonating another voter is a crime. (Section 114)
          </li>
          <li>
            Penalty: ₦100,000 fine or imprisonment for 6 months, or both. (Section 117)
          </li>
        </ul>
      </div>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">Obstructing the Election Process:</div>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>
            Any act that disrupts the election or intimidates voters is punishable.
            [Section 129(1)]
          </li>
        </ul>
      </div>
    </ResourceGuidelineCard>
  ),
  voterInclusivity: (
    <ResourceGuidelineCard>
      <h3 className="font-league font-bold text-display-xs text-gray-700">
        Inclusivity and Accessibility
      </h3>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">Support for Disabled Voters:</div>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>
            INEC must provide facilities for persons with disabilities and special needs
            to vote without difficulty. [Section 54(1)]
          </li>
        </ul>
      </div>
      <div className="text-gray-700 flex flex-col gap-4">
        <div className="text-lg font-semibold">Gender and Youth Participation:</div>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>
          Parties are encouraged to include women, youth, and people with disabilities as candidates and in party leadership. [Section 2(c)]
          </li>
          
        </ul>
      </div>
    </ResourceGuidelineCard>
  ),
};

export const resourceVideos = [
  {
    id: v4(),
    title: "How to Sign Up or Register on Citizen Monitors",
    description:
      "Ready to become part of Nigeria’s data-driven electoral movement? In this quick guide, we walk you through how to register on Citizen Monitors—step-by-step. From verifying your email to choosing your polling unit and selecting your role, this video gives you everything you need to get started.",
    youtubeId: "NN01IqiA72Y",
  },
  {
    id: v4(),
    title: "A Tour of the Citizen Monitors Platform",
    description:
      "Get familiar with all the key features on the Citizen Monitors platform—from uploading results to tracking real-time election insights. This tour shows you where everything lives, how to use it, and how to support our mission for transparent elections.",
    youtubeId: "M-zMp25Maxk",
  },
  {
    id: v4(),
    title: "Understanding the Roles: Volunteer and Observer",
    description:
      "Not sure whether to register as a Volunteer or an Observer on Citizen Monitors? This short video breaks down both roles so you can choose how you want to contribute to election accountability in Nigeria. Whether you’re monitoring results or submitting verified data, your role matters.",
    youtubeId: "AZU4eal2ul0",
  },
  {
    id: v4(),
    title: "Uploading Election Data or Incident Reports",
    description:
      "Learn how to submit verified election results directly from your polling unit using Citizen Monitors. This video guides you through result upload, incident reporting, and ensuring your data passes electoral integrity checks.",
    youtubeId: "bD5TDOzF9B0",
  },
  {
    id: v4(),
    title: "Holding Your Polling Unit Accountable - A Guide",
    description:
      "Login with Your Credentials. Start by logging in with your correct details to access your portal dashboard. Access Polling Unit Results. On your dashboard, click on “View Your Polling Unit Result”...",
    youtubeId: "cw8PRoxMyog",
  },
];