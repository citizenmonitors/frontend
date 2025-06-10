import { BaseLiveElectionResult, LiveElection } from "@/app/redux/types";
import formatNumber from "@/app/utils/formatNumber";
import { DocumentText } from "iconsax-react";
import React, { useMemo } from "react";
import { Bar, BarChart, Rectangle, ResponsiveContainer, XAxis, YAxis } from "recharts";

type AggregateAnalysisGraphProps = {
  liveElection: LiveElection;
  liveResultData: Map<string, BaseLiveElectionResult>;
  currentLiveResult: string;
  setCurrentLiveResult: React.Dispatch<React.SetStateAction<string>>;
};
export default function AggregateAnalysisGraph({
  liveElection,
  liveResultData,
  currentLiveResult,
  setCurrentLiveResult,
}: AggregateAnalysisGraphProps) {
  const { partyColors } = liveElection;
  const liveResult = liveResultData.get(currentLiveResult)!;

  const data = Object.entries(liveResult.aggregateAnalysis)
    .map(([party, votes]) => ({
      name: party,
      votes,
      fill: partyColors[party] || "black",
    }))
    .sort((a, b) => b.votes - a.votes);
  const maxVotesDigitLength = data.length ? `${data[0].votes}`.length : 0;
  const maxPartyNameLength = data.length
    ? [...data].sort((a, b) => b.name.length - a.name.length)[0].name.length
    : 0;

  return (
    <React.Fragment>
      <hr className="mb-4 border-gray-100 md:hidden" />
      <header className="flex gap-2 items-center mb-4">
        <DocumentText variant="Bold" className="text-bluegray-500 md:hidden" size={16} />
        <DocumentText
          variant="Bold"
          className="text-bluegray-500 hidden md:block"
          size={20}
        />
        <h3 className="text-sm md:text-lg text-gray-700">Aggregate Analysis</h3>
      </header>
      <div className="max-h-[256px] overflow-y-scroll">
        <ResponsiveContainer
          width="100%"
          height={data.length * 33}
          className="ring-1 h-fit"
        >
          <BarChart data={data} barSize={12} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              yAxisId={1}
              dataKey={"name"}
              width={10 * maxPartyNameLength - 2}
              tick={{ fill: "#667085", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              type="category"
            />
            <YAxis
              yAxisId={2}
              dataKey={"votes"}
              tick={{ fill: "#98A2B3", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={10 * maxVotesDigitLength}
              type="category"
              orientation="right"
              tickFormatter={(value) => formatNumber.commas(value)}
            />
            <Bar
              yAxisId={1}
              dataKey="votes"
              background={{ fill: "#EAECF0", radius: 4 }}
              activeBar={<Rectangle stroke="#344054" />}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              yAxisId={2}
              dataKey="votes"
              background={{ fill: "#EAECF0", radius: 4 }}
              activeBar={<Rectangle stroke="#344054" />}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <hr className="mt-4 border-gray-100 md:hidden" />
    </React.Fragment>
  );
}
