(function () {
  'use strict';

  function init() {

    // 1. LEETCODE ACTIVITY HEATMAP (Aug – Dec)
    const lcGraph        = document.getElementById('lc-graph');
    const lcSolvedEl     = document.getElementById('lc-solved');
    const lcEasyEl       = document.getElementById('lc-easy');
    const lcMediumEl     = document.getElementById('lc-medium');
    const lcHardEl       = document.getElementById('lc-hard');
    const lcActiveDaysEl = document.getElementById('lc-active-days');

    if (lcGraph) {
      const LC_USER    = 'g7pE7qxNks';
      const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const targetYear = new Date().getFullYear() - 1;
      const rangeStart = new Date(targetYear, 7, 1);

      // Activity offsets from Aug 1 of targetYear → intensity level (1–4)
      const ACTIVITY = {
        20: 1, 21: 2, 23: 1, 26: 3, 30: 1,
        34: 3, 35: 4, 36: 3, 37: 4, 38: 3, 39: 3, 40: 4, 41: 3, 42: 4,
        43: 3, 45: 4, 46: 3, 47: 3, 48: 2, 49: 2, 50: 2, 51: 2, 52: 2,
        53: 2, 54: 2, 55: 2, 56: 2, 57: 2, 58: 2, 59: 2, 60: 2,
        62: 2, 63: 2, 64: 2, 65: 2, 66: 2, 67: 2, 69: 2, 71: 2, 73: 2,
        76: 2, 77: 2, 78: 2, 82: 2, 83: 2, 84: 2, 90: 2, 91: 2,
        93: 2, 94: 2, 95: 2, 97: 2, 103: 3, 105: 2, 106: 2, 107: 2,
        108: 4, 109: 3, 110: 4, 111: 3, 112: 4, 113: 3, 114: 4, 115: 3,
        116: 4, 117: 3, 118: 2, 119: 2, 120: 2, 121: 2,
        122: 4, 123: 4, 124: 4, 125: 2, 126: 1, 127: 2, 128: 1, 129: 1,
        130: 3, 131: 1, 132: 1, 133: 2, 134: 1, 135: 2, 136: 1, 137: 1,
        138: 1, 139: 2, 140: 2, 141: 2, 142: 1, 143: 3, 144: 1, 145: 1,
        146: 1, 147: 4, 148: 3, 149: 2, 150: 1, 152: 1,
      };

      // Convert day offsets → { 'YYYY-MM-DD': level }
      const dateCalMap = {};
      Object.entries(ACTIVITY).forEach(([offset, level]) => {
        const d = new Date(rangeStart);
        d.setDate(d.getDate() + Number(offset));
        const key = [
          d.getFullYear(),
          String(d.getMonth() + 1).padStart(2, '0'),
          String(d.getDate()).padStart(2, '0'),
        ].join('-');
        dateCalMap[key] = level;
      });

      if (lcActiveDaysEl) lcActiveDaysEl.textContent = '120+';

      function buildGrid() {
        lcGraph.innerHTML = '';
        let globalCellIdx = 0;

        for (let month = 7; month <= 11; month++) {
          const daysInMonth = new Date(targetYear, month + 1, 0).getDate();
          const startDow    = new Date(targetYear, month, 1).getDay();

          const block = document.createElement('div');
          block.className = 'lc-month-block';

          const grid = document.createElement('div');
          grid.className = 'lc-month-grid';

          for (let e = 0; e < startDow; e++) {
            const ph = document.createElement('div');
            ph.className = 'lc-cell lc-empty';
            grid.appendChild(ph);
            globalCellIdx++;
          }

          for (let day = 1; day <= daysInMonth; day++) {
            const key   = `${targetYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const level = dateCalMap[key] || 0;

            const cell = document.createElement('div');
            cell.className = `lc-cell l${level}`;
            cell.style.setProperty('--cell-delay', `${globalCellIdx * 3}ms`);
            globalCellIdx++;
            grid.appendChild(cell);
          }

          const lbl = document.createElement('div');
          lbl.className   = 'lc-month-name';
          lbl.textContent = MONTH_NAMES[month];

          block.appendChild(grid);
          block.appendChild(lbl);
          lcGraph.appendChild(block);
        }

        // Double rAF: ensures DOM paint happens before class change triggers CSS transition
        requestAnimationFrame(() => requestAnimationFrame(() => {
          lcGraph.querySelectorAll('.lc-cell:not(.lc-empty)')
            .forEach(c => c.classList.add('lc-revealed'));
        }));
      }

      buildGrid();

      // @info 5-second abort timeout prevents hanging promise on slow/dead API
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 5000);

      fetch(`https://leetcode-stats-api.herokuapp.com/${LC_USER}`, { signal: controller.signal })
        .then(r => {
          clearTimeout(timeoutId);
          return r.ok ? r.json() : Promise.reject(r.status);
        })
        .then(data => {
          if (lcSolvedEl)  lcSolvedEl.textContent  = data.totalSolved  ?? '—';
          if (lcEasyEl)    lcEasyEl.textContent     = data.easySolved   ?? '—';
          if (lcMediumEl)  lcMediumEl.textContent   = data.mediumSolved ?? '—';
          if (lcHardEl)    lcHardEl.textContent     = data.hardSolved   ?? '—';
        })
        .catch(() => {
          if (lcSolvedEl)  lcSolvedEl.textContent  = '150+';
          if (lcEasyEl)    lcEasyEl.textContent     = '72';
          if (lcMediumEl)  lcMediumEl.textContent   = '64';
          if (lcHardEl)    lcHardEl.textContent     = '18';
        });
    }

    // 2. LIVE TIME (IST) — using Intl API for DST-safe, locale-correct formatting
    const timeEl = document.getElementById('live-time');
    if (timeEl) {
      function updateTime() {
        const time = new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        timeEl.textContent = `${time} IST`;
      }

      updateTime();
      const timeInterval = setInterval(updateTime, 30000);

      // Clear interval when page is hidden to reduce background work
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearInterval(timeInterval);
        } else {
          updateTime();
          setInterval(updateTime, 30000);
        }
      });
    }

    // 3. SCROLL-IN ANIMATIONS FOR CARDS
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.card-animate').forEach(el => cardObserver.observe(el));

    // 4. PROFICIENCY BAR ANIMATION
    const profCard = document.getElementById('skill-proficiency');
    if (profCard) {
      const barObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.prof-bar-fill').forEach((fill, i) => {
              const w = fill.getAttribute('data-width');
              if (w) {
                setTimeout(() => {
                  fill.style.width = `${w}%`;
                  fill.classList.add('animated');
                }, i * 100);
              }
            });
            barObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.2 }
      );
      barObserver.observe(profCard);
    }

    // 5. INJECT SKILLS NAV LINK if not already in navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const links = navbar.querySelectorAll('a');
      const hasSkills = [...links].some(a => a.getAttribute('href') === '#skills');
      if (!hasSkills) {
        const aboutLink = [...links].find(a => a.getAttribute('href') === '#about');
        if (aboutLink) {
          const skillsLink = document.createElement('a');
          skillsLink.href        = '#skills';
          skillsLink.textContent = 'Skills';
          aboutLink.parentNode.insertBefore(skillsLink, aboutLink.nextSibling);
        }
      }
    }

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
