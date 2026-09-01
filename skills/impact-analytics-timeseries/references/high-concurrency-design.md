# High-Concurrency Time-Series Architecture Design

The project requirement states:
> *"יש להניח שהאתר עשוי לשרת אלפי קוראים במקביל. עליכם להחליט כיצד נכון לאסוף, לייצג ולשמור את הנתונים האלו כדי לתמוך בגרף המבוקש."*
> *(Assume the site serves thousands of concurrent readers. Design how to collect, represent, and store data to support the requested impact graph.)*

---

## 1. Why Naive Approaches Fail
- **Anti-Pattern 1: Inserting a new document on every page view**:
  If 10,000 visitors read an article in an hour, inserting 10,000 individual `ViewEvent` documents causes index bloat, heavy I/O disk writes, and slow `$group` aggregation queries.
- **Anti-Pattern 2: Storing arrays of timestamps in the article document**:
  Pushing timestamps into an array inside the `Article` document causes the MongoDB document to continuously grow, resulting in document relocation and exceeding the 16MB document limit.

---

## 2. Recommended Solution: Pre-Aggregated Hourly Bucketing

We use the **Mongoose Bucket Pattern** with atomic `$inc` upserts:

```javascript
// Compound unique index:
viewAnalyticsSchema.index({ article: 1, timestampBucket: 1 }, { unique: true });

// Atomic Ingestion (Single quick operation):
await ViewAnalytics.updateOne(
  { article: articleId, timestampBucket: currentHourBucket },
  { $inc: { views: 1 } },
  { upsert: true }
);
```

### Advantages
1. **Constant Storage Size**: A 30-day timeline is represented by only $30 \times 24 = 720$ small documents per article, regardless of whether there were 1,000 or 10,000,000 views.
2. **Instant Timeline Queries**: Fetching timeline data requires a simple indexed `$match` and `$sort` on `timestampBucket`, running in under 2ms.
3. **Write Efficiency**: Leverages MongoDB's high-speed in-memory atomic counter increments (`$inc`).
