import React from "react";
import VerifiedSubmissions from "./tabs/VerifiedSubmissions";
import SentimentAnalysis from "./tabs/SentimentAnalysis";
import { Tabs } from "antd";
import IncidentReport from "./tabs/IncidentReports";

export default function LiveTabs() {
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
      children: <IncidentReport />,
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
      <Tabs items={liveResultTabs} id="elections-tab"/>
    </div>
  );
}
