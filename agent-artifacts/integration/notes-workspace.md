# Notes workspace

AJ Notes uses the shared AppLauncher with `currentApp="notes"`. Its compact top sidebar toolbar groups Apps, Sync, Settings, and Sign out. Icon controls retain accessible names and tooltips; sync exposes its pending count in the tooltip.

The workspace keeps labels and note previews brief. Folder and summary-version dropdowns use compact rounded styling, a consistent chevron, and keyboard focus indicators. Folder creation prompts for a name, trims whitespace, and ignores canceled or blank input.

Each note row has a separate, always-visible delete button. Both row and document delete actions ask for confirmation before deleting the note and its summaries. Folder and summary deletion also require confirmation. Signing out always requires confirmation, with an additional unsynced-change warning when needed.

Implementation and browser acceptance checks live in `aj-notes/components/workspace.tsx`, `app/globals.css`, and `scripts/browser-check.cjs`. Use the Notes repository's `VALIDATION.md` for test scope and commands. Shared launcher behavior and registry contracts remain defined in the launcher architecture documentation.
