export type InsightSection = {
  id: string;
  heading: string;
  subHeading: string;
  content: React.ReactNode;
};
export type Insight = {
  id: string;
  title: string;
  shortTitle: string;
  featuredImage: string;
  readingTimeInMinutes: number;
  description?: string;
  sections: Array<InsightSection>;
};