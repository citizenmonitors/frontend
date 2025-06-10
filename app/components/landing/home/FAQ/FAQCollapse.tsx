"use client";
import { Collapse } from "antd";
import { AddSquare, MinusSquare } from "iconsax-react";
import React, { useMemo } from "react";
import { v4 } from "uuid";

const FAQContent = [
  {
    title: "How do I sign up?",
    body: `
        To join Citizen Monitors, simply click on the “Sign Up” button on the homepage or “Become Electorally Powerful”, and then the journey begins.
     `,
  },
  {
    title: "Who is a Volunteer?",
    body: `
        A Volunteer is someone who wants to support the platform in a light but meaningful way. Volunteers are able to view live election data, participate in platform polls and surveys, flag false results/incidents and upload polling unit observations during elections.
     `,
  },
  {
    title: "Who is an Observer?",
    body: `
        On the other hand, an Observer takes on a more official role. Observers are verified and accredited users responsible for monitoring elections in their own polling units and uploading official results or incident reports with supporting evidence. Each polling unit will have only one registered Observer, and a valid Permanent Voter’s Card (PVC) is required for verification.
     `,
  },
  {
    title: "Will I be paid to observe in my polling unit?",
    body: `
        Observers may be compensated for their monitoring work. However, the platform does not promise fixed payments. Instead, any financial reward will depend on the extent to which the data submitted generates commercial value. Our Terms and Conditions explain this in more detail.
     `,
  },
  {
    title: "Do volunteers have to upload election data?",
    body: `
        No, volunteers are not required to upload data. That said, we strongly encourage it. When volunteers upload information—such as polling unit observations or even result sheets—it helps you keep proper records and to also use that record to evidentially verify what the official observer may have submitted. This collaboration enhances data accuracy and ensures a more transparent record of what happened during elections in your polling unit.
     `,
  },
  {
    title: "Can I upload results for another polling unit different from mine?",
    body: `
        No. You can only upload results or reports for your registered polling unit. Any result submitted for a different polling unit will be invalidated. This helps ensure the data remains traceable, trustworthy, and local to your actual presence.
     `,
  },
  {
    title: "Can I remain anonymous while using the platform?",
    body: `
        Yes, to a certain extent. Volunteers can participate in many platform activities without being recognized. The key reason for not allowing full anonymity is because Volunteers can perform the high-trust task of appraising observer uploads.
     `,
  },
  {
    title: "What kind of evidence can I upload during an election?",
    body: `
       You can upload clear photographs of official result sheets (EC8A), videos showing result announcements, or GPS-tagged images and or videos showing incidents at polling units. This evidence helps establish the credibility of the information you share.
     `,
  },
  {
    title: "Will Citizen Monitors be helping with Collation of Results?",
    body: `
       Yes, Uploaded results or Incident reports from your polling unit is immediately collated with that of other polling units from your Ward, LGA and State (depending on election being held) after passing through data quality checks. Successfully flagged results will be manually reviewed.
     `,
  },
  {
    title: "Why was my result upload rejected?",
    body: `
      Your upload may be automatically rejected for several reasons. This can be for over voting - an offence under Section 51(2) of the Electoral Act 2022, or when the sum of valid votes and rejected ballots does not match the total number of used ballots, or when that total is inconsistent with the number of accredited voters. These kinds of mismatches fall under Section 64(4) of the Electoral Act 2022, which guides result reconciliation. In such cases, the system will prevent submission and ask you to review the result or submit an incident report, as it may indicate human error or manipulation.
     `,
  },
  {
    title: "What should I do if I experience a network error or my upload fails?",
    body: `
       If your upload fails due to a network issue, first ensure you have a stable internet connection. Also check that your uploaded file is within the required file size and in the correct format (image or video). If the issue persists, you can use the “Contact Us” feature directly on your dashboard to report the problem and receive assistance.
     `,
  },
  {
    title: "How safe is my information on Citizen Monitors?",
    body: `
       We take privacy and data security very seriously. The platform uses secure infrastructure, encrypts data, and follows global best practices in data protection and governance. Your personal information is never sold or shared without explicit consent, and we comply with all relevant privacy policies and regulations (NDPR and GDPR).
     `,
  },
];

function FAQCollapse() {
  const PanelHeader = ({ children }: any) => (
    <h3 className="faq-panel-header text-gray-700 md:text-xl font-semibold">
      {children}
    </h3>
  );
  const PanelContent = ({ children }: any) => <p className="text-gray-600">{children}</p>;

  const FAQItems = useMemo(
    () =>
      FAQContent.map((section) => ({
        key: v4(),
        label: <PanelHeader>{section.title}</PanelHeader>,
        children: <PanelContent>{section.body}</PanelContent>,
      })),
    [FAQContent]
  );

  return (
    <Collapse
      size="large"
      items={FAQItems}
      bordered={false}
      expandIcon={({ isActive }) => (
        <div className="expand-icon relative h-[24px] w-[24px]">
          <AddSquare
            size={24}
            variant="Linear"
            className={`absolute-center transition-all text-gray-700 ${
              isActive ? "rotate-90 opacity-0" : ""
            }`}
          />
          <MinusSquare
            size={24}
            variant="Linear"
            className={`absolute-center transition-all text-brand-500 ${
              isActive ? "" : "-rotate-90 opacity-0"
            }`}
          />
        </div>
      )}
    />
  );
}

export default FAQCollapse;
