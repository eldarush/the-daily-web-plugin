# Oral Exam Defense Checklist & Lecturer Q&A Guide

Prepare your team for the final project defense with these step-by-step test scenarios and expected technical answers.

---

## 1. Live Demonstration Checklist

1. **Seed Data Verification**:
   - Run `npm run seed` before defense.
   - Show 500+ articles in MongoDB across categories and statuses.
2. **Public News Feed**:
   - Demonstrate infinite scroll loading 20 articles at a time as you scroll to the bottom.
   - Demonstrate search by title without full page reload.
   - Demonstrate category filters and viewed/unviewed filters.
   - Demonstrate sorting (by date and popularity).
3. **Article Page & SEO**:
   - Inspect page source (`Ctrl+U` / View Source) to prove that the full article content is in the initial server-rendered HTML payload from EJS (SEO-friendly).
   - Post a comment as a guest; demonstrate that it appears immediately in the DOM without reloading the comments list.
4. **Anti-Spam Rate Limiter Test**:
   - As a guest, submit 3 comments quickly within one minute.
   - Attempt a 4th comment; show that the server blocks the request with HTTP 429 and displays a clear warning message.
5. **Server Restart & Session Durability**:
   - Log in as a Reporter.
   - Stop and restart the Express server process (`Ctrl+C` then `npm start`).
   - Refresh the browser; demonstrate that the Reporter remains logged in because sessions are stored in MongoDB via `connect-mongo`.
6. **Reporter Autosave & Work Continuity**:
   - Start writing a new article as a Reporter.
   - Type several paragraphs (without pressing any save button).
   - Close the browser tab or open an incognito window / restart browser.
   - Reopen the workspace; demonstrate that the entire draft was recovered from the server / LocalStorage.
7. **Dual-Version Published Article Editing**:
   - Find a published article. As a Reporter, edit the article and submit changes for review.
   - Open a separate private/guest window; demonstrate that the live public article remains unchanged!
   - Log in as Editor; open the article review queue.
   - Demonstrate the **Side-by-Side Diff View** comparing the live version vs. the proposed update.
   - Approve the update; show that the public site now displays the new content, and an update milestone was recorded.
8. **Impact Analytics Dashboard**:
   - Open the Analytics page as Editor.
   - Select an article that received updates.
   - Show the Chart.js timeline with view counts over time and vertical annotation markers representing when the editor published updates.
9. **Weather Sidebar Widget**:
   - Show the weather widget in the sidebar displaying real-time data from OpenWeatherMap.
   - Show backend caching logs proving the API is not flooded on every page visit (15-min cache ttl).

---

## 2. Common Technical Questions from Lecturers

| Question | Strong Technical Answer |
| :--- | :--- |
| **Why not use React or Vue?** | The course requirements strictly mandate pure Vanilla JavaScript, DOM API, and CSS Flexbox to ensure deep mastery of browser fundamentals, asynchronous Fetch, and web performance. |
| **How did you achieve SEO if the app has AJAX?** | We used a hybrid MVC architecture: article pages are server-rendered with EJS containing all content in the initial HTML for web crawlers, while interactive widgets (comments, filtering, infinite scroll) use AJAX. |
| **How does session persistence work across restarts?** | We configured `express-session` with the `connect-mongo` store. Sessions are serialized into a `sessions` collection in MongoDB, persisting across Node.js restarts. |
| **How do you handle thousands of view events without crashing MongoDB?** | We use time-bucketed aggregation in `ViewAnalytics` (`{ article, timestampBucket: 'YYYY-MM-DD-HH' }`) using atomic `$inc` operations with compound indexes, reducing writes from individual records to batched counter increments. |
| **How does the draft versioning work for published articles?** | In the Article schema, we maintain the active fields (`title`, `content`, `status: 'published'`) while editing changes are written to a `pendingUpdate` subdocument. The live site queries the top-level fields, while the editor review compares top-level vs `pendingUpdate`. On approval, `pendingUpdate` is merged into the top-level document. |
