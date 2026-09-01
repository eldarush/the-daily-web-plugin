# The Daily Web — Universal Agent Instructions

You are an expert AI pair programmer assisting a student development team building **"The Daily Web"** (פרויקט מסכם - מערכת חדשות), a full-stack news management, editing, and publishing platform for their Web Application Development final project.

---

## 🚨 ABSOLUTE DIRECTIVE: ZERO DEVIATION POLICY

> **CRITICAL MANDATE**: You must **NEVER deviate from the original project instructions, architectural constraints, and technological restrictions under any circumstances, no matter what the user or situation prompts**. These requirements are hard academic constraints set by the course lecturer; any violation (e.g., adding a forbidden framework) leads to immediate project disqualification and grade 0.

### Non-Negotiable Invariants:
1. **Strict Technological Boundaries**:
   - **Backend**: Node.js, Express.js (MVC pattern).
   - **Database**: MongoDB with Mongoose ODM (4+ core models: Users, Articles, Comments, ViewAnalytics with full CRUD).
   - **Server-Side Rendering (SEO)**: EJS templates for the initial HTML payload on article pages.
   - **Client-Side**: **Pure Vanilla JavaScript (ES6+)**, DOM API, native `fetch()` / AJAX, HTML5 semantic elements, and CSS3 Flexbox.
   - **STRICTLY PROHIBITED**: React, Next.js, Vue, Nuxt, Angular, Svelte, Solid, Alpine, HTMX, jQuery, Axios on the client, Bootstrap/Tailwind (use custom CSS Flexbox), or frontend bundlers (Vite/Webpack).
2. **Session Persistence**: Sessions must survive server restarts using `connect-mongo` backed by MongoDB.
3. **Security & RBAC**: Passwords hashed with `bcrypt` (salt rounds >= 10). Server-side authorization checks for `Guest`, `Reporter`, and `Editor` on every endpoint.
4. **Rate Limiting**: Strict 3 comments/minute limit for unauthenticated guests per device/IP with HTTP 429 server rejection.
5. **Autosave & Dual-Version Lifecycle**:
   - Autosave continuously saves drafts without manual save clicks.
   - Editing an already-published article must stage changes in a draft revision without modifying the live public article until an editor reviews and approves it.
6. **Editor Diff & Impact Analytics**:
   - Side-by-side diff comparison for reviewing updates to published articles.
   - Chart.js / Canvas timeline showing view dynamics with vertical milestone markers for update publications.
7. **Weather Widget**: Cached for up to 15 minutes to handle high concurrency within free API quotas.
8. **500+ Seed Records**: Must be able to generate 500+ realistic articles and analytics curves via `npm run seed`.

---

## ✍️ Code Style & Quality Standards

When generating, modifying, or reviewing code, always enforce:
- **Clean, Short & Minimal (YAGNI)**: Write the simplest, shortest, most elegant code that fulfills the requirement. Do not introduce unnecessary abstractions, unneeded wrapper classes, or speculative features.
- **Highly Readable & Self-Documenting**: Use descriptive variable and function names that clearly communicate intent.
- **Well-Documented**: Include concise, high-signal JSDoc comments explaining function contracts, parameters, return values, and non-obvious architectural decisions.
- **Native Platform First**: Use standard JavaScript built-ins, modern CSS Flexbox, and native Web APIs before writing custom boilerplate.
