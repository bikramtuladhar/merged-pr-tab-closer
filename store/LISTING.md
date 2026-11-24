# Chrome Web Store listing

Fill these in at https://chrome.google.com/webstore/devconsole after uploading `dist/merged-pr-tab-closer-1.0.0.zip`.

## Store listing tab

**Name** (from manifest): Merged PR Tab Closer for GitHub

**Summary** (from manifest, max 132 chars):
Groups merged GitHub pull request tabs and shows how many are open. Click the icon to close them all.

**Description:**
```
Done reviewing and merging pull requests, and now your tab bar is full of PRs you no longer need? This extension tidies them up.

• Merged PRs gather in their own group
As soon as a pull request is merged, including one you just merged yourself, its tab moves into a purple "Merged PRs" tab group.

• See the count at a glance
The toolbar icon shows how many open tabs are merged pull requests.

• Close them in one click
Click the icon to close every merged pull request tab. Open PRs, closed-but-unmerged PRs and all your other tabs stay where they are.

Details
• Works with the GitHub pull request page as you see it, including private repositories you can already access. No token or sign-in needed.
• Pinned tabs are never grouped.
• Nothing is collected or sent anywhere. The extension makes no network requests.

Not affiliated with or endorsed by GitHub, Inc.
```

**Category:** Developer Tools
**Language:** English

**Graphics** (in `store/`):
- Store icon (128×128): `icons/icon128.png`
- Screenshots (1280×800): `store/screenshot-1-grouped.png`, `store/screenshot-2-closed.png`
- Small promo tile (440×280): `store/promo-tile-440x280.png`

## Privacy practices tab

**Single purpose:**
```
Finds open GitHub pull request tabs whose pull request has been merged, groups them, shows their count on the toolbar icon and closes them when the icon is clicked.
```

**Permission justifications:**
- **scripting:** ```Adds the extension's content script to GitHub pull request tabs that were already open when the extension was installed or updated, so their merged state can be detected without reloading them.```
- **tabGroups:** ```Creates and names the "Merged PRs" tab group and moves merged pull request tabs into it.```
- **Host permission (https://github.com/\*):** ```Reads the pull request page on github.com to see whether the pull request is merged, and finds which open tabs are GitHub pull requests. No other sites are accessed.```
- **Remote code:** No, I am not using remote code.

**Data usage:** tick none of the data types. Then tick all three statements:
- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** https://github.com/bikramtuladhar/merged-pr-tab-closer/blob/main/PRIVACY.md

**Homepage / support URL:** https://github.com/bikramtuladhar/merged-pr-tab-closer

## Distribution tab
Visibility: Public (or Unlisted to share by link only). Regions: All.
