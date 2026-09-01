---
name: the-daily-web-spec
description: >-
  Master reference and architectural guide for 'The Daily Web' final project.
  Use this skill whenever working on core requirements, MVC structuring, database schemas,
  role permissions, forbidden technology checks, and oral exam defense prep.
---

# The Daily Web — Master Project Blueprint & Specification

This skill acts as the comprehensive reference guide for developing, reviewing, and defending **The Daily Web** (מערכת חדשות) final project in the Web Application Development course.

## Core Architectural Invariants
1. **Strict Allowed Tech**: Node.js, Express, MongoDB/Mongoose, EJS (for Article SSR), Vanilla JavaScript (AJAX/Fetch), CSS Flexbox, Chart.js / Canvas, OpenWeatherMap.
2. **Forbidden Tech**: Zero client-side frameworks (React, Vue, Angular, jQuery). Violating this results in disqualification.
3. **Database Models (Min 4)**: Users, Articles, Comments, View Analytics / Statistics. Full CRUD on each.
4. **Roles (RBAC)**: Guest, Reporter, Editor. Server-side validation on every privileged endpoint.
5. **Session Durability**: Passwords hashed with `bcrypt`, sessions persisted in MongoDB with `connect-mongo` across server restarts.
6. **Defense Data**: 500+ articles with realistic categories, statuses, revisions, comments, and view histories.

## Available References
- [Course Requirements & Administrative Rules](./references/course-requirements.md)
- [MVC Architecture & Route Design](./references/architecture-mvc.md)
- [Database Schema Definitions (Mongoose)](./references/database-schemas.md)
- [Oral Exam Defense Checklist & Lecturer Q&A](./references/defense-checklist.md)
