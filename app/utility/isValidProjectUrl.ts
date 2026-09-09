export function isValidProjectUrl(url: string | undefined) {
  if (!url?.trim()) return true;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return false;
  }
}
