#!/usr/bin/env node
// Replace the public site URL used in canonical/OG tags, robots.txt and sitemap.xml.
// Usage: node scripts/set-site-url.mjs https://orpheus-web.wasmer.app

import { readFileSync, writeFileSync } from "node:fs";

const CURRENT_URL = "https://awashalt3-ux.github.io/portfolio";

const nextUrl = String(process.argv[2] || "").replace(/\/$/, "");
if (!/^https:\/\/[^/]+/.test(nextUrl)) {
  console.error("Usage: node scripts/set-site-url.mjs https://example.com");
  process.exit(1);
}

const files = [
  "public/index.html",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/404.html",
];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  if (!content.includes(CURRENT_URL)) {
    console.warn(`skip: ${file} (URL introuvable)`);
    continue;
  }
  writeFileSync(file, content.replaceAll(CURRENT_URL, nextUrl));
  console.log(`updated: ${file}`);
}

console.log(`\nURL du site : ${nextUrl}/`);
