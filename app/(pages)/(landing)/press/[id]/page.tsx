import PressPage from '@/app/components/landing/press/PressPage';
import press from '@/app/data/press';
import React from 'react'
import type { Metadata } from 'next';

// Generate static params for all press releases
export async function generateStaticParams() {
  return press.map((article) => ({ id: article.id }));
}

// Generate dynamic metadata for each press release
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = press.find((p) => p.id === params.id);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.featuredImage ? [article.featuredImage] : [],
      type: 'article',
      url: `/press/${article.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export default async function Press({ params }: { params: { id: string } }) {
  const article = press.find((p) => p.id === params.id);
  return article ? (
    <PressPage article={article} />
  ) : (
    <div className="min-h-[50vh] grid place-content-center">
      <p className="text-gray-500 text-sm text-center">
        We couldn't find the article you are looking for.
      </p>
    </div>
  );
}
