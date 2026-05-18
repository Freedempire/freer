import { defineCollection, z } from "astro:content";

const optionalDate = z.preprocess(
  (value) => (value === null || value === "" ? undefined : value),
  z.coerce.date().optional(),
);

const optionalString = z.preprocess(
  (value) => (value === null || value === "" ? undefined : value),
  z.string().optional(),
);

const entrySchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: optionalDate,
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "active", "archived"]).default("active"),
  license: z.string().default("all-rights-reserved"),
  copyright: optionalString,
});

const bookSchema = entrySchema.extend({
  type: z.enum(["public-domain", "serial", "essay", "translation", "note"]).default("essay"),
  author: optionalString,
  language: z.string().default("zh"),
  source: optionalString,
});

const chapterSchema = entrySchema.extend({
  book: z.string(),
  part: optionalString,
  partOrder: z.number().default(1),
  chapterOrder: z.number().default(1),
  chapterLabel: optionalString,
});

const projectSchema = entrySchema.extend({
  stage: z.enum(["idea", "building", "stable", "paused"]).default("building"),
});

const photoSchema = entrySchema.extend({
  mood: z.string().default("archive"),
  image: optionalString,
  color: z.string().default("#d8e8f3"),
});

export const collections = {
  articles: defineCollection({ type: "content", schema: entrySchema }),
  notes: defineCollection({ type: "content", schema: entrySchema }),
  books: defineCollection({ type: "content", schema: bookSchema }),
  chapters: defineCollection({ type: "content", schema: chapterSchema }),
  projects: defineCollection({ type: "content", schema: projectSchema }),
  photos: defineCollection({ type: "content", schema: photoSchema }),
};
