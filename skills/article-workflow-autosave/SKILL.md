---
name: article-workflow-autosave
description: >-
  Implementation guide for the reporter autosave engine, work continuity across browser
  restarts, dual-version published article revisions, and the editorial review diff viewer.
---

# Article Workflow, Autosave & Dual-Version Management

This skill provides patterns and architectural solutions for handling the article lifecycle:
1. **Continuous Autosave**: Debounced auto-sync to server + `localStorage` fallback to prevent any loss of work upon accidental tab close or machine change.
2. **Dual-Version Workflow**: Allows reporters to edit *already-published* articles while preserving the live public article unchanged until an editor approves the update.
3. **Editor Diff Viewer**: Visual side-by-side comparison between the currently published article and the proposed revision.

## Code Examples
- [Autosave Engine & Continuity Recovery](./examples/autosave-engine.js)
- [Dual-Version Schema & Controller Logic](./examples/dual-version-model.js)
- [Side-by-Side Diff Viewer (Vanilla JS)](./examples/diff-viewer.js)
- [Article State Machine Reference](./references/state-machine.md)
