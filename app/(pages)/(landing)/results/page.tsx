import { redirect } from "next/navigation";

/** Legacy /results path — redirects to /collation */
export default function ResultsRedirectPage() {
  redirect("/collation");
}
