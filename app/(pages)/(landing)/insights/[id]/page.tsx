import InsightPage from "@/app/components/landing/insights/InsightPage";
import insights from "@/app/data/insights/index";

export default async function Insight({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const insight = insights.find((insight) => insight.id === id);
  return insight ? (
    <InsightPage insight={insight} />
  ) : (
    <div className="min-h-[50vh] grid place-content-center">
      <p className="text-gray-500 text-sm text-center">
        We couldn't find the Insight you are looking for.
      </p>
    </div>
  );
}
