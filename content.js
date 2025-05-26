function walk(node, callback) {
  if (node.nodeType === 3) { // Text node
    callback(node);
  } else {
    for (let child of node.childNodes) {
      walk(child, callback);
    }
  }
}

chrome.storage.local.get('pairs', (data) => {
  const pairs = data.pairs || {};
  if (!Object.keys(pairs).length) return;

  walk(document.body, (textNode) => {
    let text = textNode.nodeValue;
    for (let [key, value] of Object.entries(pairs)) {
      text = text.split(key).join(value);
    }
    textNode.nodeValue = text;
  });
});

