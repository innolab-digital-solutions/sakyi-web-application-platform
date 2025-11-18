export function truncateText(text: string, maxWords: number = 20): string {
  if (!text) return "-";

  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;

  return words.slice(0, maxWords).join(" ") + "...";
}
