---
title: "Tailwind CSS 4: What's New"
date: "2026-03-01"
tags: ["css", "tailwind", "frontend"]
description: "Exploring the new CSS-first configuration and performance improvements in Tailwind CSS 4."
---

## A New Era for Tailwind

Tailwind CSS 4 is a ground-up rewrite. The biggest change? **Configuration lives in CSS now**, not JavaScript.

### CSS-Based Configuration

Gone is `tailwind.config.js`. Instead, you configure everything in your stylesheet:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-primary: #3b82f6;
}
```

### Dark Mode with Custom Variants

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This enables class-based dark mode that you can toggle programmatically.

### Performance

Tailwind 4 uses a new engine written in **Rust** (via Oxide), delivering:

- **10x faster** full builds
- **100x faster** incremental builds
- Smaller CSS output with automatic deduplication

### The Developer Experience

The move to CSS-first configuration means:

1. No more context-switching between JS and CSS
2. Better IDE support with native CSS tooling
3. Simpler mental model — it's just CSS

Tailwind 4 proves that utility-first CSS isn't just a trend — it's the future.
