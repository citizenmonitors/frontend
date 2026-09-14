import { redirect } from "next/navigation";

/** Old public path — keep a redirect so bookmarks still work */
export default function ElectionsRedirect() {
  redirect("/results");
}
