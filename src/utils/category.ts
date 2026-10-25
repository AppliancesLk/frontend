const displayNames: Record<string, string> = {
  'back-cover': 'Back covers',
  'air-conditioner': 'Air conditioners',
};
export function formatCategoryName(name: string): string {
  if (displayNames[name.toLowerCase()]) return displayNames[name.toLowerCase()];
  const words = name.replace(/[-_]/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
