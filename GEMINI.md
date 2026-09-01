# Antigravity Rules for The Daily Web

- Always follow the MVC structure with Express controllers, Mongoose models, and EJS views.
- Never suggest or install client-side frontend frameworks (no React, Vue, Angular, jQuery). Use pure Vanilla JS and CSS Flexbox.
- Ensure all guest comments pass through the 3 comments/min rate limiter.
- Ensure all sessions are stored in MongoDB via `connect-mongo` so server restarts do not log users out.
- Ensure published article edits do not overwrite the live version until editor approval.
- Ensure 500+ mock records can be generated via `npm run seed`.
