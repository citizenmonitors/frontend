export type AcademyArticleSummary = {
  slug: string;
  title: string;
  category: string;
  readMinutes: number;
  summary: string;
};

export type AcademyListResponse = {
  title: string;
  subtitle: string;
  articles: AcademyArticleSummary[];
};

export type AcademyArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type AcademyArticleResponse = AcademyArticleSummary & {
  sections: AcademyArticleSection[];
};
