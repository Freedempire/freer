import type { CollectionEntry } from "astro:content";

type Entry =
  | CollectionEntry<"articles">
  | CollectionEntry<"notes">
  | CollectionEntry<"books">
  | CollectionEntry<"projects">
  | CollectionEntry<"photos">;

export function byDateDesc(a: Entry, b: Entry) {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getExcerpt(entry: Entry) {
  return entry.data.description;
}

export function entrySlug(entry: Entry) {
  return entry.id.replace(/\.mdx?$/, "");
}
