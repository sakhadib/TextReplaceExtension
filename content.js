function replaceInTextNode(node, pairs) {
  let changed = false;
  let text = node.nodeValue;
  for (let [key, value] of Object.entries(pairs)) {
    if (text.includes(key)) {
      text = text.split(key).join(value);
      changed = true;
    }
  }
  if (changed) node.nodeValue = text;
}

function processAllTextNodes(pairs) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    replaceInTextNode(node, pairs);
  }
}

function setupObserver(pairs) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          replaceInTextNode(node, pairs);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
          let child;
          while ((child = walker.nextNode())) {
            replaceInTextNode(child, pairs);
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

chrome.storage.local.get('pairs', (data) => {
  const pairs = data.pairs || {};
  if (Object.keys(pairs).length === 0) return;

  // Initial sweep
  processAllTextNodes(pairs);

  // Live updates
  setupObserver(pairs);
});
