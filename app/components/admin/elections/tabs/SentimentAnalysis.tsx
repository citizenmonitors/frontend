import React from "react";
import { useAppSelector } from "@/app/hooks/redux";
import { binarySelectOptions, ratingSelectOptions } from "@/app/data/form";
import SentimentAnalysisBarChart from "@/app/components/portal/live/graphs/survey/SentimentAnalysisBarChart";
import SentimentAnalysisPieChart from "@/app/components/portal/live/graphs/survey/SentimentAnalysisPieChart";

export default function SentimentAnalysis() {
  const electionData = useAppSelector((state) => state.adminElection.electionData)!;

  return (
    <section>
      {electionData.sentimentAnalysis && electionData.sentimentAnalysis.chart ? (
        <div className="grid gap-8">
          <div className="grid grid-cols-12 gap-5">
            <div className="md:p-7 md:bg-white rounded-md col-span-12 lg:col-span-7 h-full">
              <SentimentAnalysisBarChart
                title="Rate today's election in your polling unit?"
                liveElection={electionData}
                field="voteRating"
                options={ratingSelectOptions.map((option) => option.value)}
                colors={["#05A39C", "#4E5BA6", "#F04438"]}
              />
            </div>

            <div className="md:p-7 md:bg-white rounded-md col-span-12 lg:col-span-5 h-full">
              <SentimentAnalysisPieChart
                liveElection={electionData}
                field="voteRating"
                options={ratingSelectOptions.map((option) => option.value)}
                colors={["#05A39C", "#4E5BA6", "#F04438"]}
              />
            </div>
          </div>

          <hr className="border-gray-300" />

          <div className="grid grid-cols-12 gap-5">
            <div className="md:p-7 md:bg-white rounded-md col-span-12 lg:col-span-7 h-full">
              <SentimentAnalysisBarChart
                title="Instances of vote buying?"
                liveElection={electionData}
                field="voteBuying"
                options={binarySelectOptions.map((option) => option.value)}
                colors={["#05A39C", "#F04438"]}
              />
            </div>

            <div className="md:p-7 md:bg-white rounded-md col-span-12 lg:col-span-5 h-full">
              <SentimentAnalysisPieChart
                liveElection={electionData}
                field="voteBuying"
                options={binarySelectOptions.map((option) => option.value)}
                colors={["#05A39C", "#F04438"]}
              />
            </div>
          </div>

          <hr className="border-gray-300" />

          <div className="grid grid-cols-12 gap-5">
            <div className="md:p-7 md:bg-white rounded-md col-span-12 lg:col-span-7 h-full">
              <SentimentAnalysisBarChart
                title="Instances of voter intimidation?"
                liveElection={electionData}
                field="voterIntimidation"
                options={binarySelectOptions.map((option) => option.value)}
                colors={["#05A39C", "#F04438"]}
              />
            </div>

            <div className="md:p-7 md:bg-white rounded-md col-span-12 lg:col-span-5 h-full">
              <SentimentAnalysisPieChart
                liveElection={electionData}
                field="voterIntimidation"
                options={binarySelectOptions.map((option) => option.value)}
                colors={["#05A39C", "#F04438"]}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-1 mt-12">
          <h3 className="text-gray-700 font-medium leading-tight text-center">
            No data available
          </h3>
          <p className="text-sm text-gray-500 text-center">
            There are currently no available submissions, Please check again later.
          </p>
        </div>
      )}
    </section>
  );
}
