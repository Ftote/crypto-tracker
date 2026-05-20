'use strict';

// ─── Coin database (tickers locaux) ──────────────────────────────────────────

const COINS = {
  BTC:    { id: 'bitcoin',                  name: 'Bitcoin'           },
  ETH:    { id: 'ethereum',                 name: 'Ethereum'          },
  SOL:    { id: 'solana',                   name: 'Solana'            },
  BNB:    { id: 'binancecoin',              name: 'BNB'               },
  XRP:    { id: 'ripple',                   name: 'XRP'               },
  ADA:    { id: 'cardano',                  name: 'Cardano'           },
  DOGE:   { id: 'dogecoin',                 name: 'Dogecoin'          },
  AVAX:   { id: 'avalanche-2',              name: 'Avalanche'         },
  DOT:    { id: 'polkadot',                 name: 'Polkadot'          },
  LINK:   { id: 'chainlink',               name: 'Chainlink'         },
  MATIC:  { id: 'matic-network',            name: 'Polygon'           },
  POL:    { id: 'polygon-ecosystem-token',  name: 'POL'               },
  UNI:    { id: 'uniswap',                 name: 'Uniswap'           },
  LTC:    { id: 'litecoin',                name: 'Litecoin'          },
  BCH:    { id: 'bitcoin-cash',            name: 'Bitcoin Cash'      },
  ATOM:   { id: 'cosmos',                  name: 'Cosmos'            },
  XLM:    { id: 'stellar',                 name: 'Stellar'           },
  ALGO:   { id: 'algorand',               name: 'Algorand'          },
  SHIB:   { id: 'shiba-inu',              name: 'Shiba Inu'         },
  TRX:    { id: 'tron',                   name: 'TRON'              },
  NEAR:   { id: 'near',                   name: 'NEAR Protocol'     },
  FIL:    { id: 'filecoin',               name: 'Filecoin'          },
  ICP:    { id: 'internet-computer',      name: 'Internet Computer' },
  USDT:   { id: 'tether',                name: 'Tether'            },
  USDC:   { id: 'usd-coin',              name: 'USD Coin'          },
  DAI:    { id: 'dai',                   name: 'Dai'               },
  APE:    { id: 'apecoin',               name: 'ApeCoin'           },
  OP:     { id: 'optimism',              name: 'Optimism'          },
  ARB:    { id: 'arbitrum',              name: 'Arbitrum'          },
  INJ:    { id: 'injective-protocol',   name: 'Injective'         },
  SUI:    { id: 'sui',                  name: 'Sui'               },
  APT:    { id: 'aptos',               name: 'Aptos'             },
  TON:    { id: 'the-open-network',    name: 'Toncoin'           },
  PEPE:   { id: 'pepe',               name: 'Pepe'              },
  WIF:    { id: 'dogwifcoin',          name: 'dogwifhat'         },
  BONK:   { id: 'bonk',              name: 'Bonk'              },
  FLOKI:  { id: 'floki',             name: 'FLOKI'             },
  FET:    { id: 'fetch-ai',          name: 'Fetch.ai'          },
  RENDER: { id: 'render-token',      name: 'Render'            },
  GRT:    { id: 'the-graph',         name: 'The Graph'         },
  AAVE:   { id: 'aave',             name: 'Aave'              },
  MKR:    { id: 'maker',            name: 'Maker'             },
  CRV:    { id: 'curve-dao-token',  name: 'Curve DAO'         },
  LDO:    { id: 'lido-dao',         name: 'Lido DAO'          },
  SNX:    { id: 'havven',          name: 'Synthetix'         },
  SAND:   { id: 'the-sandbox',     name: 'The Sandbox'       },
  MANA:   { id: 'decentraland',    name: 'Decentraland'      },
  AXS:    { id: 'axie-infinity',   name: 'Axie Infinity'     },
  IMX:    { id: 'immutable-x',     name: 'Immutable X'       },
  STX:    { id: 'blockstack',      name: 'Stacks'            },
  HBAR:   { id: 'hedera-hashgraph',name: 'Hedera'            },
  VET:    { id: 'vechain',         name: 'VeChain'           },
  XTZ:    { id: 'tezos',          name: 'Tezos'             },
  HYPE:   { id: 'hyperliquid',    name: 'Hyperliquid'       },
  JUP:    { id: 'jupiter-exchange-solana', name: 'Jupiter'   },
  TIA:    { id: 'celestia',       name: 'Celestia'          },
  DYDX:   { id: 'dydx-chain',    name: 'dYdX'              },
  PYTH:   { id: 'pyth-network',  name: 'Pyth Network'      },
  STRK:   { id: 'starknet',      name: 'Starknet'          },
  WLD:    { id: 'worldcoin-wld', name: 'Worldcoin'         },
  SEI:    { id: 'sei-network',   name: 'Sei'               },
  TURBO:  { id: 'turbo',        name: 'Turbo'             },
  POPCAT: { id: 'popcat',       name: 'Popcat'            },
  PNUT:   { id: 'peanut-the-squirrel', name: 'Peanut'     },
  MOG:    { id: 'mog-coin',     name: 'Mog Coin'          },
  XMR:    { id: 'monero',       name: 'Monero'            },
  ETC:    { id: 'ethereum-classic', name: 'Ethereum Classic'},
  ZEC:    { id: 'zcash',        name: 'Zcash'             },
  DASH:   { id: 'dash',         name: 'Dash'              },
};

