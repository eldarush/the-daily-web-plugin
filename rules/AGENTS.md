# The Daily Web — AI Development Rules & Project Constitution

This document defines the strict architectural rules, technological constraints, coding standards, and operational guidelines for developing **The Daily Web** (פרויקט מסכם - מערכת חדשות), the final project for the Web Application Development course.

---

## 🚨 ZERO-DEVIATION CONSTITUTION: STRICT MANDATE

> **IMPORTANT**: All AI agents and developers must **NEVER deviate from the original project requirements, restrictions, and technological bounds under any circumstance**. These rules are absolute constraints evaluated during the final project defense.

### Absolute Invariants:
1. **Allowed Tech Stack Only**:
   - Runtime & Framework: Node.js, Express.js (strict MVC).
   - Database: MongoDB via Mongoose ODM (4+ models: `User`, `Article`, `Comment`, `ViewAnalytics`).
   - SSR for SEO: EJS rendering on article pages.
   - Client-Side: **Pure Vanilla JavaScript**, DOM manipulation, native `fetch()`, HTML5 semantic tags, CSS Flexbox.
   - **STRICT PROHIBITION**: React, Vue, Angular, Svelte, jQuery, client-side Axios, CSS UI frameworks (Bootstrap/Tailwind), client bundlers.
2. **Session Persistence**: Sessions must survive server restarts (`connect-mongo`).
3. **Authentication & RBAC**: Passwords hashed with `bcrypt`. Server-side validation on every privileged endpoint (`Guest`, `Reporter`, `Editor`).
4. **Spam Protection**: Guest rate limiting of max 3 comments/minute per IP/device with HTTP 429 response.
5. **Autosave & Dual-Version Workflows**:
   - Real-time autosave in reporter workspace.
   - Editing published articles preserves the live version untouched until editorial approval.
6. **Editor Diff & Impact Analytics**:
   - Side-by-side diff view.
   - Chart.js / Canvas timeline showing view count changes with clear update milestone markers.
7. **Weather Widget**: Cached server-side for max 15 minutes.
8. **500+ Article Mock Dataset**: Pre-populated for the oral defense demonstration.

---

## 💎 Code Quality, Simplicity & Documentation Standards

- **Clean & Concise**: Write short, focused functions with single responsibilities. Avoid bloat, unnecessary helper abstractions, or defensive over-engineering.
- **Readable & Intuitive**: Favor clarity over cleverness. Any team member must be able to explain every single line during the defense.
- **Well-Documented**: Provide clear JSDoc comments explaining function contracts, parameters, return types, and architectural rationale.
- **Standard Library First**: Leverage native JavaScript built-ins, standard DOM APIs, and CSS Flexbox layout.
