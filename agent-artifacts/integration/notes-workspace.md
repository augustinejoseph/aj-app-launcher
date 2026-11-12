# Notes workspace

AJ Notes uses the shared AppLauncher with `currentApp="notes"`. Its top-right header groups Sync, Settings, Sign out, and an icon-only Apps trigger on mobile and desktop. Apps is the rightmost control, so its right-aligned popup opens inward without clipping; the header permits popup overflow and the panel scrolls within the viewport. Icon controls retain accessible names and tooltips; sync exposes its pending count in the tooltip.

The workspace keeps labels and note previews brief. Folder and summary-version dropdowns use compact rounded styling, a consistent chevron, and keyboard focus indicators. Folder creation prompts for a name, trims whitespace, and ignores canceled or blank input.

Each note row has a separate, always-visible delete button. Custom modal dialogs, with Cancel focused by default and Escape support, confirm all delete and sign-out actions. Both row and document delete actions ask for confirmation before deleting the note and its summaries. Folder and summary deletion also require confirmation. Signing out always requires confirmation, with an additional unsynced-change warning when needed.

Implementation and browser acceptance checks live in `aj-notes/components/workspace.tsx`, `app/globals.css`, and `scripts/browser-check.cjs`. Use the Notes repository's `VALIDATION.md` for test scope and commands. Shared launcher behavior and registry contracts remain defined in the launcher architecture documentation.

Notes have shareable routes at `/notes/[id]`; Settings is a page at `/settings`. The shared workspace layout keeps local writes and sync state alive across navigation. Native history navigation integrates with Next.js pathname updates and supports Back/Forward without requiring a network request. Server routes support direct opening and refreshing; the service worker shell supports reopening these routes offline.

Image embedding imports public HTTPS sources into internal attachments via an authenticated, same-origin API; external URLs are never saved in note documents. Uploads up to 25 MB are compressed in the browser when over 1 MB, targeting at most a 2560-pixel edge and 1 MB. Stored attachments stay within 4 MB; GIF animation is preserved within that limit. Imported and uploaded images use the same offline storage and sync path.
