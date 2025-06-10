import { Tabs } from "antd";
import React from "react";
import VerifiedSubmissions from "./tabs/VerifiedSubmissions";
import IncidentReports from "./tabs/IncidentReports";
import SentimentAnalysis from "./tabs/SentimentAnalysis";

export default function ElectionTabs() {
  const liveResultTabs = [
    {
      key: "verified-submissions",
      label: "Verified Submissions",
      children: <VerifiedSubmissions />,
      active: true,
    },
    {
      key: "incident-reports",
      label: "Incident Reports",
      children: <IncidentReports />,
      active: true,
    },
    {
      key: "sentiment-analysis",
      label: "Sentiment Analysis",
      children: <SentimentAnalysis />,
    },
  ];

  return (
    <div className="flex flex-col">
      <Tabs items={liveResultTabs} id="elections-tab" />
    </div>
  );
}
