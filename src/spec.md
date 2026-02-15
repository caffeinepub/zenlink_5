# Specification

## Summary
**Goal:** Add a shareable “Version 11” export folder containing a complete snapshot of the current project files and clear sharing/ZIP instructions.

**Planned changes:**
- Create a new, clearly named export folder (e.g., `export/version11/` or `share/version11/`) that mirrors the app’s directory structure.
- Copy all current project source/config files into the export folder (including `backend/main.mo`, `backend/migration.mo`, `frontend/**`, and `project_state.json`) while preserving relative paths.
- Ensure the export excludes build artifacts and dependency folders (e.g., `node_modules`, `dist`, `.dfx`, `.mops`, `.git`).
- Add a single English README inside the export folder explaining WhatsApp-safe sharing (code/monospace guidance to prevent formatting changes) and how to ZIP the folder on Windows and macOS (optionally Linux).

**User-visible outcome:** A ready-to-share Version 11 export directory exists in the repo, containing the full project snapshot and a README with WhatsApp-safe sharing and ZIP instructions.
