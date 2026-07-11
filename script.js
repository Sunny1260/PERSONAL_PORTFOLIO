// Mode switch (Data Analyst / Full-Stack Dev)
  const modeBtns = document.querySelectorAll('[data-mode-btn]');
  const heroTexts = document.querySelectorAll('[data-hero-text]');
  const heroPanels = document.querySelectorAll('[data-hero-panel]');
  const domainEls = document.querySelectorAll('[data-domain]');

  let modeInitialized = false;
  function setMode(mode){
    document.body.setAttribute('data-mode', mode);

    modeBtns.forEach(b => {
      const active = b.dataset.modeBtn === mode;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    heroTexts.forEach(el => el.classList.toggle('active', el.dataset.heroText === mode));
    heroPanels.forEach(el => el.classList.toggle('active', el.dataset.heroPanel === mode));

    domainEls.forEach(el => {
      const d = el.dataset.domain;
      const secondary = d !== 'both' && d !== mode;
      el.classList.toggle('is-secondary', secondary);
    });

    // re-run counters for the panel that just became visible (skip on first init — scroll observer handles that)
    if (modeInitialized) {
      const activePanel = document.querySelector('.hero-panel.active');
      if (activePanel) {
        activePanel.querySelectorAll('.counter').forEach(c => { c.textContent = '0'; });
        requestAnimationFrame(() => animateCounters(activePanel.querySelectorAll('.counter')));
      }
    }
  }

  modeBtns.forEach(b => b.addEventListener('click', () => setMode(b.dataset.modeBtn)));

  // initialize highlighting on load (default: analytics)
  setMode('analytics');
  modeInitialized = true;

  // Reveal on scroll
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Animate counters once the hero panel is visible
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animateCounters(list){
    list.forEach(c => {
      const target = parseFloat(c.dataset.target);
      if (reducedMotion) { c.textContent = target; return; }
      const duration = 1100;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        c.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  let counted = false;
  const dashEl = document.querySelector('.hero');
  const dashIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !counted) {
        counted = true;
        const activePanel = document.querySelector('.hero-panel.active');
        if (activePanel) animateCounters(activePanel.querySelectorAll('.counter'));
        dashIo.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (dashEl) dashIo.observe(dashEl);

  if (reducedMotion) {
    revealEls.forEach(el => el.classList.add('in'));
  }
