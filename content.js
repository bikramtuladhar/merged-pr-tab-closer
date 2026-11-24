(() => {
  if (window.__gmpcLoaded) return; // guard against double injection
  window.__gmpcLoaded = true;

  // Looks only at the PR header, so "Merged" badges of other PRs referenced in
  // the timeline don't count. Covers the classic and the React PR UI.
  function isMerged() {
    if (!PR_PATH_RE.test(location.pathname)) return false;
    const headers = document.querySelectorAll(
      '#partial-discussion-header, .gh-header-meta, .gh-header-sticky, [data-testid="issue-header"], [class*="PageHeader"], [class*="PullRequestHeader"]'
    );
    for (const h of headers) {
      if (h.querySelector('.State--merged, [title="Status: Merged"], [data-status="pullMerged"]')) return true;
      for (const el of h.querySelectorAll('span.State, [class*="StateLabel"], [data-component="StateLabel"]')) {
        if (el.textContent.trim().toLowerCase() === "merged") return true;
      }
    }
    return false;
  }

  // Tell the background when the state changes (e.g. you just clicked Merge).
  let last = null;
  let debounce;
  function report() {
    const now = isMerged();
    if (now === last) return;
    last = now;
    chrome.runtime.sendMessage({ type: "state", merged: now }).catch(() => {});
  }
  const schedule = () => { clearTimeout(debounce); debounce = setTimeout(report, 400); };

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true, subtree: true, attributes: true, attributeFilter: ["class", "title", "data-status"],
  });
  document.addEventListener("turbo:load", schedule);
  window.addEventListener("popstate", schedule);
  report();

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "check") sendResponse({ merged: isMerged() });
  });
})();
