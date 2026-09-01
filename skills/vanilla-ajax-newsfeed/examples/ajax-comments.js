/**
 * AJAX Instant Comments & Anti-Spam Rate Limit Handler (Vanilla JS)
 * Appends new comments immediately to the DOM and handles 429 Too Many Requests errors.
 */

class ArticleCommentsManager {
  constructor(articleId) {
    this.articleId = articleId;
    this.commentsList = document.getElementById('comments-list');
    this.commentForm = document.getElementById('comment-form');
    this.authorInput = document.getElementById('comment-author');
    this.contentInput = document.getElementById('comment-content');
    this.submitButton = document.getElementById('comment-submit-btn');
    this.feedbackBox = document.getElementById('comment-feedback');
    this.rateLimitTimerBox = document.getElementById('rate-limit-timer');

    this.bindEvents();
  }

  bindEvents() {
    if (!this.commentForm) return;

    this.commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitComment();
    });
  }

  async submitComment() {
    const authorName = this.authorInput ? this.authorInput.value.trim() : 'אורח';
    const content = this.contentInput.value.trim();

    if (!content) {
      this.showFeedback('נא להזין תוכן תגובה.', 'error');
      return;
    }

    this.setSubmitting(true);
    this.clearFeedback();

    try {
      const response = await fetch(`/api/articles/${this.articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ authorName, content })
      });

      const data = await response.json();

      if (response.status === 429) {
        // Rate limit exceeded (Max 3 per minute)
        const retryAfter = data.retryAfter || 60;
        this.showRateLimitError(data.error || 'חרגת ממגבלת 3 תגובות לדקה.', retryAfter);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת התגובה.');
      }

      // Success: Inject new comment instantly at the top of the comments list
      this.injectComment(data.comment);
      this.contentInput.value = '';
      this.showFeedback('תגובתך נוספה בהצלחה!', 'success');

    } catch (err) {
      console.error('Comment submission error:', err);
      this.showFeedback(err.message, 'error');
    } finally {
      this.setSubmitting(false);
    }
  }

  injectComment(comment) {
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-card new-comment-highlight';

    const formattedDate = new Date(comment.createdAt || Date.now()).toLocaleDateString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    commentItem.innerHTML = `
      <div class="comment-header">
        <strong class="comment-author">${this.escapeHtml(comment.authorName)}</strong>
        <span class="comment-time">${formattedDate}</span>
      </div>
      <p class="comment-body">${this.escapeHtml(comment.content)}</p>
    `;

    // Prepend to list without reloading the whole section
    if (this.commentsList.firstChild) {
      this.commentsList.insertBefore(commentItem, this.commentsList.firstChild);
    } else {
      this.commentsList.appendChild(commentItem);
    }

    // Smooth scroll into view
    commentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  showRateLimitError(message, retryAfterSeconds) {
    this.showFeedback(message, 'warning');
    if (!this.submitButton) return;

    this.submitButton.disabled = true;
    let remaining = retryAfterSeconds;

    const interval = setInterval(() => {
      remaining--;
      this.submitButton.textContent = `נא להמתין (${remaining} שניות)`;
      if (remaining <= 0) {
        clearInterval(interval);
        this.submitButton.disabled = false;
        this.submitButton.textContent = 'שלח תגובה';
        this.clearFeedback();
      }
    }, 1000);
  }

  setSubmitting(isSubmitting) {
    if (this.submitButton) {
      this.submitButton.disabled = isSubmitting;
      this.submitButton.textContent = isSubmitting ? 'שולח...' : 'שלח תגובה';
    }
  }

  showFeedback(msg, type) {
    if (this.feedbackBox) {
      this.feedbackBox.textContent = msg;
      this.feedbackBox.className = `feedback-message feedback-${type}`;
      this.feedbackBox.style.display = 'block';
    }
  }

  clearFeedback() {
    if (this.feedbackBox) {
      this.feedbackBox.style.display = 'none';
      this.feedbackBox.textContent = '';
    }
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
