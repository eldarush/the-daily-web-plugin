# Defense Demo Scenarios & Script

Follow this step-by-step walkthrough during the live project defense to showcase 100% compliance with every line in the course specification:

---

## Act 1: The Public Feed (Homepage)
1. **Load Homepage**: Point out the clean Flexbox responsive layout with semantic HTML5 tags (`<header>`, `<main>`, `<article>`, `<aside>`, `<footer>`).
2. **Infinite Scroll**: Scroll smoothly down; observe the loading spinner and the next 20 articles being injected seamlessly without page reload.
3. **Instant Search**: Type a keyword (e.g., `"AI"` or `"טכנולוגיה"`); notice instant filtering via AJAX.
4. **Category & Status Filtering**: Toggle "Technology", then switch between "All" and "Unviewed".
5. **Weather Widget**: Point to the sidebar weather widget showing live temperature and conditions; mention the 15-minute server-side cache.

---

## Act 2: SEO-Friendly Article & Instant Comments
1. **Open Article**: Navigate to an article; show that the URL is `/articles/:id`.
2. **View Source (SEO Proof)**: Open Page Source (`Ctrl+U`) and show the lecturer that the headline, full text, and metadata are directly in the initial HTML payload (rendered via EJS on the server).
3. **Instant Comment**: Write a comment as a guest and click submit; show it appearing immediately at the top of the comment list without reloading the page.
4. **Spam Protection Demonstration**: Rapidly submit 3 comments; on the 4th attempt, show the HTTP 429 error and the dynamic countdown lock.

---

## Act 3: Reporter Workspace & Autosave
1. **Login**: Log in as `reporter1` (`123456`).
2. **Autosave Continuity**: Click "כתבה חדשה", write title and content, observe "שומר שינויים..." -> "נשמר בהצלחה".
3. **Simulate Crash / Machine Switch**: Close the tab entirely, reopen `/reporter`, and demonstrate that the entire draft was retained.
4. **Submit for Approval**: Submit the draft to transition state to `pending`.

---

## Act 4: Editor Workspace & Dual-Version Diff
1. **Login**: Log in as `editor` (`123456`).
2. **Review Queue**: Filter articles by `ממתינה לאישור`.
3. **Diff Viewer**: Open an article with pending edits on an already-published story. Show the **Side-by-Side Diff** highlighting added/modified text while explaining that the live website remains on the original version until approved.
4. **Approve Update**: Click Approve. The live version updates and an update timestamp is recorded.

---

## Act 5: Impact Analytics Dashboard
1. **Open Analytics**: Navigate to the Analytics tab.
2. **Select Article**: Choose the updated article.
3. **Show Chart**: Explain the Chart.js timeline showing hourly view counts with the vertical marker showing the exact moment the update was published, highlighting the surge in reader interest.

---

## Act 6: Server Restart Durability Test
1. **Restart Node Server**: In terminal, kill the node process and restart `npm start`.
2. **Refresh Browser**: Refresh the editor dashboard; show that the editor is still logged in with full session privileges because sessions are persisted in MongoDB via `connect-mongo`.
