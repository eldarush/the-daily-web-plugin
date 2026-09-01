# Antigravity Rules for The Daily Web

- **ZERO DEVIATION MANDATE**: Never deviate from the original project requirements, tech limits, or architecture.
- **Strict Tech Stack**: Node.js, Express (MVC), MongoDB/Mongoose, EJS (SSR for Article page SEO), Pure Vanilla JavaScript (Fetch/DOM), CSS Flexbox.
- **Strictly Prohibited**: Never suggest or install client frameworks (no React, Vue, Angular, jQuery) or client bundlers.
- **Security & Persistence**: Hash passwords with bcrypt; store persistent sessions in MongoDB with `connect-mongo`.
- **Anti-Spam Rate Limit**: Limit guest comments to max 3 per minute.
- **Autosave & Staging**: Continuous autosave for drafts; published edits stage in `pendingUpdate` until approved.
- **Code Standards**: Write clean, short, readable, and thoroughly documented code with JSDoc comments.
