# Claude Code & Claude Desktop Project Guide: The Daily Web

## 🚨 MANDATORY INSTRUCTION: NEVER DEVIATE FROM PROJECT CONSTRAINTS
You must uphold the original course requirements and restrictions at all times with ZERO deviations:
1. **Allowed Tech**: Node.js, Express (MVC), MongoDB (Mongoose), EJS (SSR for Article SEO), Pure Vanilla JavaScript (Fetch API/DOM), HTML5, CSS Flexbox.
2. **Prohibited Tech**: No React, Vue, Angular, jQuery, Axios on client, Bootstrap/Tailwind, or client-side build tools.
3. **Session Persistence**: Sessions must survive server restarts using `connect-mongo`.
4. **Rate Limiting**: Guests can post max 3 comments/min from the same device/IP.
5. **Autosave & Dual-Version Flow**: Drafts autosave; edits to published articles do not overwrite live content until approved by editor.
6. **Editor Diff & Impact Analytics**: Side-by-side diff view and Chart.js timeline with update milestone markers.
7. **Weather API**: Cached server-side for max 15 minutes.
8. **500+ Seed Articles**: Seedable via `npm run seed`.

## 💎 Code Quality Standards
- **Clean, short, and readable**: Every line must be clear and explainable by the student team during defense.
- **Well-documented**: Use concise JSDoc comments explaining parameters, return values, and rationale.
- **Standard Library First**: Use native JavaScript and browser APIs before introducing extra code.
