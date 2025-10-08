(function(){
  const STORAGE_KEY = 'aincraft_clicker_v1';

  /** @type {{ totalMined:number; perClick:number; perSec:number; upgradeCost:number }} */
  let state = { totalMined: 0, perClick: 1, perSec: 0, upgradeCost: 10 };

  // Elements
  const elTotal = document.getElementById('totalMined');
  const elPerClick = document.getElementById('perClick');
  const elPerSec = document.getElementById('perSec');
  const elBlock = document.getElementById('block');
  const elUpgrade = document.getElementById('upgradeClick');
  const elUpgradeCost = document.getElementById('upgradeCost');
  const elReset = document.getElementById('reset');
  const leftPanel = document.querySelector('.left');

  // Load
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      state = {
        totalMined: Number(saved.totalMined) || 0,
        perClick: Math.max(1, Number(saved.perClick) || 1),
        perSec: Math.max(0, Number(saved.perSec) || 0),
        upgradeCost: Math.max(10, Number(saved.upgradeCost) || 10)
      };
    }
  } catch (_) { /* ignore */ }

  function format(n){
    if (n < 1000) return String(n);
    if (n < 1e6) return (n/1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    if (n < 1e9) return (n/1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    return (n/1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  }

  function render(){
    elTotal.textContent = String(state.totalMined);
    elPerClick.textContent = String(state.perClick);
    elPerSec.textContent = String(state.perSec);
    elUpgradeCost.textContent = `Cost: ${format(state.upgradeCost)}`;
    elUpgrade.disabled = state.totalMined < state.upgradeCost;
  }

  function save(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function addHitEffect(){
    elBlock.classList.remove('hit');
    void elBlock.offsetWidth; // restart animation
    elBlock.classList.add('hit');
  }

  function spawnFloat(amount, x, y){
    if (!leftPanel) return;
    const el = document.createElement('div');
    el.className = 'float';
    el.textContent = `+${amount}`;
    leftPanel.appendChild(el);
    const rect = leftPanel.getBoundingClientRect();
    el.style.left = (x - rect.left) + 'px';
    el.style.top = (y - rect.top) + 'px';
    setTimeout(() => el.remove(), 800);
  }

  function mine(event){
    state.totalMined += state.perClick;
    addHitEffect();
    if (event && 'clientX' in event) {
      spawnFloat(state.perClick, event.clientX, event.clientY);
    } else {
      // Fallback spawn near the center of block
      const br = elBlock.getBoundingClientRect();
      spawnFloat(state.perClick, br.left + br.width/2, br.top + br.height/2);
    }
    render();
    save();
  }

  // Click and keyboard
  elBlock.addEventListener('click', mine);
  elBlock.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); mine(e); }
  });

  // Upgrade button
  elUpgrade.addEventListener('click', () => {
    if (state.totalMined >= state.upgradeCost) {
      state.totalMined -= state.upgradeCost;
      state.perClick += 1;
      state.upgradeCost = Math.ceil(state.upgradeCost * 1.65);
      render();
      save();
    }
  });

  // Autosave and passive income (optional perSec, defaults 0)
  setInterval(() => {
    if (state.perSec > 0) {
      state.totalMined += state.perSec;
      render();
    }
    save();
  }, 1500);

  // Reset
  elReset.addEventListener('click', () => {
    const ok = confirm('Reset progress?');
    if (!ok) return;
    state = { totalMined: 0, perClick: 1, perSec: 0, upgradeCost: 10 };
    render();
    save();
  });

  render();
})();
