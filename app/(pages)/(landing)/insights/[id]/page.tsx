import InsightPage from "@/app/components/landing/insights/InsightPage";
import NewsInsightArticleView from "@/app/components/landing/insights/NewsInsightArticleView";
import insights from "@/app/data/insights/index";

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function Insight({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const insight = insights.find((insight) => insight.id === id);
  // Built-in case studies first; otherwise treat the id as a News & Insight slug
  return insight ? (
    <InsightPage insight={insight} />
  ) : (
    <NewsInsightArticleView slug={safeDecode(id)} />
  );
}
