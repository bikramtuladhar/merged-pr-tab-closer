importScripts("shared.js");

const PR_TAB_PATTERN = "https://github.com/*/*/pull/*";
const GROUP_TITLE = "Merged PRs";
const GROUP_COLOR = "purple";

// Ask every open PR tab whether its PR is merged.
async function findMergedTabs() {
  const tabs = await chrome.tabs.query({ url: PR_TAB_PATTERN });
  const checks = await Promise.all(tabs.map(async (tab) => {
    try {
      const reply = await chrome.tabs.sendMessage(tab.id, { type: "check" });
      return reply && reply.merged ? tab : null;
    } catch {
      return null; // tab still loading, discarded, or has no content script
    }
  }));
  return checks.filter(Boolean);
}

// Put merged PR tabs into a "Merged PRs" group (one per window), and take
// tabs out of that group once they no longer show a merged PR.
async function syncGroups(mergedTabs) {
  const ourGroups = await chrome.tabGroups.query({ title: GROUP_TITLE });
  const ourGroupIds = new Set(ourGroups.map((g) => g.id));
  const groupByWindow = new Map(ourGroups.map((g) => [g.windowId, g.id]));
  const mergedIds = new Set(mergedTabs.map((t) => t.id));

  // Tabs in our group that aren't merged PRs any more (e.g. navigated away).
  const strays = (await chrome.tabs.query({}))
    .filter((t) => ourGroupIds.has(t.groupId) && !mergedIds.has(t.id))
    .map((t) => t.id);
  if (strays.length) await chrome.tabs.ungroup(strays).catch(() => {});

  // Merged PR tabs not in our group yet, per window. Pinned tabs can't be grouped.
  const byWindow = new Map();
  for (const t of mergedTabs) {
    if (t.pinned || ourGroupIds.has(t.groupId)) continue;
    if (!byWindow.has(t.windowId)) byWindow.set(t.windowId, []);
    byWindow.get(t.windowId).push(t.id);
  }
  for (const [windowId, tabIds] of byWindow) {
    try {
      const existing = groupByWindow.get(windowId);
      if (existing != null) {
        await chrome.tabs.group({ groupId: existing, tabIds });
      } else {
        const groupId = await chrome.tabs.group({ tabIds, createProperties: { windowId } });
        await chrome.tabGroups.update(groupId, { title: GROUP_TITLE, color: GROUP_COLOR });
      }
    } catch { /* window closed or tabs moved meanwhile; next update retries */ }
  }
}

async function refresh() {
  const merged = await findMergedTabs();
  await syncGroups(merged);
  const n = merged.length;
  await chrome.action.setBadgeBackgroundColor({ color: "#8250df" });
  await chrome.action.setBadgeText({ text: n ? String(n) : "" });
  await chrome.action.setTitle({ title: n ? `Close ${n} merged PR tab${n > 1 ? "s" : ""}` : "No merged PR tabs" });
}

// Run refreshes one at a time so two tabs merging together can't create two groups.
let chain = Promise.resolve();
let timer;
function scheduleRefresh() {
  clearTimeout(timer);
  timer = setTimeout(() => { chain = chain.then(refresh).catch(() => {}); }, 300);
}

chrome.action.onClicked.addListener(() => {
  chain = chain.then(async () => {
    const merged = await findMergedTabs();
    if (merged.length) await chrome.tabs.remove(merged.map((t) => t.id));
    await refresh();
  }).catch(() => {});
});

chrome.runtime.onMessage.addListener((msg) => { if (msg.type === "state") scheduleRefresh(); });
chrome.tabs.onRemoved.addListener(scheduleRefresh);
chrome.tabs.onUpdated.addListener((_id, info) => { if (info.url || info.status === "complete") scheduleRefresh(); });

// Tabs that were open before the extension was installed or reloaded have no
// content script yet, so add it to them.
async function injectIntoOpenTabs() {
  const tabs = await chrome.tabs.query({ url: PR_TAB_PATTERN });
  await Promise.all(tabs.map((tab) =>
    chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["shared.js", "content.js"] }).catch(() => {})
  ));
  scheduleRefresh();
}
chrome.runtime.onInstalled.addListener(injectIntoOpenTabs);
chrome.runtime.onStartup.addListener(scheduleRefresh);
