# 📰 The Daily Web — Universal AI Plugin & Collaborative Toolkit

> **Official Cross-Platform AI Pair-Programming Plugin & Architecture Toolkit for "The Daily Web" Final Project**  
> *(פרויקט מסכם - מערכת חדשות "The Daily Web" | קורס פיתוח אפליקציות אינטרנטיות)*

[![GitHub Repository](https://img.shields.io/badge/GitHub-eldarush%2Fthe--daily--web--plugin-blue?logo=github)](https://github.com/eldarush/the-daily-web-plugin)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-MVC-lightgrey.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://mongoosejs.com)
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS%20%7C%20Flexbox-orange.svg)]()
[![Zero Frameworks](https://img.shields.io/badge/External%20Frameworks-0%25%20(Forbidden)-red.svg)]()

---

## 🎯 Overview

**The Daily Web Plugin** is a complete, production-ready AI assistant plugin and collaborative developer workspace for students building **The Daily Web** news platform. It packages the top official, highly-rated Model Context Protocol (MCP) servers and Agent Skills directly sourced from the most recognized GitHub repositories (`DietrichGebert/ponytail`, `upstash/context7`, `addyosmani/agent-skills`, and `modelcontextprotocol/servers`), combined with specialized domain blueprints for the course project.

This single plugin is universally compatible with:
- 🤖 **Google Antigravity (AGY)**
- 🧠 **Claude Code & Claude Desktop**
- ⚡ **Codex, Cursor, Windsurf & VS Code**

---

## 🛠️ The Top 10 Curated Skills & MCP Servers

All skills and MCP servers included in this plugin are official, widely adopted, and tailored specifically to meet all course constraints:

### 🔌 Official MCP Servers
| # | MCP Server | Source / Package | Purpose in This Project |
| :- | :--- | :--- | :--- |
| 1 | **`context7`** | [`upstash/context7`](https://github.com/upstash/context7) (`@upstash/context7-mcp`) | Real-time, version-specific official documentation & API patterns for Node.js, Express, Mongoose, and Chart.js without hallucinations. |
| 2 | **`mongodb`** | [`modelcontextprotocol/servers`](https://github.com/modelcontextprotocol/servers) (`mongodb-mcp-server`) | Direct MongoDB schema inspection, query profiling, index optimization, and aggregation pipeline testing for high-concurrency analytics. |
| 3 | **`fetch`** | [`modelcontextprotocol/servers`](https://github.com/modelcontextprotocol/servers) (`mcp-server-fetch`) | Validates RESTful endpoints, tests OpenWeatherMap API responses, and inspects HTTP 429 rate limit headers. |
| 4 | **`github`** | [`modelcontextprotocol/servers`](https://github.com/modelcontextprotocol/servers) (`@modelcontextprotocol/server-github`) | Manages student feature branches, PR reviews, commit hygiene, and verifies contribution histories for the final defense. |

---

### 🧠 Official & Specialized Skills
| # | Skill Name | Source Repository | Description & Workflow |
| :- | :--- | :--- | :--- |
| 5 | **`the-daily-web-spec`** | *Core Project* | Master course blueprint, administrative rules, MVC layer mapping, 4+ Mongoose schemas, and oral exam defense checklist. |
| 6 | **`ponytail`** & **`ponytail-review`** | [`DietrichGebert/ponytail`](https://github.com/DietrichGebert/ponytail) | Forces minimal, simple code. Reaches for standard library and native platform features over external dependencies. |
| 7 | **`find-docs`** & **`context7-cli`** | [`upstash/context7`](https://github.com/upstash/context7) | Fast real-time documentation lookup for Express, Mongoose, EJS, and Web APIs using Context7. |
| 8 | **`security-and-hardening`** | [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) | Production security practices: OWASP mitigations, bcrypt hashing, session security, and anti-spam rate limiting. |
| 9 | **`git-workflow-and-versioning`** | [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) | Disciplined team Git branching, atomic commits, PR reviews, and version control hygiene for 4-5 students. |
| 10 | **`performance-optimization`** | [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) | Web performance, DOM batching, memory leak prevention, and high-concurrency time-series caching. |
| 11 | **`vanilla-ajax-newsfeed`** | *Core Project* | Framework-free 20-article infinite scrolling (`IntersectionObserver`), live search, category/viewed filters, and instant AJAX comments. |
| 12 | **`article-workflow-autosave`** | *Core Project* | Debounced autosave engine (`localStorage` + server sync), draft vs published dual-versioning, and side-by-side editorial diff viewer. |
| 13 | **`impact-analytics-timeseries`** | *Core Project* | High-concurrency view logging, MongoDB bucketed time-series aggregation, and Chart.js timeline charts annotated with editor update milestones. |
| 14 | **`seed-data-mock-generator`** | *Core Project* | Ready-to-run script generating 500+ realistic articles across all categories, multiple reporters/editors, comments, and analytics curves. |

---

## 🏛️ Strict Project Constraints & Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        THE DAILY WEB ARCHITECTURE                       │
├────────────────────────────────┬────────────────────────────────────────┤
│ 🚀 Backend                     │ Node.js + Express (Strict MVC Pattern) │
│ 🗄️ Database                    │ MongoDB with Mongoose (4+ CRUD Models) │
│ 🌐 Server-Side Rendering (SEO) │ EJS (for initial Article Page HTML)    │
│ 🎨 Client-Side                 │ Pure Vanilla JS (Fetch/DOM) + Flexbox  │
│ 🚫 FORBIDDEN                   │ React, Vue, Angular, jQuery, Axios UI  │
│ 🔒 Authentication              │ Bcrypt hashing + connect-mongo session │
│ ⚡ Rate Limiting               │ Max 3 comments/min for Guests          │
│ 🌤️ External API               │ OpenWeatherMap (Cached max 15 minutes) │
│ 📊 Analytics                   │ Chart.js / Canvas with Update Markers  │
└────────────────────────────────┴────────────────────────────────────────┘
```

---

## 🚀 Setup & Multi-Platform Installation

### 1. In Antigravity (AGY)
Copy or symlink this directory into your project's `.agents/plugins/` root:
```bash
git clone https://github.com/eldarush/the-daily-web-plugin.git .agents/plugins/the-daily-web-plugin
```
AGY will automatically discover `plugin.json`, `mcp_config.json`, `hooks.json`, and all 13 skills!

---

### 2. In Claude Code & Claude Desktop

#### For Claude Code (CLI):
```bash
# Add the project configuration
claude config add-dir .
```
The `.claude/mcp.json` and `CLAUDE.md` files are already configured and will be detected automatically.

#### For Claude Desktop:
Add the servers from `claude_desktop_config.json` into your `claude_desktop_config.json`:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp@latest"] },
    "mongodb": { "command": "npx", "args": ["-y", "mongodb-mcp-server@latest"], "env": { "MONGODB_URI": "mongodb://127.0.0.1:27017/the_daily_web" } },
    "fetch": { "command": "uvx", "args": ["mcp-server-fetch"] },
    "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github@latest"] }
  }
}
```

---

### 3. In Cursor / Codex / VS Code / Windsurf
- The `.cursorrules` and `.cursor/rules/*.mdc` rules are automatically applied by Cursor.
- The `.vscode/mcp.json` configuration enables MCP tools in VS Code.
- `AGENTS.md` provides global instructions across all AI extensions.

---

## 📊 Generating 500+ Mock Articles for Defense

The course mandates at least 500 articles with full categories, statuses, and analytics logs:

```bash
# Make sure MongoDB is running locally
# Run the built-in generator script
npm run seed
```

This will automatically create:
- `editor` (Password: `123456`)
- `reporter1`, `reporter2`, `reporter3`, `reporter4` (Password: `123456`)
- 520 articles across 7 categories (Technology, News, Economy, Sports, Culture, Health, World)
- 75% Published, 10% Draft, 10% Pending Approval, 5% Returned for Corrections
- Post-publication updates with pending diffs
- 168-hour time-series view logs for Impact Analytics

---

## 👥 Team Git Collaboration Rules (4-5 Students)

Per course guidelines:
1. **Branch per feature/student**: `git checkout -b feature/infinite-scroll-eldar`
2. **Descriptive Commits**:
   - `feat(feed): implement 20-batch infinite scroll with IntersectionObserver`
   - `fix(comments): enforce 3-comment/min rate limiter for guest IPs`
   - `docs(readme): add installation instructions and architecture diagram`
3. **Pull Requests**: Every feature must be merged via PR after peer review by at least one teammate.
4. **No Secrets in Git**: `.env` is ignored by `.gitignore`.

---

## 🎓 Oral Defense (הגנה) Quick Checklist

| Item | What to Show the Lecturer |
| :--- | :--- |
| 1. **500+ Articles** | Show MongoDB collection count and diverse categories in the feed. |
| 2. **Infinite Scroll** | Scroll down to bottom; show 20 new articles loading via AJAX without page reload. |
| 3. **SEO Server Rendering** | View Page Source on `/articles/:id`; show full HTML containing article text from EJS. |
| 4. **Spam Protection** | Post 3 comments rapidly as guest; show 4th attempt blocked with HTTP 429 lock. |
| 5. **Server Restart** | Log in as Reporter; kill node server (`Ctrl+C`) and restart; refresh to show session persisted via `connect-mongo`. |
| 6. **Autosave** | Write text in Reporter workspace; close tab and reopen; show content restored from draft backup. |
| 7. **Dual-Version Diff** | Edit published article; show public site remains untouched while editor reviews side-by-side diff. |
| 8. **Impact Analytics** | Open Chart.js timeline; show view trends and vertical milestone markers on update publication. |
| 9. **Weather Widget** | Show sidebar weather widget fetching from OpenWeatherMap with 15-min cache. |

---

## 📄 License
Created for academic use by **Eldar Aslanbeily** (`eldarush`). Licensed under MIT.
