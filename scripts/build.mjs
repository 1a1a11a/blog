import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDirectory = path.join(root, "content", "posts");
const outputDirectory = path.join(root, "posts");
const indexPath = path.join(root, "index.html");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const requiredFields = ["title", "date", "category", "excerpt"];

const files = (await readdir(contentDirectory))
  .filter((file) => file.endsWith(".md"))
  .sort();

const posts = await Promise.all(
  files.map(async (file) => {
    const slug = file.replace(/\.md$/, "");
    const source = await readFile(path.join(contentDirectory, file), "utf8");
    const { data, content } = matter(source);
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length) {
      throw new Error(`${file} is missing: ${missingFields.join(", ")}`);
    }

    const dateValue =
      data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date);
    const date = new Date(`${dateValue}T12:00:00`);
    if (Number.isNaN(date.getTime())) {
      throw new Error(`${file} has an invalid date: ${data.date}`);
    }

    return {
      slug,
      title: String(data.title),
      date,
      category: String(data.category),
      excerpt: String(data.excerpt),
      readTime: String(data.readTime || "5 min read"),
      html: await marked.parse(content),
    };
  })
);

posts.sort((a, b) => b.date - a.date);

const articleRows = posts
  .map((post, index) => {
    const number = String(index + 1).padStart(2, "0");
    const dateParts = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).formatToParts(post.date);
    const month = dateParts.find((part) => part.type === "month").value;
    const day = dateParts.find((part) => part.type === "day").value;
    const year = dateParts.find((part) => part.type === "year").value;

    return `          <article class="article-row reveal" id="article-${number}" data-category="${escapeHtml(post.category.toLowerCase())}">
            <a href="posts/${escapeHtml(post.slug)}.html" aria-label="Read ${escapeHtml(post.title)}">
              <div class="article-number">${number}</div>
              <div class="article-copy">
                <p class="article-meta">${escapeHtml(post.category)} · ${escapeHtml(post.readTime)}</p>
                <h3>${escapeHtml(post.title)}</h3>
                <p>${escapeHtml(post.excerpt)}</p>
              </div>
              <div class="article-date">${month} ${day}<br />${year}</div>
              <span class="article-arrow" aria-hidden="true">↗</span>
            </a>
          </article>`;
  })
  .join("\n\n");

const indexSource = await readFile(indexPath, "utf8");
const updatedIndex = indexSource.replace(
  /(\s*<!-- posts:start -->)[\s\S]*?(<!-- posts:end -->)/,
  `$1\n${articleRows}\n          $2`
);

await writeFile(indexPath, updatedIndex);
await mkdir(outputDirectory, { recursive: true });

const postTemplate = (post) => {
  const displayDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(post.date);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(post.excerpt)}" />
    <title>${escapeHtml(post.title)} — Juncheng Yang</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../styles.css" />
    <link rel="stylesheet" href="../post.css" />
  </head>
  <body class="post-page">
    <a class="skip-link" href="#article">Skip to article</a>
    <header class="post-site-header">
      <a class="wordmark" href="../index.html" aria-label="Juncheng Yang, home">Juncheng Yang<span>.</span></a>
      <a class="post-back" href="../index.html#writing">All writing ↙</a>
    </header>
    <main>
      <article class="post" id="article">
        <header class="post-hero">
          <p class="eyebrow">${escapeHtml(post.category)} · ${escapeHtml(post.readTime)}</p>
          <h1>${escapeHtml(post.title)}</h1>
          <p class="post-deck">${escapeHtml(post.excerpt)}</p>
          <time datetime="${post.date.toISOString().slice(0, 10)}">${displayDate}</time>
        </header>
        <div class="post-body">
${post.html}
        </div>
      </article>
    </main>
    <footer class="post-footer">
      <p>Juncheng Yang · Harvard SEAS</p>
      <a href="../index.html#writing">Read another post ↗</a>
    </footer>
  </body>
</html>
`;
};

await Promise.all(
  posts.map((post) =>
    writeFile(path.join(outputDirectory, `${post.slug}.html`), postTemplate(post))
  )
);

console.log(`Built ${posts.length} Markdown posts.`);