// ─── State ────────────────────────────────────────────────────────────────────

let assets       = [];
let prices       = {};
let pricesTs     = null;
let history      = [];
let currency     = 'usd';
let editingId    = null;
let selectedCoin = null;
let searchTimer  = null;
let clearStep    = 0;
let clearTimer   = null;
let sessionKey   = null; // AES-GCM CryptoKey, set after successful unlock

// ─── Storage ─────────────────────────────────────────────────────────────────

const store = {
  get:   ()    => new Promise(r => chrome.storage.local.get(null, r)),
  set:   (obj) => new Promise(r => chrome.storage.local.set(obj, r)),
  clear: ()    => new Promise(r => chrome.storage.local.clear(r)),
};

// ─── Crypto ───────────────────────────────────────────────────────────────────

function b64(buf) { return btoa(String.fromCharCode(...new Uint8Array(buf))); }
function unb64(s) { return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }

async function deriveKey(password, salt) {
  const raw = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    raw,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptVault(key) {
  const iv      = crypto.getRandomValues(new Uint8Array(12));
  const plain   = JSON.stringify({ assets, history, currency });
  const cipher  = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain)
  );
  return { iv: b64(iv), data: b64(cipher) };
}

async function decryptVault(vault, key) {
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(vault.iv) }, key, unb64(vault.data)
  );
  return JSON.parse(new TextDecoder().decode(plain));
}

async function saveVault() {
  if (!sessionKey) return;
  const vault = await encryptVault(sessionKey);
  await store.set({ vault });
}

// ─── XSS helper ──────────────────────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function fmtVal(v, cur) {
  if (cur === 'btc') return `₿${v.toFixed(8)}`;
  const s = cur === 'eur' ? '€' : '$';
  if (v >= 1e6)  return `${s}${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3)  return `${s}${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (v >= 1)    return `${s}${v.toFixed(2)}`;
  if (v >= 0.01) return `${s}${v.toFixed(4)}`;
  return `${s}${v.toFixed(6)}`;
}

function fmtShort(v) {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

function showErr(el, msg, ms = 3000) {
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), ms);
}

const $ = id => document.getElementById(id);

// ─── Screen helpers ───────────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  $(id).classList.remove('hidden');
}

function showModal(id) { $(id).classList.remove('hidden'); }
function hideModal(id) { $(id).classList.add('hidden'); }

// ─── Portfolio maths ──────────────────────────────────────────────────────────

function totalValue() {
  return assets.reduce((sum, a) => sum + (prices[a.id]?.[currency] ?? 0) * a.amount, 0);
}

