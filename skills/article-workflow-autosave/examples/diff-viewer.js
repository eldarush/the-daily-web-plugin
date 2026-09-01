/**
 * Side-by-Side Diff Viewer (Vanilla JS)
 * Compares live published article content with pending revisions for Editor Review.
 */

class ArticleDiffViewer {
  constructor(containerId, originalArticle, proposedUpdate) {
    this.container = document.getElementById(containerId);
    this.original = originalArticle;
    this.proposed = proposedUpdate;
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="diff-viewer-wrapper">
        <div class="diff-column diff-original">
          <div class="diff-header">
            <h3>גרסה מפורסמת נוכחית (Live)</h3>
            <span class="badge badge-live">פעיל באתר</span>
          </div>
          <div class="diff-body">
            <h4 class="diff-field-label">כותרת:</h4>
            <div class="diff-text">${this.escapeHtml(this.original.title)}</div>

            <h4 class="diff-field-label">תקציר:</h4>
            <div class="diff-text">${this.escapeHtml(this.original.summary)}</div>

            <h4 class="diff-field-label">תוכן מלא:</h4>
            <div class="diff-text diff-content">${this.escapeHtml(this.original.content)}</div>
          </div>
        </div>

        <div class="diff-column diff-proposed">
          <div class="diff-header">
            <h3>גרסה חדשה מוצעת (Pending)</h3>
            <span class="badge badge-pending">ממתין לאישורך</span>
          </div>
          <div class="diff-body">
            <h4 class="diff-field-label">כותרת:</h4>
            <div class="diff-text ${this.isChanged('title') ? 'diff-highlight' : ''}">
              ${this.escapeHtml(this.proposed.title || this.original.title)}
            </div>

            <h4 class="diff-field-label">תקציר:</h4>
            <div class="diff-text ${this.isChanged('summary') ? 'diff-highlight' : ''}">
              ${this.escapeHtml(this.proposed.summary || this.original.summary)}
            </div>

            <h4 class="diff-field-label">תוכן מלא:</h4>
            <div class="diff-text diff-content ${this.isChanged('content') ? 'diff-highlight' : ''}">
              ${this.escapeHtml(this.proposed.content || this.original.content)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  isChanged(field) {
    if (!this.proposed[field]) return false;
    return this.proposed[field] !== this.original[field];
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
