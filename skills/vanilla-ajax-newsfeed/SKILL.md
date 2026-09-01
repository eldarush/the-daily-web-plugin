---
name: vanilla-ajax-newsfeed
description: >-
  Implementation guide and code patterns for Vanilla JS AJAX features in 'The Daily Web':
  infinite scroll pagination (20 articles per batch), live search, category/viewed filtering,
  sorting, and instant comment submission without full page reloads.
---

# Vanilla JavaScript & AJAX Newsfeed Engine

This skill provides verified, framework-free client-side patterns to implement all interactive features of "The Daily Web" using pure Vanilla JavaScript, `IntersectionObserver`, and the Fetch API.

## Core Features
1. **Infinite Scroll**: Loads 20 articles at a time when reaching the feed bottom.
2. **AJAX Filtering & Sorting**: Filter by category and read/unread status, sort by date or popularity without full page reload.
3. **Instant Comment Submission**: Form submit via Fetch API, optimistic DOM rendering, and handling 429 rate limit responses.
4. **Zero Framework Rule**: Strictly no React, Vue, Angular, or jQuery.

## Code Examples
- [Infinite Scroll Implementation (IntersectionObserver)](./examples/infinite-scroll.js)
- [Dynamic Filters, Search & Sorting](./examples/dynamic-filters.js)
- [Instant Comment Posting & Rate Limit Handler](./examples/ajax-comments.js)
- [DOM Performance & Event Delegation Best Practices](./references/dom-performance.md)
