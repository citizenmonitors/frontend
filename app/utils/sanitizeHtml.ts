import DOMPurify from "dompurify";

/**
 * Cleans HTML from the API (articles, comments) before it's rendered with
 * dangerouslySetInnerHTML. Returns "" on the server, where there's no DOM.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html || typeof window === "undefined") return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "form", "input", "button", "iframe"],
    FORBID_ATTR: ["style"],
  });
}
