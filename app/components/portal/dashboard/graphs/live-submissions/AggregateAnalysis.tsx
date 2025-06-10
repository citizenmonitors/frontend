import { useAppSelector } from "@/app/hooks/redux";
import { BaseLiveElectionResult } from "@/app/redux/types";
import formatNumber from "@/app/utils/formatNumber";
import { DocumentText } from "iconsax-react";
import React, { useMemo } from "react";
import { Bar, BarChart, Rectangle, ResponsiveContainer, XAxis, YAxis } from "recharts";

type LiveSubmissionsDataProps = {
  singleLiveResultData: Map<string, BaseLiveElectionResult>;
  activeSingleLiveResult: string;
};
export default function AggregateAnalysis({
  singleLiveResultData,
  activeSingleLiveResult,
}: LiveSubmissionsDataProps) {
  const { partyColors } = useAppSelector((state) => state.activity.activityLiveResult!);

  function getChartData() {
    const data = Object.entries(
      singleLiveResultData.get(activeSingleLiveResult)!.aggregateAnalysis
    )
      .map(([party, votes]) => ({
        name: party,
        votes: votes,
        fill: partyColors[party],
      }))
      .sort((a, b) => b.votes - a.votes);

    return { data };
  }

  const { data } = useMemo(getChartData, [singleLiveResultData, activeSingleLiveResult]);
  const maxVotesDigitLength = data.length ? `${data[0].votes}`.length : 0;
  const maxPartyNameLength = data.length
    ? [...data].sort((a, b) => b.name.length - a.name.length)[0].name.length
    : 0;

  return (
    <React.Fragment>
      <hr className="mb-4 border-gray-100 md:hidden" />
      <header className="flex items-center gap-2 mb-4">
        <DocumentText variant="Bold" className="text-bluegray-500 md:hidden" size={16} />
        <DocumentText
          variant="Bold"
          className="hidden text-bluegray-500 md:block"
          size={20}
        />
        <h3 className="text-sm text-gray-700 md:text-lg">Aggregate Analysis</h3>
      </header>
      <div className="max-h-[256px] overflow-y-scroll">
        <ResponsiveContainer
          width="100%"
          height={data.length * 33}
          className="ring-1 h-fit"
        >
          <BarChart data={data} barSize={8} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              yAxisId={1}
              dataKey={"name"}
              width={10 * maxPartyNameLength}
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
