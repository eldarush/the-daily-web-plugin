/**
 * Infinite Scroll with IntersectionObserver (Vanilla JS)
 * Loads articles in batches of 20 when user approaches the bottom of the feed.
 */

class NewsFeedInfiniteScroll {
  constructor(options = {}) {
    this.feedContainer = document.getElementById(options.feedContainerId || 'news-feed');
    this.sentinel = document.getElementById(options.sentinelId || 'feed-sentinel');
    this.loadingSpinner = document.getElementById(options.spinnerId || 'feed-loading');
    
    this.page = 1;
    this.limit = 20;
    this.isLoading = false;
    this.hasMore = true;
    
    this.activeFilters = {
      category: '',
      viewFilter: 'all', // 'all', 'viewed', 'unviewed'
      sort: 'newest',    // 'newest', 'popular'
      search: ''
    };

    this.initObserver();
  }

  initObserver() {
    if (!this.sentinel) return;

    const observerOptions = {
      root: null,
      rootMargin: '250px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !this.isLoading && this.hasMore) {
        this.loadNextBatch();
      }
    }, observerOptions);

    this.observer.observe(this.sentinel);
  }

  async loadNextBatch(reset = false) {
    if (this.isLoading) return;
    if (reset) {
      this.page = 1;
      this.hasMore = true;
      this.feedContainer.innerHTML = '';
    }
    if (!this.hasMore) return;

    this.isLoading = true;
    this.setLoadingState(true);

    try {
      const params = new URLSearchParams({
        page: this.page,
        limit: this.limit,
        category: this.activeFilters.category,
        sort: this.activeFilters.sort,
        search: this.activeFilters.search
      });

      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const articles = data.articles || [];

      // Filter client-side for viewed/unviewed if requested
      const filteredArticles = this.applyLocalViewFilter(articles);

      if (filteredArticles.length > 0) {
        this.renderArticles(filteredArticles);
        this.page++;
      }

      this.hasMore = data.hasMore && articles.length >= this.limit;
      if (!this.hasMore) {
        this.renderEndOfFeed();
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
      this.renderError('Unable to load articles. Please check your connection.');
    } finally {
      this.isLoading = false;
      this.setLoadingState(false);
    }
  }

  applyLocalViewFilter(articles) {
    if (this.activeFilters.viewFilter === 'all') return articles;
    const viewedIds = JSON.parse(localStorage.getItem('viewed_articles') || '[]');
    
    if (this.activeFilters.viewFilter === 'viewed') {
      return articles.filter(a => viewedIds.includes(a._id));
    } else if (this.activeFilters.viewFilter === 'unviewed') {
      return articles.filter(a => !viewedIds.includes(a._id));
    }
    return articles;
  }

  renderArticles(articles) {
    const fragment = document.createDocumentFragment();

    articles.forEach(article => {
      const card = document.createElement('article');
      card.className = 'article-card';
      card.dataset.id = article._id;

      const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      card.innerHTML = `
        <a href="/articles/${article._id}" class="card-image-link">
          <img src="${article.imageUrl || '/images/default-article.jpg'}" alt="${this.escapeHtml(article.title)}" loading="lazy" class="card-thumbnail">
          <span class="category-badge">${this.escapeHtml(article.category)}</span>
        </a>
        <div class="card-content">
          <h2 class="card-title">
            <a href="/articles/${article._id}">${this.escapeHtml(article.title)}</a>
          </h2>
          <p class="card-summary">${this.escapeHtml(article.summary)}</p>
          <div class="card-meta">
            <span class="card-author">${this.escapeHtml(article.author?.fullName || 'מערכת')}</span>
            <span class="card-date">${formattedDate}</span>
            <span class="card-views"><i class="icon-eye"></i> ${article.viewsCount || 0} צפיות</span>
          </div>
        </div>
      `;

      fragment.appendChild(card);
    });

    this.feedContainer.appendChild(fragment);
  }

  setLoadingState(isLoading) {
    if (this.loadingSpinner) {
      this.loadingSpinner.style.display = isLoading ? 'flex' : 'none';
    }
  }

  renderEndOfFeed() {
    const notice = document.createElement('div');
    notice.className = 'feed-end-notice';
    notice.textContent = 'הגעת לסוף הפיד - אין כתבות נוספות להצגה';
    this.feedContainer.appendChild(notice);
  }

  renderError(msg) {
    const errBox = document.createElement('div');
    errBox.className = 'feed-error-box';
    errBox.innerHTML = `
      <p>${this.escapeHtml(msg)}</p>
      <button class="retry-btn" onclick="feed.loadNextBatch()">נסה שוב</button>
    `;
    this.feedContainer.appendChild(errBox);
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
