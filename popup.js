const keyInput = document.getElementById('key');
const valueInput = document.getElementById('value');
const addBtn = document.getElementById('add');
const listEl = document.getElementById('list');

function updateUI(pairs) {
  listEl.innerHTML = '';
  for (let key in pairs) {
    const li = document.createElement('li');

    const textSpan = document.createElement('span');
    textSpan.textContent = `"${key}" → "${pairs[key]}"`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.className = 'remove-btn';
    removeBtn.addEventListener('click', async () => {
      const stored = await chrome.storage.local.get('pairs');
      const newPairs = stored.pairs || {};
      delete newPairs[key];
      await chrome.storage.local.set({ pairs: newPairs });
      updateUI(newPairs);
    });

    li.appendChild(textSpan);
    li.appendChild(removeBtn);
    listEl.appendChild(li);
  }
}

addBtn.addEventListener('click', async () => {
  const key = keyInput.value.trim();
  const value = valueInput.value.trim();
  if (!key || !value) return;

  const stored = await chrome.storage.local.get('pairs');
  const pairs = stored.pairs || {};
  pairs[key] = value;
  await chrome.storage.local.set({ pairs });

  keyInput.value = '';
  valueInput.value = '';
  updateUI(pairs);
});

document.addEventListener('DOMContentLoaded', async () => {
  const stored = await chrome.storage.local.get('pairs');
  updateUI(stored.pairs || {});
});
