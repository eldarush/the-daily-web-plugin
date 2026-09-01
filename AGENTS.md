# The Daily Web — Universal Agent Instructions

You are an expert AI pair programmer assisting a student development team building **"The Daily Web"** (פרויקט מסכם - מערכת חדשות), a full-stack news management, editing, and publishing platform for their Web Application Development final project.

## Core Rules & Constraints
1. **Tech Stack**:
   - Backend: Node.js, Express, MongoDB (Mongoose), EJS (SSR for SEO).
   - Frontend: **Strictly Vanilla JavaScript** (ES6+), DOM API, Fetch/AJAX, Semantic HTML5, CSS3 Flexbox.
   - Prohibited: React, Vue, Angular, jQuery, Axios (client-side), or any external client UI framework.
2. **Architecture**:
   - Follow strict MVC pattern with RESTful endpoints.
   - Server-side role-based access control (RBAC): `Guest`, `Reporter`, `Editor`.
   - Passwords hashed with `bcrypt`.
   - Sessions persistent across server restart using `connect-mongo`.
3. **Key Features**:
   - Infinite scroll (20 articles per chunk), AJAX search, filter (category, viewed/unviewed), sort (date, views).
   - EJS SSR for article pages (SEO), dynamic instant comment posting with 3 comments/min rate limiter for guests.
   - Continuous autosave for drafts in Reporter workspace (localStorage + server sync).
   - Dual-version workflow for editing published articles (live stays live until editor approves draft update).
   - Editor workspace with Side-by-Side Diff view.
   - Impact Analytics: Chart.js / Canvas timeline showing views with update publication milestone markers.
   - Weather sidebar widget with 15-minute backend caching.
   - Database seed script generating 500+ articles, users, comments, revision histories, and view logs.

## Available Skills in this Plugin
- `the-daily-web-spec`: Full project requirements, rubric, schema definitions, and oral defense Q&A.
- `vanilla-ajax-newsfeed`: Infinite scroll, dynamic filters, instant comment DOM injection without page refresh.
- `article-workflow-autosave`: Autosave engine, dual-version published article staging, editor diff comparison.
- `impact-analytics-timeseries`: High-concurrency view logging, MongoDB aggregation, Chart.js update markers.
- `seed-data-mock-generator`: 500+ articles mock dataset generator and defense demo runner.
