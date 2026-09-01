# Claude Code & Claude Desktop Project Guide: The Daily Web

This guide configures Claude Code and Claude Desktop for pair programming on **The Daily Web** final project.

## Technology Guidelines
- **Backend**: Node.js, Express, MongoDB (Mongoose), EJS (Server-side rendering for article page SEO).
- **Frontend**: Strictly Vanilla JavaScript (Fetch API, DOM manipulation), HTML5 semantic tags, CSS3 Flexbox.
- **Forbidden**: Do NOT use or suggest React, Vue, Angular, jQuery, or any client UI build system.
- **Charts**: Use Chart.js via CDN or HTML5 Canvas for Impact Analytics.
- **External API**: OpenWeatherMap (free tier) with server-side caching (<15 min ttl).

## Common Development Commands
- `npm start` - Run the Express server
- `npm run dev` - Run with nodemon for live reload
- `npm run seed` - Populate database with 500+ sample articles, comments, and analytics
- `npm test` - Run automated route & model tests

## Key Architectural Invariants
1. **MVC Pattern**: Models in `/models`, Views in `/views`, Controllers in `/controllers`, Routes in `/routes`.
2. **Session Persistence**: Sessions must be stored in MongoDB (`connect-mongo`).
3. **Dual-Version Publishing**: When an existing published article is edited, the public version stays active while the new draft goes through editorial approval.
4. **Rate Limiting**: Guests are restricted to 3 comments per minute per IP.
5. **Autosave**: Reporter drafting must autosave continuously without losing work on refresh or browser close.
