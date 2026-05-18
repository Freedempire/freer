import { collection, config, fields } from "@keystatic/core";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
] as const;

const licenseOptions = [
  { label: "All rights reserved - no reuse without permission", value: "all-rights-reserved" },
  { label: "CC BY 4.0 - attribution required", value: "cc-by-4.0" },
  { label: "CC BY-NC-SA 4.0 - non-commercial share-alike", value: "cc-by-nc-sa-4.0" },
  { label: "CC0 1.0 - waived rights where possible", value: "cc0-1.0" },
  { label: "Public domain - no known copyright restriction", value: "public-domain" },
  { label: "Custom - explain in source/copyright fields", value: "custom" },
] as const;

const tagList = fields.array(fields.text({ label: "Tag" }), {
  label: "Tags",
  itemLabel: (props) => props.value,
});

const contentBody = fields.markdoc({
  label: "Content",
  extension: "md",
  options: {
    image: {
      directory: "public/images/content",
      publicPath: "/images/content/",
    },
  },
});

const commonEntryFields = {
  title: fields.slug({
    name: {
      label: "Title",
      validation: { isRequired: true },
    },
    slug: {
      label: "Slug",
      description: "Used as the filename and URL segment.",
    },
  }),
  description: fields.text({
    label: "Description",
    multiline: true,
    validation: { isRequired: true },
  }),
  date: fields.date({
    label: "Date",
    defaultValue: { kind: "today" },
    validation: { isRequired: true },
  }),
  updated: fields.date({
    label: "Updated",
    description: "Optional. Leave empty unless this entry was materially revised.",
  }),
  tags: tagList,
  status: fields.select({
    label: "Status",
    options: statusOptions,
    defaultValue: "active",
  }),
  license: fields.select({
    label: "License",
    options: licenseOptions,
    defaultValue: "all-rights-reserved",
  }),
  copyright: fields.text({
    label: "Copyright",
    description: "Example: © freer.top. Leave empty for public-domain material.",
  }),
};

function writingCollection(label: string, path: `${string}/*`) {
  return collection({
    label,
    path,
    slugField: "title",
    format: { contentField: "content" },
    columns: ["date", "status", "license"],
    schema: {
      ...commonEntryFields,
      content: contentBody,
    },
  });
}

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "freer.top studio" },
  },
  collections: {
    articles: writingCollection("Articles", "src/content/articles/*"),
    notes: writingCollection("Notes", "src/content/notes/*"),
    projects: collection({
      label: "Projects",
      path: "src/content/projects/*",
      slugField: "title",
      format: { contentField: "content" },
      columns: ["date", "stage", "status"],
      schema: {
        ...commonEntryFields,
        stage: fields.select({
          label: "Stage",
          options: [
            { label: "Idea", value: "idea" },
            { label: "Building", value: "building" },
            { label: "Stable", value: "stable" },
            { label: "Paused", value: "paused" },
          ],
          defaultValue: "building",
        }),
        content: contentBody,
      },
    }),
    library: collection({
      label: "Library",
      path: "src/content/books/*",
      slugField: "title",
      format: { contentField: "content" },
      columns: ["date", "type", "license"],
      schema: {
        ...commonEntryFields,
        type: fields.select({
          label: "Type",
          options: [
            { label: "Public-domain text", value: "public-domain" },
            { label: "Serial fiction", value: "serial" },
            { label: "Essay collection", value: "essay" },
            { label: "Translation", value: "translation" },
            { label: "Note", value: "note" },
          ],
          defaultValue: "essay",
        }),
        author: fields.text({
          label: "Author",
          description: "Optional. Use for public-domain books, translations, or external texts.",
        }),
        language: fields.text({
          label: "Language",
          defaultValue: "zh",
          validation: { isRequired: true },
        }),
        source: fields.text({
          label: "Source",
          multiline: true,
          description: "Source URL, bibliographic note, or rights note.",
        }),
        content: contentBody,
      },
    }),
    chapters: collection({
      label: "Book Chapters",
      path: "src/content/chapters/*",
      slugField: "title",
      format: { contentField: "content" },
      columns: ["book", "partOrder", "chapterOrder", "status"],
      schema: {
        ...commonEntryFields,
        book: fields.relationship({
          label: "Book",
          collection: "library",
          validation: { isRequired: true },
          description: "Select the parent book or serial in Library.",
        }),
        part: fields.text({
          label: "Part",
          description: "Optional. Example: Part 1, Volume I, Book One.",
        }),
        partOrder: fields.number({
          label: "Part order",
          defaultValue: 1,
          step: 1,
          validation: { isRequired: true, min: 1 },
        }),
        chapterOrder: fields.number({
          label: "Chapter order",
          defaultValue: 1,
          step: 1,
          validation: { isRequired: true, min: 1 },
        }),
        chapterLabel: fields.text({
          label: "Chapter label",
          description: "Optional display label, e.g. Chapter 1 or 第三章.",
        }),
        content: contentBody,
      },
    }),
    photos: collection({
      label: "Photos",
      path: "src/content/photos/*",
      slugField: "title",
      format: { contentField: "content" },
      columns: ["date", "mood", "status", "license"],
      schema: {
        ...commonEntryFields,
        mood: fields.text({
          label: "Mood",
          defaultValue: "archive",
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: "Image",
          directory: "public/images/photos",
          publicPath: "/images/photos/",
        }),
        color: fields.text({
          label: "Fallback color",
          defaultValue: "#d8e8f3",
          validation: {
            isRequired: true,
            pattern: {
              regex: /^#[0-9a-fA-F]{6}$/,
              message: "Use a six-digit hex color, e.g. #d8e8f3.",
            },
          },
        }),
        content: fields.emptyContent({ extension: "md" }),
      },
    }),
  },
});
