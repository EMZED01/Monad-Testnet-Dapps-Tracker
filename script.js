// Simple GitHub-JSON powered wallet checker
const WALLETS_JSON_URL = 'data/wallets.json';

const walletInput = document.getElementById('walletInput');
const checkBtn = document.getElementById('checkBtn');
const result = document.getElementById('result');
const grid = document.getElementById('grid');
const stats = document.getElementById('stats');

function getAllDappNames() {
  return Array.from(document.querySelectorAll('.card')).map(el => el.dataset.dapp);
}

function clearHighlights() {
  document.querySelectorAll('.card').forEach(card => {
    card.classList.remove('explored');
    card.classList.remove('dim');
  });
  stats.textContent = '';
}

function highlightDapps(dapps) {
  const set = new Set(dapps);
  const allCards = Array.from(document.querySelectorAll('.card'));
  let highlighted = 0;
  allCards.forEach(card => {
    if (set.has(card.dataset.dapp)) {
      card.classList.add('explored');
      highlighted++;
    } else {
      card.classList.add('dim');
    }
  });

  const total = allCards.length;
  const pct = total ? Math.round((highlighted / total) * 100) : 0;
  stats.textContent = `Explored ${highlighted} of ${total} dApps (${pct}%)`;
}

async function loadWalletMap() {
  const res = await fetch(WALLETS_JSON_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch wallets.json');
  return await res.json();
}

async function checkWallet() {
  const raw = walletInput.value.trim();
  clearHighlights();

  if (!raw) {
    result.textContent = 'Enter a wallet address.';
    return;
  }

  try {
    const map = await loadWalletMap();
    const key = normalizeKey(raw);
    const dapps = map[key];

    if (Array.isArray(dapps) && dapps.length) {
      result.textContent = `DApps explored for ${shorten(key)}: ${dapps.join(', ')}`;
      highlightDapps(dapps);
    } else {
      result.textContent = `No dApps found for ${shorten(key)}.`;
    }
  } catch (err) {
    console.error(err);
    result.textContent = 'Error fetching wallet data.';
  }
}

function normalizeKey(k) {
  // Keep simple and case-insensitive. You can tighten this to checksum later.
  return k.toLowerCase();
}

function shorten(k) {
  return k.length > 14 ? `${k.slice(0, 6)}…${k.slice(-4)}` : k;
}

checkBtn.addEventListener('click', checkWallet);
walletInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkWallet();
});

// helpful: show all dApp names console for maintainers
console.log('Available dApps:', getAllDappNames());
