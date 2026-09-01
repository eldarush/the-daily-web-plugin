/**
 * Dynamic Filters, Live Search & Sorting Controller (Vanilla JS)
 * Coordinates search input debounce, category selector, and sort options.
 */

class FeedFilterController {
  constructor(feedInstance) {
    this.feed = feedInstance;
    this.searchInput = document.getElementById('search-input');
    this.categorySelect = document.getElementById('category-filter');
    this.viewFilterRadios = document.querySelectorAll('input[name="view-filter"]');
    this.sortSelect = document.getElementById('sort-select');
    
    this.debounceTimer = null;
    this.bindEvents();
  }

  bindEvents() {
    // 1. Search with debounce (300ms)
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.feed.activeFilters.search = e.target.value.trim();
          this.feed.loadNextBatch(true);
        }, 300);
      });
    }

    // 2. Category Filter
    if (this.categorySelect) {
      this.categorySelect.addEventListener('change', (e) => {
        this.feed.activeFilters.category = e.target.value;
        this.feed.loadNextBatch(true);
      });
    }

    // 3. Viewed / Unviewed Filter
    this.viewFilterRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.feed.activeFilters.viewFilter = e.target.value;
          this.feed.loadNextBatch(true);
        }
      });
    });

    // 4. Sorting (Newest vs Popular)
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.feed.activeFilters.sort = e.target.value;
        this.feed.loadNextBatch(true);
      });
    }
  }
}
