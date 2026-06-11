# Field Notes

A responsive personal blog with Markdown-authored posts.

## Write a new post

### 1. Create the file

Add a Markdown file to `content/posts/`. Use a short, lowercase filename with
hyphens:

```text
content/posts/why-i-write.md
```

The filename becomes the post URL:

```text
posts/why-i-write.html
```

Renaming the Markdown file will therefore change the URL.

### 2. Add front matter

Every post must begin with metadata between two `---` lines:

```md
---
title: Why I write
date: 2026-06-10
category: Craft
excerpt: Writing is a way to preserve attention and discover what I actually think.
readTime: 6 min read
---
```

The fields are:

| Field | Required | Purpose |
| --- | --- | --- |
| `title` | Yes | Post title on the homepage and article page |
| `date` | Yes | Publication date in `YYYY-MM-DD` format |
| `category` | Yes | Homepage category label and filter value |
| `excerpt` | Yes | Short homepage summary and page description |
| `readTime` | No | Estimated reading time; defaults to `5 min read` |

Posts are sorted newest first using `date`.

The homepage currently has filters for `Technology`, `Life`, and `Craft`.
Using another category will still generate the post, but it will only appear
under the `All` filter until a matching button is added to `index.html`.

### 3. Write the article

Write standard Markdown after the front matter:

```md
---
title: Why I write
date: 2026-06-10
category: Craft
excerpt: Writing is a way to preserve attention and discover what I actually think.
readTime: 6 min read
---

The first paragraph introduces the essay.

## A section heading

Regular paragraphs can include **bold text**, *italics*, and
[links](https://example.com).

> Use blockquotes for quotations or ideas that deserve emphasis.

## Another section

- Lists are supported.
- Keep one blank line around headings, lists, and blockquotes.
```

Supported Markdown includes:

- Paragraphs and line breaks
- Level-two and deeper headings
- Bold and italic text
- Links
- Ordered and unordered lists
- Blockquotes
- Inline code and code blocks

The post title is generated from front matter, so do not add another
level-one `# Title` heading to the article body.

### 4. Add an image

Put article images in `assets/`, then reference them relative to the generated
post page:

```md
![A descriptive alt text](../assets/my-image.jpg)
```

Always provide useful alt text. Avoid spaces in image filenames.

### 5. Build and preview

After saving the Markdown file, regenerate the homepage and article pages:

```bash
npm run build
```

Start the local site:

```bash
npm run serve
```

Open [http://localhost:8000](http://localhost:8000).

Run `npm run build` again after every post change. The build:

1. Validates required front-matter fields.
2. Sorts posts by publication date.
3. Updates the homepage article list.
4. Generates one HTML page in `posts/` for each Markdown file.

## First-time setup

Install the project dependencies once:

```bash
npm install
```

Then use:

```bash
npm run build
npm run serve
```

## Edit or remove a post

To edit a post, change its file in `content/posts/` and rebuild.

To remove a post:

1. Delete its Markdown file from `content/posts/`.
2. Delete its generated HTML file from `posts/`.
3. Run `npm run build`.

Do not edit files in `posts/` directly. They are generated and will be
overwritten by the next build.

## Troubleshooting

`npm run build` reports a missing field:

- Check that `title`, `date`, `category`, and `excerpt` are present.
- Check that the front matter starts and ends with `---`.

The post date is rejected:

- Use the exact `YYYY-MM-DD` format, such as `2026-06-10`.

The post does not appear:

- Confirm the file ends in `.md`.
- Confirm it is directly inside `content/posts/`.
- Run `npm run build` and read any error shown in the terminal.

An image is broken:

- Confirm the file exists under `assets/`.
- Use `../assets/filename.jpg` in the Markdown.
- Check capitalization because deployed servers may treat filenames as
  case-sensitive.

## Personalize

Update the name, biography, social links, and email address in `index.html`.
Article listings are generated from Markdown, so edits inside the
`<!-- posts:start -->` section will be overwritten during the next build. The
generated hero image lives at `assets/coastal-dawn.png`.
