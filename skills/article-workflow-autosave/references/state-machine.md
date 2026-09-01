# Article Lifecycle & State Machine Reference

## 1. Valid States
- `draft` (בהכנה)
- `pending` (ממתינה לאישור עורך)
- `published` (פורסמה)
- `rejected` (הוחזרה לתיקונים)

## 2. Transition Rules

| From State | Trigger Action | Actor | To State | Notes |
| :--- | :--- | :--- | :--- | :--- |
| *(None)* | Create Article | Reporter | `draft` | Auto-saved continuously |
| `draft` | Submit for Review | Reporter | `pending` | Moves to editor queue |
| `pending` | Approve & Publish | Editor | `published` | Sets `publishedAt = Date.now()` |
| `pending` | Return for Fixes | Editor | `rejected` | Must include `editorNotes` |
| `pending` | Direct Edit | Editor | `pending` | Editor modifies content directly |
| `rejected` | Resubmit Fixes | Reporter | `pending` | Reporter addresses feedback |
| `published` | Edit Content | Reporter | `published` | Uses `pendingUpdate` staging subdocument |
| `published` (with update) | Approve Update | Editor | `published` | Merges `pendingUpdate` into root; appends `publishedUpdates` entry |

**Strict Rule**: Any transition not listed in this matrix is forbidden and must be rejected by server middleware with HTTP 403 / 400.
