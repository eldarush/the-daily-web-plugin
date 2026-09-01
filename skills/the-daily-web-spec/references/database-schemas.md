# Database Schemas (Mongoose / MongoDB)

The project requires at least four primary Mongoose models with full CRUD operations.

---

## 1. User Model (`models/User.js`)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['reporter', 'editor'],
    default: 'reporter',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook: Hash password securely
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password verification method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

## 2. Article Model (`models/Article.js`)
Supports draft autosave, dual-version published updates, and text indexing for search.
```javascript
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    index: true
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    enum: ['News', 'Technology', 'Economy', 'Sports', 'Culture', 'Health', 'World'],
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    default: '/images/default-article.jpg'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected'],
    default: 'draft',
    index: true
  },
  editorNotes: {
    type: String,
    default: ''
  },
  viewsCount: {
    type: Number,
    default: 0,
    index: true
  },
  publishedAt: {
    type: Date,
    default: null,
    index: true
  },
  
  // Staging for edits made to an already-published article
  pendingUpdate: {
    hasUpdate: { type: Boolean, default: false },
    title: String,
    summary: String,
    content: String,
    category: String,
    imageUrl: String,
    updatedAt: Date
  },

  // History of editor update publication timestamps for Impact Analytics
  publishedUpdates: [
    {
      publishedAt: { type: Date, default: Date.now },
      editor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      changelogNote: String
    }
  ]
}, { timestamps: true });

// Text index for fast multi-field search
articleSchema.index({ title: 'text', summary: 'text', content: 'text' });

module.exports = mongoose.model('Article', articleSchema);
```

---

## 3. Comment Model (`models/Comment.js`)
```javascript
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
    index: true
  },
  authorName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: 1000
  },
  userIp: {
    type: String,
    required: true,
    index: true
  },
  isRegisteredUser: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Comment', commentSchema);
```

---

## 4. View Analytics Model (`models/ViewAnalytics.js`)
High-concurrency time-bucketed analytics storage.
```javascript
const mongoose = require('mongoose');

const viewAnalyticsSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
    index: true
  },
  // Time-bucketed per hour (YYYY-MM-DD-HH)
  timestampBucket: {
    type: Date,
    required: true,
    index: true
  },
  views: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Compound index for instant upsert & timeline querying
viewAnalyticsSchema.index({ article: 1, timestampBucket: 1 }, { unique: true });

module.exports = mongoose.model('ViewAnalytics', viewAnalyticsSchema);
```
