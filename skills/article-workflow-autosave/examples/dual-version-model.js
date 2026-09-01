/**
 * Dual-Version Published Article Revision Controller (Express / Mongoose)
 * Handles drafting updates to published articles without altering the live version.
 */

const Article = require('../../the-daily-web-spec/references/database-schemas');

/**
 * Reporter autosaves edits to an article
 */
exports.autosaveArticle = async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, category, imageUrl } = req.body;
  const userId = req.session.user._id;

  const article = await Article.findById(id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  // Authorization check: only the author or an editor can edit
  if (article.author.toString() !== userId.toString() && req.session.user.role !== 'editor') {
    return res.status(403).json({ error: 'Unauthorized to edit this article' });
  }

  if (article.status === 'published') {
    // Stage updates in pendingUpdate subdocument — LIVE VERSION UNTOUCHED
    article.pendingUpdate = {
      hasUpdate: true,
      title: title || article.title,
      summary: summary || article.summary,
      content: content || article.content,
      category: category || article.category,
      imageUrl: imageUrl || article.imageUrl,
      updatedAt: new Date()
    };
  } else {
    // Direct update for drafts or rejected articles
    if (title !== undefined) article.title = title;
    if (summary !== undefined) article.summary = summary;
    if (content !== undefined) article.content = content;
    if (category !== undefined) article.category = category;
    if (imageUrl !== undefined) article.imageUrl = imageUrl;
  }

  await article.save();
  res.json({ success: true, article });
};

/**
 * Reporter submits updated published article for editorial review
 */
exports.submitUpdateForApproval = async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  if (article.status === 'published') {
    if (!article.pendingUpdate?.hasUpdate) {
      return res.status(400).json({ error: 'No pending changes to submit' });
    }
    // Flag that the pending update is ready for review
    article.pendingUpdate.readyForReview = true;
  } else {
    article.status = 'pending';
  }

  await article.save();
  res.json({ success: true, message: 'הכתבה הוגשה לאישור עורך' });
};

/**
 * Editor approves pending update to a published article
 */
exports.approvePublishedUpdate = async (req, res) => {
  const { id } = req.params;
  const { changelogNote } = req.body;
  const editorId = req.session.user._id;

  const article = await Article.findById(id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  if (article.pendingUpdate?.hasUpdate) {
    // Merge staged changes into the live document
    article.title = article.pendingUpdate.title;
    article.summary = article.pendingUpdate.summary;
    article.content = article.pendingUpdate.content;
    article.category = article.pendingUpdate.category;
    if (article.pendingUpdate.imageUrl) article.imageUrl = article.pendingUpdate.imageUrl;

    // Reset pending update stage
    article.pendingUpdate.hasUpdate = false;

    // Record milestone update timestamp for Impact Analytics
    article.publishedUpdates.push({
      publishedAt: new Date(),
      editor: editorId,
      changelogNote: changelogNote || 'עדכון גרסה על ידי עורך'
    });
  } else {
    // Initial publication approval
    article.status = 'published';
    article.publishedAt = new Date();
  }

  await article.save();
  res.json({ success: true, message: 'העדכון אושר ופורסם בהצלחה' });
};
