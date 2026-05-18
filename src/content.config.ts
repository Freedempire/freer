import { defineCollection, z } from "astro:content";

const entrySchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "active", "archived"]).default("active"),
});

const bookSchema = entrySchema.extend({
  author: z.string().optional(),
  language: z.string().default("zh"),
  source: z.string().optional(),
  license: z.string().default("public-domain"),
});

const projectSchema = entrySchema.extend({
  stage: z.enum(["idea", "building", "stable", "paused"]).default("building"),
});

export const collections = {
  articles: defineCollection({ type: "content", schema: entrySchema }),
  notes: defineCollection({ type: "content", schema: entrySchema }),
  books: defineCollection({ type: "content", schema: bookSchema }),
  projects: defineCollection({ type: "content", schema: projectSchema }),
};
