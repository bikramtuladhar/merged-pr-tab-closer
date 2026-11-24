# Merged PR Tab Closer for GitHub

A Chrome extension (Manifest V3). The toolbar icon shows how many open tabs are GitHub PRs that have been merged. Click the icon to close those tabs.

## Install
1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and pick this folder
4. Pin the extension to the toolbar so you can see the count

## How it works
- A content script on each PR tab (`github.com/<owner>/<repo>/pull/<n>`) reads the state badge in the PR header and reports when it changes to merged (for example, right after you click Merge).
- The background script keeps the count on the icon up to date.
- Merged PR tabs are moved into a purple **Merged PRs** tab group in their window (pinned tabs stay where they are). A tab that navigates away from a merged PR is taken out of the group.
- Clicking the icon closes every open PR tab whose PR is merged. Open and closed-but-unmerged PRs stay open.
- PR tabs that were already open when you install or reload the extension are picked up too.

## Release
1. Bump `version` in `manifest.json`
2. Run `scripts/build.sh`. It writes `dist/merged-pr-tab-closer-<version>.zip`
3. Upload the zip in the [Chrome Web Store developer console](https://chrome.google.com/webstore/devconsole). Listing text, permission explanations and images are in `store/`.
