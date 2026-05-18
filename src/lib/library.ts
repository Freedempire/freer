import type { CollectionEntry } from "astro:content";

export type BookEntry = CollectionEntry<"books">;
export type ChapterEntry = CollectionEntry<"chapters">;

export type LibraryPart = {
  title: string;
  order: number;
  chapters: ChapterEntry[];
};

export function slugFromEntry(entry: BookEntry | ChapterEntry) {
  return entry.id.replace(/\.mdx?$/, "");
}

export function chaptersForBook(book: BookEntry, chapters: ChapterEntry[]) {
  const bookSlug = slugFromEntry(book);
  return chapters
    .filter((chapter) => chapter.data.book === bookSlug)
    .sort((a, b) => {
      const partDiff = a.data.partOrder - b.data.partOrder;
      if (partDiff !== 0) return partDiff;
      return a.data.chapterOrder - b.data.chapterOrder;
    });
}

export function groupChaptersByPart(chapters: ChapterEntry[]) {
  const parts = new Map<string, LibraryPart>();

  chapters.forEach((chapter) => {
    const title = chapter.data.part || "Contents";
    const key = `${chapter.data.partOrder}:${title}`;
    const existing = parts.get(key);

    if (existing) {
      existing.chapters.push(chapter);
      return;
    }

    parts.set(key, {
      title,
      order: chapter.data.partOrder,
      chapters: [chapter],
    });
  });

  return Array.from(parts.values()).sort((a, b) => a.order - b.order);
}
