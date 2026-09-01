# The Daily Web — AI Development Rules & Project Constitution

This document defines the strict architectural rules, technological constraints, coding standards, and operational guidelines for developing **The Daily Web** (פרויקט מסכם - מערכת חדשות), the final project for the Web Application Development course.

---

## 1. Technological Stack & Strict Constraints

### Allowed Technologies
- **Backend Runtime**: Node.js
- **Backend Framework**: Express.js (v4 / v5)
- **Database**: MongoDB (via Mongoose ODM)
- **Templating Engine (Server-Side Rendering)**: EJS (for initial page load & SEO compliance on article pages)
- **Frontend / Client-Side**: **Pure Vanilla JavaScript** (ES6+), DOM API, Fetch API / XMLHttpRequest (Ajax).
- **Styling**: Pure CSS3, HTML5 Semantic Elements, Flexbox layout.
- **Charts / Analytics**: Chart.js or HTML5 `<canvas>` API.
- **External Integration**: OpenWeatherMap API (free tier, no credit card required).

### STRICTLY FORBIDDEN TECHNOLOGIES (Automatic Grade 0 / Disqualification)
- **NO Frontend Frameworks / Component Libraries**:
  - React, Next.js, Vue, Nuxt, Angular, Svelte, Solid, Alpine.js, HTMX.
  - jQuery, Lodash (client-side), Axios (client-side - use native `fetch()`).
  - CSS UI Frameworks (Bootstrap, Tailwind, Material-UI, Bulma, Ant Design) unless explicitly approved by the lecturer. Use pure custom CSS with Flexbox.
- **NO Bundlers / Transpilers that obscure plain JS**: Webpack, Vite, Babel on the client (serve plain `.js` files from `/public/js`).

---

## 2. Architecture: Strict MVC (Model-View-Controller)

The codebase must maintain clean separation of concerns:

```text
/
├── config/             # DB connection, environment, auth/session configs
├── controllers/        # Route controllers handling request/response logic
│   ├── authController.js
│   ├── articleController.js
│   ├── commentController.js
│   ├── editorController.js
│   ├── analyticsController.js
│   └── weatherController.js
├── models/             # Mongoose schemas & business logic
│   ├── User.js
│   ├── Article.js
│   ├── Comment.js
│   └── ViewAnalytics.js
├── routes/             # RESTful Express route definitions
│   ├── authRoutes.js
│   ├── articleRoutes.js
│   ├── commentRoutes.js
│   ├── editorRoutes.js
│   ├── analyticsRoutes.js
│   └── weatherRoutes.js
├── views/              # EJS server-rendered templates
│   ├── layouts/
│   ├── partials/       # header, footer, sidebar (weather widget)
│   ├── pages/          # home, article, login, reporter-workspace, editor-workspace, analytics
├── public/             # Static client assets
│   ├── css/            # Semantic Flexbox stylesheets
│   ├── js/             # Vanilla JS client scripts (AJAX, infinite scroll, autosave, charts)
│   └── images/
├── middlewares/        # Auth, RBAC, Rate Limiting, Error handling
├── services/           # External API calls (Weather caching), Aggregation helpers
└── scripts/            # Seed data generation (500+ articles)
```

---

## 3. Core Functional Requirements & State Machines

### 3.1. User Roles & Authentication
- **Roles**:
  1. `Guest` (Unauthenticated visitor): Read articles, infinite scroll, search/filter/sort, post comments (rate-limited).
  2. `Reporter` (כתב): Create articles, autosave drafts, submit for review, revise rejected articles, edit published articles.
  3. `Editor` (עורך): Review all articles, approve & publish, reject with revision notes, direct edit, delete, view Impact Analytics.
- **Authentication**:
  - Username & Password.
  - Passwords hashed with `bcrypt` (never plaintext, irreversible).
  - Session management with `express-session` backed by `connect-mongo` (MongoDB session store) so user sessions survive server restarts.
  - Server-side permission verification on all API endpoints. Hiding buttons in the frontend is NOT security.

### 3.2. Article Lifecycle & Dual-Version Workflows
Articles must support the following states:
1. `draft` ("בהכנה"): Initial state when reporter starts writing. Auto-saved continuously.
2. `pending` ("ממתינה לאישור עורך"): Submitted by reporter to editorial queue.
3. `published` ("פורסמה"): Approved by editor; visible on the public feed.
4. `rejected` ("הוחזרה לתיקונים"): Returned by editor with feedback notes explaining required fixes.

**Special Workflow for Editing Published Articles**:
- When a reporter edits a *published* article:
  - The public site continues displaying the currently approved version.
  - The reporter's edits are stored as a draft revision without modifying the live published content.
  - When submitted, the update enters `pending` state.
  - The editor has a **Side-by-Side Diff View** comparing the live version vs. the new pending version.
  - Upon editor approval, the new version replaces the live version, and an `updatePublishedAt` event is logged for analytics.

### 3.3. Draft Autosave & Work Continuity
- Client-side debounced autosave (e.g. 2-second debounce on typing + beforeunload event).
- Saved to server via Ajax endpoint (`PATCH /api/articles/:id/autosave`) and backed up in `localStorage`.
- Closing the browser, refreshing, or switching computers must seamlessly recover the latest saved version.

### 3.4. Public Feed & Article Page (SEO + Ajax)
- **News Feed**:
  - Infinite scroll loading 20 articles at a time when scrolling near the bottom (using `IntersectionObserver` or scroll listener).
  - Live search by title/keywords without page reload.
  - Filters: Category, Viewed vs. Unviewed (tracked locally in `localStorage` / cookie).
  - Sorting: Publication Date (Newest), Popularity (View Count).
  - Dynamic updates via Vanilla JS `fetch()` and DOM manipulation.
- **Article Page (SEO Required)**:
  - Full article content must be rendered server-side via EJS in the initial HTML response.
  - Comment section loads and posts dynamically via AJAX without full page reload.
  - View count incremented on each visit.

### 3.5. Anti-Spam & Rate Limiting
- Guest users are restricted to **maximum 3 comments per minute** from the same device / IP address.
- Rate limiter middleware must block excessive submissions with HTTP 429 and a clear user-facing error message.

### 3.6. Impact Analytics (Editor Dashboard)
- Interactive timeline chart using Chart.js or `<canvas>`.
- Displays views over time.
- Clear milestone annotations/markers at timestamps where an article update was published.
- High-concurrency architecture: Page views are recorded efficiently (e.g., batched or time-bucketed view logs in MongoDB) to support thousands of concurrent readers.

### 3.7. Weather Sidebar Widget
- Free public API (OpenWeatherMap / Open-Meteo).
- Server-side or client-side caching: Cached data refreshed at most once every 15 minutes to stay within free rate limits while serving thousands of concurrent users.

### 3.8. Seed Data (500+ Articles)
- Seed script (`npm run seed`) populating:
  - At least 500 articles across multiple categories and lifecycle statuses.
  - Multiple reporter accounts and an editor account.
  - Realistic comment threads.
  - Multiple articles with historical post-publication revisions and time-series view logs for Impact Analytics demonstration.

---

## 4. Git & Team Collaboration Standards
- 4-5 students per team, all registered with the same course lecturer.
- Feature branching workflow: `feature/<feature-name>-<student-name>`.
- Frequent, well-documented commits.
- Pull Requests with peer reviews before merging into `main` / `master`.
- **Zero Secrets**: `.env` added to `.gitignore`. Never push API keys, passwords, or session secrets to GitHub.
