/**
 * Time-Series Aggregation Pipeline Controller (Express + Mongoose)
 * Aggregates hourly view counts and pairs them with update milestones.
 */

const mongoose = require('mongoose');
const ViewAnalytics = require('../../the-daily-web-spec/references/database-schemas');
const Article = require('../../the-daily-web-spec/references/database-schemas');

exports.getArticleAnalytics = async (req, res) => {
  const { id } = req.params;
  const { range = '7d' } = req.query; // '24h', '7d', '30d'

  const article = await Article.findById(id).select('title publishedAt publishedUpdates');
  if (!article) return res.status(404).json({ error: 'Article not found' });

  // Calculate cutoff timestamp
  const now = new Date();
  let startTime = new Date();
  if (range === '24h') startTime.setHours(now.getHours() - 24);
  else if (range === '30d') startTime.setDate(now.getDate() - 30);
  else startTime.setDate(now.getDate() - 7); // Default 7 days

  // Aggregate time-series view buckets
  const timelineData = await ViewAnalytics.aggregate([
    {
      $match: {
        article: new mongoose.Types.ObjectId(id),
        timestampBucket: { $gte: startTime, $lte: now }
      }
    },
    {
      $sort: { timestampBucket: 1 }
    },
    {
      $project: {
        _id: 0,
        timestamp: '$timestampBucket',
        views: '$views'
      }
    }
  ]);

  // Extract editor update milestones within this time range
  const milestones = (article.publishedUpdates || []).filter(u => {
    return new Date(u.publishedAt) >= startTime && new Date(u.publishedAt) <= now;
  });

  res.json({
    articleId: article._id,
    title: article.title,
    range,
    timelineData,
    updateMilestones: milestones
  });
};

/**
 * High-concurrency atomic view logging handler
 */
exports.recordViewEvent = async (articleId) => {
  // Truncate current time to hour bucket: YYYY-MM-DD-HH:00:00.000Z
  const now = new Date();
  const bucket = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);

  // Atomically increment total views in Article document
  await Article.findByIdAndUpdate(articleId, { $inc: { viewsCount: 1 } });

  // Atomically upsert hourly time-series view bucket
  await ViewAnalytics.findOneAndUpdate(
    { article: articleId, timestampBucket: bucket },
    { $inc: { views: 1 } },
    { upsert: true, new: true }
  );
};
