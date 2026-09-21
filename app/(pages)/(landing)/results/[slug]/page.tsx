import { redirect } from "next/navigation";

/** Legacy /results/[slug] — redirects to /collation/[slug] */
export default function ResultsSlugRedirectPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/collation/${params.slug}`);
}
