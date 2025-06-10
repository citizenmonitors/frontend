export default function getRootPath(path: string) {
  // Example paths: "/", "/home#hello", "/home/world#hello"

  // Remove query string and hash
  const cleanedPath = path.split("?")[0].split("#")[0];

  // Remove trailing slash
  const trimmedPath = cleanedPath.endsWith("/") ? cleanedPath.slice(0, -1) : cleanedPath;

  // Split path into segments
  const segments = trimmedPath.split("/").filter(Boolean);

  // Check if the path has at least one segment
  if (segments.length === 0) {
    return "/";
  }
  // Get the root path by joining the first segment with a trailing slash
  const rootPath = `/${segments[0]}`;
  return rootPath;
}