function delta24h() {
  let now = 0, prev = 0;
  for (const a of assets) {
    const p = prices[a.id];
    if (!p) continue;
    const price = p[currency] ?? 0;
    const chg   = p[`${currency}_24h_change`] ?? 0;
    now  += price * a.amount;
    prev += (price / (1 + chg / 100)) * a.amount;
  }
  if (!prev) return { abs: 0, pct: 0 };
  return { abs: now - prev, pct: ((now - prev) / prev) * 100 };
}

// ─── History ──────────────────────────────────────────────────────────────────

async function saveSnapshot() {
  const today = new Date().toISOString().slice(0, 10);
  const val   = totalValue();
  history = history.filter(h => h.date !== today);
  history.push({ date: today, value: val });
  history.sort((a, b) => (a.date < b.date ? -1 : 1));
  if (history.length > 90) history = history.slice(-90);
  await saveVault();
}

// ─── Price fetch ──────────────────────────────────────────────────────────────

async function fetchPrices() {
  if (!assets.length) return;
  const ids = [...new Set(assets.map(a => a.id))].join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currency}&include_24hr_change=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  prices   = await res.json();
  pricesTs = Date.now();
  await store.set({ prices, pricesTs });
  await saveSnapshot();
}

// ─── CoinGecko search API ────────────────────────────────────────────────────

async function searchCoinGecko(query, localHits, sg) {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
    );
    if (!res.ok) return;
    const data = await res.json();
    const existingIds = new Set(localHits.map(h => h.id));
    const apiHits = (data.coins || [])
      .filter(c => !existingIds.has(c.id))
      .slice(0, 6)
      .map(c => ({ ticker: c.symbol.toUpperCase(), id: c.id, name: c.name }));
    renderSuggestions([...localHits, ...apiHits], sg);
  } catch (_) {}
}

function renderSuggestions(hits, sg) {
  if (!hits.length) { sg.innerHTML = ''; return; }
  sg.innerHTML = hits
    .map(h => `<div class="sug" data-ticker="${esc(h.ticker)}" data-id="${esc(h.id)}" data-name="${esc(h.name)}">
      ${esc(h.ticker)} <span>${esc(h.name)}</span>
    </div>`)
    .join('');
  sg.querySelectorAll('.sug').forEach(s =>
    s.addEventListener('click', () => {
      selectedCoin = { ticker: s.dataset.ticker, id: s.dataset.id, name: s.dataset.name };
      $('m-ticker').value = s.dataset.ticker;
      sg.innerHTML = '';
      $('m-amount').focus();
    })
  );
}

// ─── Chart ───────────────────────────────────────────────────────────────────

function drawChart() {
  const canvas = $('chart');
  const dpr  = window.devicePixelRatio || 1;
  const W    = 412;
  const H    = 110;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  if (history.length < 2) {
    ctx.fillStyle = '#c084fc48';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('AWAITING DATA — REFRESHES DAILY', W / 2, H / 2 - 4);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#c084fc30';
    ctx.fillText('(HISTORY BUILDS AS YOU USE THE TRACKER)', W / 2, H / 2 + 12);
    return;
  }

  const vals  = history.map(h => h.value);
  const dates = history.map(h => h.date);
  const minV  = Math.min(...vals) * 0.96;
  const maxV  = Math.max(...vals) * 1.04;
  const range = maxV - minV || 1;

  const pL = 50, pR = 8, pT = 8, pB = 20;
  const cW = W - pL - pR;
  const cH = H - pT - pB;

  // Grid
  ctx.lineWidth = 1;
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    const y = pT + cH * t;
    ctx.strokeStyle = '#c084fc15';
    ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(pL + cW, y); ctx.stroke();
    ctx.fillStyle = '#c084fc50';
    ctx.font = '8px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(fmtShort(maxV - range * t), pL - 4, y + 3);
  });

  const pts = vals.map((v, i) => ({
    x: pL + (i / (vals.length - 1)) * cW,
    y: pT + cH - ((v - minV) / range) * cH,
  }));

  // Area
  const grad = ctx.createLinearGradient(0, pT, 0, pT + cH);
  grad.addColorStop(0, '#c084fc32');
  grad.addColorStop(1, '#c084fc02');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pT + cH);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, pT + cH);
  ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 6;
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke(); ctx.shadowBlur = 0;

  // Last dot
  const last = pts[pts.length - 1];
  ctx.beginPath(); ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#c084fc';
  ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 10;
  ctx.fill(); ctx.shadowBlur = 0;

  // Dates
  ctx.fillStyle = '#c084fc55'; ctx.font = '8px monospace';
  ctx.textAlign = 'left';  ctx.fillText(dates[0].slice(5), pL, H - 4);
  ctx.textAlign = 'right'; ctx.fillText(dates[dates.length - 1].slice(5), pL + cW, H - 4);
}

