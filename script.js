(() => {
  const scoreElement = document.getElementById("score");
  const mascotButton = document.getElementById("mascotButton");
  const resetButton = document.getElementById("resetBtn");

  const STORAGE_KEY = "daryl_clicker_score";

  function loadScore() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }

  function saveScore(value) {
    localStorage.setItem(STORAGE_KEY, String(value));
  }

  function formatNumber(n) {
    try {
      return new Intl.NumberFormat("uk-UA").format(n);
    } catch (_) {
      return String(n);
    }
  }

  let score = loadScore();

  function renderScore() {
    scoreElement.textContent = formatNumber(score);
  }

  function handleClick() {
    score += 1;
    saveScore(score);
    renderScore();

    // trigger small pop animation
    mascotButton.classList.remove("pop");
    // force reflow to restart animation
    void mascotButton.offsetWidth;
    mascotButton.classList.add("pop");
  }

  function handleReset() {
    const confirmed = window.confirm("Скинути рахунок?");
    if (!confirmed) return;
    score = 0;
    saveScore(score);
    renderScore();
  }

  mascotButton.addEventListener("click", handleClick);
  resetButton.addEventListener("click", handleReset);

  // Keyboard accessibility (Enter/Space)
  mascotButton.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  });

  renderScore();
})();