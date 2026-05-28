export function slugifyName(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return (slug || "workspace").slice(0, 48);
}

export function withRandomSuffix(slug: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  const base = slug.slice(0, 40).replace(/-+$/g, "");
  return `${base}-${suffix}`;
}
