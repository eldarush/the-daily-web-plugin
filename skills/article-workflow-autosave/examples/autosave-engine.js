/**
 * Reporter Autosave Engine (Vanilla JS)
 * Continuously saves draft state to localStorage and server API with visual feedback.
 */

class ArticleAutosaveEngine {
  constructor(options = {}) {
    this.articleId = options.articleId || null; // null for new article
    this.isPublished = options.isPublished || false;
    this.titleInput = document.getElementById('article-title');
    this.categoryInput = document.getElementById('article-category');
    this.summaryInput = document.getElementById('article-summary');
    this.contentInput = document.getElementById('article-content');
    this.imageUrlInput = document.getElementById('article-image-url');
    this.statusIndicator = document.getElementById('autosave-status');
    
    this.debounceDelay = options.debounceDelay || 2000;
    this.debounceTimer = null;
    this.lastSavedPayload = null;

    this.init();
  }

  init() {
    this.restoreFromLocalCache();
    this.bindInputListeners();
    this.bindWindowEvents();
  }

  getPayload() {
    return {
      title: this.titleInput ? this.titleInput.value.trim() : '',
      category: this.categoryInput ? this.categoryInput.value : '',
      summary: this.summaryInput ? this.summaryInput.value.trim() : '',
      content: this.contentInput ? this.contentInput.value.trim() : '',
      imageUrl: this.imageUrlInput ? this.imageUrlInput.value.trim() : ''
    };
  }

  bindInputListeners() {
    const inputs = [this.titleInput, this.categoryInput, this.summaryInput, this.contentInput, this.imageUrlInput];
    inputs.forEach(el => {
      if (!el) return;
      el.addEventListener('input', () => this.handleInput());
      el.addEventListener('change', () => this.handleInput());
    });
  }

  bindWindowEvents() {
    // Attempt instant save on beforeunload
    window.addEventListener('beforeunload', () => {
      this.saveToLocalCache();
      if (this.articleId) {
        // Beacon API for reliable background sync before page unloads
        navigator.sendBeacon(
          `/api/articles/${this.articleId}/autosave`,
          new Blob([JSON.stringify(this.getPayload())], { type: 'application/json' })
        );
      }
    });
  }

  handleInput() {
    this.setStatus('saving', 'שומר שינויים...');
    this.saveToLocalCache();

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.syncToServer();
    }, this.debounceDelay);
  }

  saveToLocalCache() {
    const storageKey = `draft_${this.articleId || 'new'}`;
    localStorage.setItem(storageKey, JSON.stringify({
      payload: this.getPayload(),
      savedAt: new Date().toISOString()
    }));
  }

  restoreFromLocalCache() {
    const storageKey = `draft_${this.articleId || 'new'}`;
    const cached = localStorage.getItem(storageKey);
    if (!cached) return;

    try {
      const { payload, savedAt } = JSON.parse(cached);
      // Only restore if current inputs are empty
      if (!this.titleInput.value && payload.title) this.titleInput.value = payload.title;
      if (!this.summaryInput.value && payload.summary) this.summaryInput.value = payload.summary;
      if (!this.contentInput.value && payload.content) this.contentInput.value = payload.content;
      if (payload.category && this.categoryInput) this.categoryInput.value = payload.category;
      if (payload.imageUrl && this.imageUrlInput) this.imageUrlInput.value = payload.imageUrl;

      this.setStatus('saved', `שוחזר מגיבוי מקומי (${new Date(savedAt).toLocaleTimeString('he-IL')})`);
    } catch (e) {
      console.warn('Failed to parse local draft cache:', e);
    }
  }

  async syncToServer() {
    const payload = this.getPayload();
    
    // Check if nothing changed
    if (JSON.stringify(payload) === JSON.stringify(this.lastSavedPayload)) {
      this.setStatus('saved', 'כל השינויים נשמרו בשרת');
      return;
    }

    try {
      let endpoint = this.articleId
        ? `/api/articles/${this.articleId}/autosave`
        : `/api/articles/draft`;

      const response = await fetch(endpoint, {
        method: this.articleId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Autosave failed on server');

      const data = await response.json();
      if (!this.articleId && data.article?._id) {
        this.articleId = data.article._id;
        window.history.replaceState({}, '', `/reporter/edit/${this.articleId}`);
      }

      this.lastSavedPayload = payload;
      this.setStatus('saved', `נשמר בהצלחה (${new Date().toLocaleTimeString('he-IL')})`);
    } catch (err) {
      console.error('Autosave sync error:', err);
      this.setStatus('error', 'שגיאה בסנכרון לשרת (נשמר מקומית בדפדפן)');
    }
  }

  setStatus(type, text) {
    if (!this.statusIndicator) return;
    this.statusIndicator.textContent = text;
    this.statusIndicator.className = `autosave-badge autosave-${type}`;
  }
}