// ─── Render dashboard ─────────────────────────────────────────────────────────

function render() {
  const total = totalValue();
  $('total-val').textContent = fmtVal(total, currency);

  const d    = delta24h();
  const sign = d.abs >= 0 ? '+' : '';
  const dEl  = $('total-delta');
  dEl.textContent = d.abs === 0
    ? '— 24H CHANGE'
    : `${sign}${fmtVal(Math.abs(d.abs), currency)}  (${sign}${d.pct.toFixed(2)}%)  24H`;
  dEl.className = `total-delta ${d.abs >= 0 ? 'pos' : 'neg'}`;

  if (pricesTs) {
    const m = Math.floor((Date.now() - pricesTs) / 60000);
    $('updated').textContent = m < 1 ? 'JUST NOW' : `${m}M AGO`;
  }

  drawChart();

  const list = $('assets-list');
  if (!assets.length) {
    list.innerHTML = '<div class="empty">NO ASSETS — CLICK + ADD TO BEGIN</div>';
    return;
  }

  const sorted = [...assets].sort((a, b) =>
    (prices[b.id]?.[currency] ?? 0) * b.amount -
    (prices[a.id]?.[currency] ?? 0) * a.amount
  );

  list.innerHTML = sorted.map(a => {
    const p   = prices[a.id]?.[currency] ?? 0;
    const chg = prices[a.id]?.[`${currency}_24h_change`] ?? null;
    const val = p * a.amount;
    const pct = total > 0 ? (val / total) * 100 : 0;
    const cs  = chg === null ? '' : chg >= 0 ? 'pos' : 'neg';
    const sg  = chg === null ? '' : chg >= 0 ? '+' : '';
    const chgTxt = chg === null ? '—' : `${sg}${chg.toFixed(2)}%`;
    return `<div class="row">
      <div class="row-top">
        <div class="row-left">
          <span class="sym">${esc(a.symbol)}</span>
          <span class="cname">${esc(a.name)}</span>
        </div>
        <div class="row-right">
          <span class="val">${p ? fmtVal(val, currency) : '—'}</span>
          <span class="pct-bar">${pct.toFixed(1)}%</span>
        </div>
      </div>
      <div class="row-bot">
        <span class="amt">${esc(a.amount)}</span>
        <span class="price">@ ${p ? fmtVal(p, currency) : '—'}</span>
        <span class="chg ${cs}">${chgTxt}</span>
        <span class="row-actions">
          <button class="ibtn ebtn" data-id="${esc(a.id)}">✎</button>
          <button class="ibtn dbtn" data-id="${esc(a.id)}">✕</button>
        </span>
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('.ebtn').forEach(b =>
    b.addEventListener('click', () => openEditModal(assets.find(a => a.id === b.dataset.id)))
  );
  list.querySelectorAll('.dbtn').forEach(b =>
    b.addEventListener('click', async () => {
      assets = assets.filter(a => a.id !== b.dataset.id);
      await saveVault();
      render();
    })
  );
}

// ─── Add / edit modal ─────────────────────────────────────────────────────────

function openAddModal() {
  editingId    = null;
  selectedCoin = null;
  $('m-title').textContent  = 'ADD ASSET';
  $('m-ticker').value       = '';
  $('m-ticker').disabled    = false;
  $('m-amount').value       = '';
  $('m-save').textContent   = 'ADD';
  $('m-err').classList.add('hidden');
  $('suggestions').innerHTML = '';
  showModal('add-modal');
  setTimeout(() => $('m-ticker').focus(), 50);
}

function openEditModal(a) {
  editingId    = a.id;
  selectedCoin = null;
  $('m-title').textContent  = `EDIT ${a.symbol}`;
  $('m-ticker').value       = a.symbol;
  $('m-ticker').disabled    = true;
  $('m-amount').value       = a.amount;
  $('m-save').textContent   = 'UPDATE';
  $('m-err').classList.add('hidden');
  $('suggestions').innerHTML = '';
  showModal('add-modal');
  setTimeout(() => $('m-amount').focus(), 50);
}

// ─── Save asset ───────────────────────────────────────────────────────────────

async function saveAsset() {
  const ticker = $('m-ticker').value.toUpperCase().trim();
  const amount = parseFloat($('m-amount').value);
  const err    = $('m-err');

  if (!ticker) { showErr(err, 'ENTER A TICKER SYMBOL'); return; }
  if (!amount || amount <= 0) { showErr(err, 'ENTER A VALID AMOUNT'); return; }

  // Resolve coin: local DB → API selection
  let coinInfo = COINS[ticker]
    ? { id: COINS[ticker].id, name: COINS[ticker].name }
    : (selectedCoin && selectedCoin.ticker === ticker)
      ? { id: selectedCoin.id, name: selectedCoin.name }
      : null;

  if (!coinInfo) {
    showErr(err, 'SELECT A COIN FROM THE SUGGESTIONS LIST');
    return;
  }

  if (editingId) {
    const a = assets.find(a => a.id === editingId);
    if (a) a.amount = amount;
  } else {
    const existing = assets.find(a => a.id === coinInfo.id);
    if (existing) {
      existing.amount = amount;
    } else {
      assets.push({ id: coinInfo.id, symbol: ticker, name: coinInfo.name, amount });
    }
  }

  await saveVault();
  hideModal('add-modal');
  render();
  doRefresh();
}

// ─── Refresh prices ───────────────────────────────────────────────────────────

async function doRefresh() {
  if (!assets.length) return;
  const btn = $('refresh-btn');
  btn.classList.add('spin');
  try {
    await fetchPrices();
    render();
  } catch (e) {
    showErr($('refresh-err'), 'FETCH FAILED — CHECK CONNECTION');
  } finally {
    btn.classList.remove('spin');
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // ── Fix logo paths in Chrome extension context ──
  const logoUrl = chrome.runtime.getURL('icons/logo.png');
  document.querySelectorAll('.lock-logo, .topbar-logo').forEach(el => {
    el.src = logoUrl;
  });

  const stored = await store.get();
  prices   = stored.prices   ?? {};
  pricesTs = stored.pricesTs ?? null;

  // ── Lock screen setup ──────────────────────────────────────────────────
  const isNew = !stored.salt;
  if (isNew) {
    $('lk-title').textContent = 'CREATE ACCESS CODE';
    $('lk-btn').textContent   = 'CREATE VAULT';
    $('lk-hint').textContent  = 'CHOOSE A MASTER PASSWORD';
  }
  showScreen('lock-screen');
  setTimeout(() => $('lk-pw').focus(), 80);

  // ── Unlock ────────────────────────────────────────────────────────────
  async function tryUnlock() {
    const pw = $('lk-pw').value;
    if (!pw) return;

    try {
      const fresh = await store.get();

      if (!fresh.salt) {
        // First time: generate salt, derive key, create empty vault
        const salt    = crypto.getRandomValues(new Uint8Array(16));
        sessionKey    = await deriveKey(pw, salt);
        assets = []; history = []; currency = 'usd';
        const vault   = await encryptVault(sessionKey);
        await store.set({ salt: b64(salt), vault });
        goToDashboard();
      } else {
        // Returning user: derive key and try to decrypt
        const salt = unb64(fresh.salt);
        const key  = await deriveKey(pw, salt);
        if (fresh.vault) {
          const data = await decryptVault(fresh.vault, key); // throws if wrong pw
          assets   = data.assets   ?? [];
          history  = data.history  ?? [];
          currency = data.currency ?? 'usd';
        } else {
          assets = []; history = []; currency = 'usd';
        }
        sessionKey = key;
        goToDashboard();
      }
    } catch (_) {
      $('lk-pw').value = '';
      showErr($('lk-err'), '⊗ ACCESS DENIED');
      setTimeout(() => $('lk-pw').focus(), 50);
    }
  }

  function goToDashboard() {
    $('cur-sel').value = currency;
    showScreen('dashboard');
    render();
    if (assets.length) doRefresh();
  }

  $('lk-btn').addEventListener('click', tryUnlock);
  $('lk-pw').addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });

  // ── Dashboard actions ─────────────────────────────────────────────────
  $('lock-btn').addEventListener('click', () => {
    sessionKey            = null;
    $('lk-pw').value      = '';
    $('lk-title').textContent = 'ACCESS CODE';
    $('lk-btn').textContent   = 'UNLOCK';
    $('lk-hint').textContent  = '';
    showScreen('lock-screen');
    setTimeout(() => $('lk-pw').focus(), 80);
  });

  $('refresh-btn').addEventListener('click', doRefresh);

  $('settings-btn').addEventListener('click', () => {
    $('cur-sel').value = currency;
    $('settings-err').classList.add('hidden');
    showModal('settings-modal');
  });

  $('add-btn').addEventListener('click', openAddModal);

  // ── Ticker input + live search ────────────────────────────────────────
  $('m-ticker').addEventListener('input', e => {
    const q  = e.target.value.toUpperCase().trim();
    const sg = $('suggestions');
    selectedCoin = null;

    if (!q) { sg.innerHTML = ''; return; }

    const localHits = Object.entries(COINS)
      .filter(([k, v]) => k.startsWith(q) || v.name.toUpperCase().startsWith(q))
      .slice(0, 6)
      .map(([k, v]) => ({ ticker: k, id: v.id, name: v.name }));

    renderSuggestions(localHits, sg);

    if (q.length >= 2) {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => searchCoinGecko(q, localHits, sg), 400);
    }
  });

  $('close-modal').addEventListener('click', () => hideModal('add-modal'));
  $('m-save').addEventListener('click', saveAsset);
  $('m-amount').addEventListener('keydown', e => { if (e.key === 'Enter') saveAsset(); });

  // ── Settings ──────────────────────────────────────────────────────────
  $('close-settings').addEventListener('click', () => hideModal('settings-modal'));

  $('cur-sel').addEventListener('change', async e => {
    currency = e.target.value;
    await saveVault();
    hideModal('settings-modal');
    doRefresh();
  });

  $('save-pw-btn').addEventListener('click', async () => {
    const np  = $('new-pw').value;
    const cp  = $('conf-pw').value;
    const err = $('settings-err');
    if (!np)       { showErr(err, 'ENTER A NEW PASSWORD'); return; }
    if (np !== cp) { showErr(err, 'PASSWORDS DO NOT MATCH'); return; }
    // Re-derive with new salt + re-encrypt vault
    const newSalt  = crypto.getRandomValues(new Uint8Array(16));
    const newKey   = await deriveKey(np, newSalt);
    sessionKey     = newKey;
    const vault    = await encryptVault(newKey);
    await store.set({ salt: b64(newSalt), vault });
    $('new-pw').value  = '';
    $('conf-pw').value = '';
    hideModal('settings-modal');
  });

  // Clear data (two-click safety)
  $('clear-btn').addEventListener('click', async () => {
    if (clearStep === 1) {
      clearTimeout(clearTimer);
      await store.clear();
      location.reload();
    } else {
      clearStep = 1;
      $('clear-btn').textContent = '⚠ CONFIRM — CLICK AGAIN';
      clearTimer = setTimeout(() => {
        clearStep = 0;
        $('clear-btn').textContent = 'CLEAR ALL DATA';
      }, 3500);
    }
  });
});
