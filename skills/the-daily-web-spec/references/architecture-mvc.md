# MVC Architecture & Request Pipeline

"The Daily Web" strictly enforces the Model-View-Controller (MVC) architectural pattern with RESTful endpoints and hybrid rendering (EJS for SSR SEO + Vanilla JS AJAX for dynamic updates).

---

## 1. Directory Structure

```text
the-daily-web/
├── app.js                         # Application entry point & middleware mounting
├── server.js                      # Server port listener & DB bootstrap
├── .env.example                   # Environment variable template
├── config/
│   ├── db.js                      # Mongoose connection & indexing setup
│   └── session.js                 # connect-mongo session store configuration
├── middlewares/
│   ├── auth.js                    # Session check & user context injection
│   ├── rbac.js                    # requireRole('reporter'), requireRole('editor')
│   ├── rateLimiter.js             # 3 comments/minute anti-spam limiter for guests
│   └── errorHandler.js            # Centralized error handler & JSON/HTML logger
├── models/
│   ├── User.js                    # User schema (bcrypt hashing, roles)
│   ├── Article.js                 # Article schema (statuses, revisions, text index)
│   ├── Comment.js                 # Comment schema (article reference, author/guest IP)
│   └── ViewAnalytics.js           # Time-bucketed view counts & update events
├── controllers/
│   ├── authController.js          # Login, logout, current session
│   ├── articleController.js       # Feed JSON, SSR article view, autosave, CRUD
│   ├── commentController.js       # Comment creation, fetch comments, moderation
│   ├── editorController.js        # Editorial review queue, approval, diff, rejection
│   ├── analyticsController.js     # Time-series aggregation & chart datasets
│   └── weatherController.js       # Cached weather service handler
├── routes/
│   ├── api/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── articleRoutes.js       # /api/articles
│   │   ├── commentRoutes.js       # /api/comments
│   │   ├── editorRoutes.js        # /api/editor
│   │   ├── analyticsRoutes.js     # /api/analytics
│   │   └── weatherRoutes.js       # /api/weather
│   └── webRoutes.js               # EJS page routes (/, /articles/:id, /login, /workspace)
├── views/
│   ├── layouts/
│   │   └── main.ejs               # Base HTML skeleton with semantic tags
│   ├── partials/
│   │   ├── navbar.ejs             # Dynamic role-based navigation
│   │   ├── weather-widget.ejs     # Sidebar weather card
│   │   └── footer.ejs
│   └── pages/
│       ├── home.ejs               # News feed container + filter sidebar
│       ├── article.ejs            # Full SEO-rendered article + Ajax comments
│       ├── login.ejs              # Auth form
│       ├── reporter.ejs           # Reporter workspace & autosave editor
│       ├── editor.ejs             # Editor management queue & diff viewer
│       └── analytics.ejs          # Impact Analytics dashboard (Chart.js)
└── public/
    ├── css/
    │   ├── variables.css          # Color palette, spacing, typography
    │   ├── layout.css             # Flexbox grid, sidebar, responsive breakpoints
    │   └── components.css         # Article cards, badges, diff viewer, modals
    └── js/
        ├── newsfeed.js            # Infinite scroll, search, filters, sorting
        ├── article-view.js        # View logger & instant comment submission
        ├── autosave.js            # Reporter autosave & local storage recovery
        ├── diff-viewer.js         # Side-by-side diff renderer for editor
        ├── impact-chart.js        # Chart.js initialization & milestone annotations
        └── weather.js             # Client weather widget poller
```

---

## 2. Request Handling Pipeline

1. **Static Assets**: Express static middleware serves `/public` directly.
2. **Session & Security**:
   - `express-session` reads `connect.sid` cookie and retrieves session data from MongoDB via `connect-mongo`.
   - `req.session.user` attached to `res.locals.currentUser` for EJS views.
3. **Route Resolution**:
   - Web Routes: Controller fetches initial Mongoose model data and renders EJS view (`res.render(...)`).
   - API Routes: Controller processes request, verifies RBAC, queries Mongoose, and responds with JSON (`res.json(...)`).
4. **Error Handling**:
   - Asynchronous errors caught by `asyncHandler` wrapper and routed to `errorHandler` middleware.
   - For API requests: returns JSON `{ error: 'Message', code: 500 }`.
   - For Web requests: renders user-friendly error page.
