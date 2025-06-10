export type PressSection = {
  id: string;
  heading: string;
  content: React.ReactNode;
};
export type Press = {
  id: string;
  author: string;
  date: string;
  readingTimeInMinutes: number;
  title: string;
  shortTitle: string;
  featuredImage: string;
  sections: Array<PressSection>;
};