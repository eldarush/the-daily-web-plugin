# DOM Performance & Event Delegation in Vanilla JS

To maintain silky-smooth 60fps performance without frontend frameworks, follow these architectural principles:

## 1. Batching DOM Manipulations with `DocumentFragment`
Never append items directly to the DOM one-by-one inside a loop, which triggers layout recalculation (reflow) on every iteration:
```javascript
// BAD (Triggers 20 reflows):
articles.forEach(article => {
  container.appendChild(createCard(article));
});

// GOOD (Triggers single reflow):
const fragment = document.createDocumentFragment();
articles.forEach(article => {
  fragment.appendChild(createCard(article));
});
container.appendChild(fragment);
```

## 2. Event Delegation for Dynamic Elements
When rendering hundreds of article cards or comment lists dynamically, do not attach individual event listeners to each card or button:
```javascript
// Attach single listener on the parent container
container.addEventListener('click', (e) => {
  const target = e.target.closest('.action-btn');
  if (!target) return;
  const articleId = target.dataset.articleId;
  handleAction(articleId);
});
```

## 3. IntersectionObserver vs. Scroll Event Listeners
Avoid binding to `window.addEventListener('scroll', ...)` for infinite scrolling, as scroll events fire dozens of times per second and cause frame jank. Use `IntersectionObserver` on an invisible footer sentinel element with a comfortable `rootMargin: '250px'` threshold.
