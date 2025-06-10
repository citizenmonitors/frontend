import PressPage from '@/app/components/landing/press/PressPage';
import press from '@/app/data/press';
import React from 'react'

export default async function Press({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const article = press.find((press) => press.id === id);
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
