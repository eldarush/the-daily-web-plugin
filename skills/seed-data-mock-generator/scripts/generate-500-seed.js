/**
 * Seed Script: Generates 500+ Articles, Users, Comments & Analytics
 * Run via: node scripts/generate-500-seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/the_daily_web';

// Inline Schemas for stand-alone execution
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  fullName: { type: String },
  role: { type: String, enum: ['reporter', 'editor'] }
});

const articleSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  category: String,
  imageUrl: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft', 'pending', 'published', 'rejected'] },
  editorNotes: String,
  viewsCount: { type: Number, default: 0 },
  publishedAt: Date,
  pendingUpdate: {
    hasUpdate: { type: Boolean, default: false },
    title: String,
    summary: String,
    content: String,
    category: String,
    imageUrl: String
  },
  publishedUpdates: [
    {
      publishedAt: Date,
      editor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      changelogNote: String
    }
  ]
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  authorName: String,
  content: String,
  userIp: String,
  createdAt: { type: Date, default: Date.now }
});

const viewAnalyticsSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  timestampBucket: Date,
  views: Number
});

const User = mongoose.model('User', userSchema);
const Article = mongoose.model('Article', articleSchema);
const Comment = mongoose.model('Comment', commentSchema);
const ViewAnalytics = mongoose.model('ViewAnalytics', viewAnalyticsSchema);

const CATEGORIES = ['News', 'Technology', 'Economy', 'Sports', 'Culture', 'Health', 'World'];

const HEADLINES = [
  'מהפכת ה-AI בעולם הפיתוח: כלים חדשים שמשנים את חוקי המשחק',
  'פריצת דרך מדעית בתחום האנרגיה הירוקה והקיימות',
  'שוק ההייטק מציג התאוששות מרשימה ברבעון האחרון',
  'משחק הגמר הדרמטי שהוכרע בדקה ה-90',
  'תערוכת אמנות דיגיטלית בינלאומית נפתחת השבוע',
  'מחקר חדש חושף: הרגלי שינה שמשפרים את התפקוד הקוגניטיבי',
  'הסכם סחר היסטורי נחתם בין מדינות האזור',
  'השקת הדור הבא של מעבדים מהירים למחשבים אישיים',
  'האם הרכב האוטונומי כבר מוכן לעלייה לכביש?',
  'פסטיבל קולנוע קיצי מציג יצירות ישראליות מקוריות'
];

async function seed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Article.deleteMany({}),
    Comment.deleteMany({}),
    ViewAnalytics.deleteMany({})
  ]);

  console.log('Creating users (1 Editor, 4 Reporters)...');
  const passwordHash = await bcrypt.hash('123456', 10);

  const editor = await User.create({
    username: 'editor',
    password: passwordHash,
    fullName: 'דנה כהן (עורכת ראשית)',
    role: 'editor'
  });

  const reporters = await User.create([
    { username: 'reporter1', password: passwordHash, fullName: 'אלדר לוי (כתב טכנולוגיה)', role: 'reporter' },
    { username: 'reporter2', password: passwordHash, fullName: 'נועה אברהם (כתבת כלכלה)', role: 'reporter' },
    { username: 'reporter3', password: passwordHash, fullName: 'יוסי ברק (כתב ספורט)', role: 'reporter' },
    { username: 'reporter4', password: passwordHash, fullName: 'מיכל שחר (כתבת חדשות)', role: 'reporter' }
  ]);

  console.log('Generating 500+ articles...');
  const articlesToInsert = [];
  const now = Date.now();

  for (let i = 1; i <= 520; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const headline = HEADLINES[i % HEADLINES.length] + ` (#${i})`;
    const author = reporters[i % reporters.length];
    
    // Status distribution: 75% published, 10% draft, 10% pending, 5% rejected
    let status = 'published';
    let editorNotes = '';
    let pendingUpdate = { hasUpdate: false };
    let publishedUpdates = [];
    let publishedAt = new Date(now - Math.floor(Math.random() * 30 * 86400000));

    if (i % 10 === 0) {
      status = 'draft';
      publishedAt = null;
    } else if (i % 10 === 1) {
      status = 'pending';
      publishedAt = null;
    } else if (i % 20 === 2) {
      status = 'rejected';
      editorNotes = 'נא להרחיב על מקורות המידע ולבדוק ניסוח בפסקה השנייה.';
      publishedAt = null;
    }

    // Special: Add post-publication updates to selected articles for Analytics testing
    if (status === 'published' && i <= 10) {
      publishedUpdates.push({
        publishedAt: new Date(publishedAt.getTime() + 86400000),
        editor: editor._id,
        changelogNote: 'עדכון נתונים וציטוטים רשמיים לאחר מסיבת העיתונאים'
      });
      if (i <= 5) {
        pendingUpdate = {
          hasUpdate: true,
          title: headline + ' [גרסה מעודכנת]',
          summary: 'תקציר מעודכן הממתין לאישור עורך.',
          content: 'תוכן כתבה מעודכן עם נתונים חדשים הממתינים לבדיקה ואישור עורכת האתר.',
          category
        };
      }
    }

    const viewsCount = status === 'published' ? Math.floor(Math.random() * 5000) + 50 : 0;

    articlesToInsert.push({
      title: headline,
      summary: `תקציר מקיף אודות ${headline}. סקירה של העובדות העיקריות וההשלכות של הנושא.`,
      content: `פסקה ראשונה: מבוא מעמיק ומפורט אודות ההתפתחויות האחרונות בנושא ${headline}.\n\nפסקה שנייה: ניתוח של מומחים ודעות שונות מפי בכירים בתחום.\n\nפסקה שלישית: מבט לעתיד וההשלכות הצפויות בימים הקרובים.`,
      category,
      imageUrl: `https://picsum.photos/seed/${i}/800/450`,
      author: author._id,
      status,
      editorNotes,
      viewsCount,
      publishedAt,
      pendingUpdate,
      publishedUpdates
    });
  }

  const createdArticles = await Article.insertMany(articlesToInsert);
  console.log(`Inserted ${createdArticles.length} articles.`);

  console.log('Generating comments & time-series view analytics for published articles...');
  const commentsToInsert = [];
  const analyticsToInsert = [];

  for (const art of createdArticles) {
    if (art.status !== 'published') continue;

    // Create 1-5 sample comments
    const commentCount = Math.floor(Math.random() * 4) + 1;
    for (let c = 0; c < commentCount; c++) {
      commentsToInsert.push({
        article: art._id,
        authorName: `קורא_${Math.floor(Math.random() * 1000)}`,
        content: `כתבה מעניינת מאוד! תודה על המידע המפורט.`,
        userIp: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        createdAt: new Date(art.publishedAt.getTime() + (c + 1) * 3600000)
      });
    }

    // For the top 15 articles, generate detailed hourly time-series analytics (7 days)
    if (art.publishedUpdates.length > 0 || createdArticles.indexOf(art) < 15) {
      for (let h = 0; h < 168; h++) { // 168 hours = 7 days
        const bucketTime = new Date(now - (168 - h) * 3600000);
        bucketTime.setMinutes(0, 0, 0);

        // Boost views after update timestamp
        let baseViews = Math.floor(Math.random() * 20) + 5;
        if (art.publishedUpdates.length > 0 && bucketTime >= art.publishedUpdates[0].publishedAt) {
          baseViews *= 3; // Visible spike after update
        }

        analyticsToInsert.push({
          article: art._id,
          timestampBucket: bucketTime,
          views: baseViews
        });
      }
    }
  }

  if (commentsToInsert.length) await Comment.insertMany(commentsToInsert);
  if (analyticsToInsert.length) await ViewAnalytics.insertMany(analyticsToInsert);

  console.log(`Successfully generated ${commentsToInsert.length} comments and ${analyticsToInsert.length} analytics time buckets.`);
  console.log('\n--- SEED COMPLETE ---');
  console.log('Editor login: username=editor, password=123456');
  console.log('Reporter login: username=reporter1, password=123456');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed script error:', err);
  process.exit(1);
});
