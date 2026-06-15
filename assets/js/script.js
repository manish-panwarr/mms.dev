(function () {
  'use strict';

  // Triple-click fullscreen toggle
  let clickCount = 0;
  let clickTimer;

  document.addEventListener('click', () => {
    clickCount++;

    if (clickCount === 1) {
      clickTimer = setTimeout(() => { clickCount = 0; }, 500);
    }

    if (clickCount === 3) {
      clearTimeout(clickTimer);
      clickCount = 0;

      const el = document.documentElement;
      if (!document.fullscreenElement) {
        (el.requestFullscreen ?? el.webkitRequestFullscreen ?? el.msRequestFullscreen)?.call(el);
      } else {
        (document.exitFullscreen ?? document.webkitExitFullscreen ?? document.msExitFullscreen)?.call(document);
      }
    }
  });

  function init() {

    // Mobile nav toggle
    const menuIcon = document.getElementById('menu-icon');
    const navbar   = document.querySelector('.navbar');
    if (menuIcon && navbar) {
      menuIcon.onclick = () => {
        const open = menuIcon.classList.toggle('open');
        navbar.classList.toggle('active');
        menuIcon.setAttribute('aria-expanded', String(open));
      };
    }

    // Typed.js hero text
    if (document.querySelector('.typing-text') && typeof Typed !== 'undefined') {
      new Typed('.typing-text', {
        strings: ['Full-Stack Web Developer', 'AI/ML Engineer', 'Digital Growth Strategist'],
        typeSpeed: 70,
        backSpeed: 40,
        loop: true,
        showCursor: false,
      });
    }

    // Sticky header via sentinel element
    const header   = document.querySelector('header');
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:100px;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;';
    document.body.prepend(sentinel);

    const headerObserver = new IntersectionObserver(entries => {
      header?.classList.toggle('sticky', !entries[0].isIntersecting);
    });
    headerObserver.observe(sentinel);

    // Projects section interaction code removed - replaced by premium responsive bento grid.

    const form = document.getElementById('contact-form');
    const result = document.getElementById('form-result');
    const stepperContainer = document.getElementById('submission-stepper-container');
    const stepperHeaderTitle = document.getElementById('stepper-header-title');
    const stepperFill = document.getElementById('stepper-fill');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');
    const feedbackBox = document.getElementById('stepper-feedback-box');
    const btnSendAnother = document.getElementById('btn-send-another');

    if (form && stepperContainer && typeof emailjs !== 'undefined') {
      emailjs.init({
        publicKey: 'KtTU3xESwW-wK2pSy',
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Hide the main form layout and show stepper layout
        form.style.display = 'none';
        stepperContainer.style.display = 'flex';
        
        // Force reflow and add visible class for transition animation
        stepperContainer.getBoundingClientRect();
        stepperContainer.classList.add('visible');

        // 2. Initialize Stepper State
        // Step 1: Submitted (completed)
        step1.className = 'stepper-item completed';
        // Step 2: In Progress (active)
        step2.className = 'stepper-item active';
        step3.className = 'stepper-item';
        step4.className = 'stepper-item';
        
        stepperFill.style.width = '33.3%';
        stepperHeaderTitle.innerHTML = 'Connecting to server &amp; sending message…';
        feedbackBox.style.display = 'none';

        // 3. Send email via EmailJS
        emailjs.sendForm('default_service', 'template_ze2tohq', form)
          .then(() => {
            // Step 2 Completed
            step2.className = 'stepper-item completed';
            // Step 3 Active (Sent)
            step3.className = 'stepper-item active';
            stepperFill.style.width = '66.6%';
            stepperHeaderTitle.innerHTML = 'Message delivered successfully!';

            // Stagger transition to Step 4 (Auto-reply)
            setTimeout(() => {
              step3.className = 'stepper-item completed';
              step4.className = 'stepper-item active';
              stepperFill.style.width = '100%';
              stepperHeaderTitle.innerHTML = 'Generating auto-reply confirmation…';

              // Stagger final completion
              setTimeout(() => {
                step4.className = 'stepper-item completed';
                stepperHeaderTitle.innerHTML = 'All steps complete!';
                
                // Show feedback checkmark
                feedbackBox.style.display = 'flex';
                form.reset();
              }, 1000);

            }, 800);
          })
          .catch((err) => {
            console.error(err);
            // Restore form and show error message if API fails
            stepperContainer.classList.remove('visible');
            setTimeout(() => {
              stepperContainer.style.display = 'none';
              form.style.display = 'block';
              if (result) {
                result.style.display = 'block';
                result.className = 'error';
                result.textContent = 'Failed to send. Please try again or use contact details directly.';
              }
            }, 400);
          });
      });

      // Reset and send another message button handler
      if (btnSendAnother) {
        btnSendAnother.addEventListener('click', () => {
          stepperContainer.classList.remove('visible');
          setTimeout(() => {
            stepperContainer.style.display = 'none';
            form.style.display = 'block';
            if (result) {
              result.style.display = 'none';
              result.className = '';
              result.textContent = '';
            }
          }, 400);
        });
      }
    }

    // Certificates gallery with enhanced metadata schema (authorities, credential IDs, and brand accent colors)
    const certificates = [
      {
        title: 'Accenture Developer Experience',
        src: 'assets/images/accenture.png',
        authority: 'Accenture',
        credentialId: 'ACT-FOR-718',
        color: '#a12cba'
      },
      {
        title: 'AWS Solutions Architect Experience',
        src: 'assets/images/aws-forage.png',
        authority: 'AWS',
        credentialId: 'AWS-FOR-298',
        color: '#ff9900'
      },
      {
        title: 'AWS Cloud Technical Essentials',
        src: 'assets/images/coursera-aws.png',
        authority: 'AWS via Coursera',
        credentialId: 'AMZ-993-X42',
        color: '#2563eb'
      },
      {
        title: 'Scaler DSA Intermediate',
        src: 'assets/images/ScalerDSA-certificate.png',
        authority: 'Scaler Academy',
        credentialId: 'SCL-DSA-482',
        color: '#ea580c'
      },
      {
        title: 'AI for Everyone',
        src: 'assets/images/coursera1.png',
        authority: 'DeepLearning.AI',
        credentialId: 'AI-EVE-912',
        color: '#0284c7'
      },
      {
        title: 'Generative AI for Everyone',
        src: 'assets/images/coursera2.png',
        authority: 'DeepLearning.AI',
        credentialId: 'GEN-AI-824',
        color: '#0284c7'
      },
      {
        title: 'TCS Cybersecurity IAM',
        src: 'assets/images/tcs-cybersecurity-IAM.png',
        authority: 'TCS iON',
        credentialId: 'TCS-CYB-672',
        color: '#14b8a6'
      },
      {
        title: 'Tata Data Visualization & Analytics',
        src: 'assets/images/tata-forage.png',
        authority: 'Tata Group',
        credentialId: 'TAT-FOR-103',
        color: '#0ea5e9'
      },
      {
        title: 'The Complete MERN Full-Stack Developer',
        src: 'assets/images/udemy-MERN.png',
        authority: 'Udemy',
        credentialId: 'UDE-MER-581',
        color: '#a855f7'
      },
      {
        title: 'Introduction to DevOps',
        src: 'assets/images/DevOps.png',
        authority: 'IBM via Coursera',
        credentialId: 'DEV-OPS-330',
        color: '#3b82f6'
      }
    ];

    const mainview         = document.querySelector('.main-view img');
    const certificatesmall = document.querySelector('.certificates-small');

    if (certificatesmall && mainview) {
      // Landscape-friendly sizing variants for organic layout
      const sizeClasses = [
        'cert-size-normal', // index 0
        'cert-size-normal', // index 1
        'cert-size-wide',   // index 2
        'cert-size-normal', // index 3
        'cert-size-wide',   // index 4
        'cert-size-normal', // index 5
        'cert-size-normal', // index 6
        'cert-size-normal', // index 7
        'cert-size-wide',   // index 8
        'cert-size-normal'  // index 9
      ];

      // Clear static elements and dynamically build the simplified thumbnail grid (original + clones for infinite loop scrolling on mobile)
      certificatesmall.innerHTML = '';
      
      const createCardElement = (cert, idx, isCloned = false) => {
        const card = document.createElement('span');
        const sizeClass = sizeClasses[idx] || 'cert-size-normal';
        card.classList.add('certificate-card', sizeClass);
        if (isCloned) {
          card.classList.add('cloned');
        }
        card.setAttribute('data-index', idx);
        
        card.innerHTML = `
          <div class="cert-card-verified-badge" title="Verified Credential">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <img src="${cert.src}" alt="${cert.title}" loading="lazy" />
        `;

        card.addEventListener('click', () => {
          setMainCertificate(idx, card);

          // Simultaneously trigger full-screen lightbox zoom
          const zoomModal = document.querySelector('.certificate-zoom-modal');
          if (zoomModal) {
            const zoomImg = zoomModal.querySelector('img');
            if (zoomImg) {
              zoomImg.src = cert.src;
              zoomImg.alt = cert.title;
            }
            zoomModal.classList.add('active');
          }
        });
        return card;
      };

      // Append primary list
      certificates.forEach((cert, idx) => {
        certificatesmall.appendChild(createCardElement(cert, idx, false));
      });

      // Append cloned list for infinite marquee scrolling on mobile
      certificates.forEach((cert, idx) => {
        certificatesmall.appendChild(createCardElement(cert, idx, true));
      });

      const setActiveThumbnail = (card) => {
        certificatesmall.querySelectorAll('.certificate-card')
          .forEach(c => c.classList.remove('active-thumbnail'));
        card.classList.add('active-thumbnail');
        if (window.innerWidth > 992) {
          card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      };

      const setMainCertificate = (index, selectedCard) => {
        const cert = certificates[index];
        if (!cert) return;
        if (selectedCard) setActiveThumbnail(selectedCard);

        const imgEl = document.getElementById('main-cert-image');
        const badgeEl = document.getElementById('floating-badge');
        const badgeAuth = document.getElementById('badge-authority');
        const badgeId = document.getElementById('badge-id');

        if (!imgEl) return;

        const cleanup = () => {
          imgEl.removeEventListener('transitionend', cleanup);
          
          imgEl.src = cert.src;
          imgEl.alt = cert.title;
          
          if (badgeAuth) badgeAuth.textContent = `Verified by ${cert.authority}`;
          if (badgeId) badgeId.textContent = `ID: ${cert.credentialId}`;
          
          requestAnimationFrame(() => {
            imgEl.classList.remove('fade-out');
            imgEl.classList.add('fade-in');
            if (badgeEl) {
              badgeEl.classList.remove('fade-out');
              badgeEl.classList.add('fade-in');
            }
          });
          setTimeout(() => {
            imgEl.classList.remove('fade-in');
            if (badgeEl) badgeEl.classList.remove('fade-in');
          }, 300);
        };

        imgEl.classList.add('fade-out');
        if (badgeEl) badgeEl.classList.add('fade-out');
        
        let transitionFired = false;
        const onTransitionEnd = () => {
          if (transitionFired) return;
          transitionFired = true;
          cleanup();
        };

        imgEl.addEventListener('transitionend', onTransitionEnd, { once: true });
        setTimeout(onTransitionEnd, 250); // Fallback matching transition duration
      };

      // Set initial active card and fields on load
      const firstCard = certificatesmall.querySelector('.certificate-card:not(.cloned)');
      if (firstCard) {
        setActiveThumbnail(firstCard);
        
        const cert = certificates[0];
        const imgEl = document.getElementById('main-cert-image');
        const badgeAuth = document.getElementById('badge-authority');
        const badgeId = document.getElementById('badge-id');
        if (imgEl) {
          imgEl.src = cert.src;
          imgEl.alt = cert.title;
        }
        if (badgeAuth) badgeAuth.textContent = `Verified by ${cert.authority}`;
        if (badgeId) badgeId.textContent = `ID: ${cert.credentialId}`;
      }
    }

    // Certificate zoom modal
    let zoomModal = document.querySelector('.certificate-zoom-modal');
    if (!zoomModal) {
      zoomModal = document.createElement('div');
      zoomModal.className = 'certificate-zoom-modal';
      zoomModal.innerHTML = '<img src="" alt="Certificate zoom view">';
      document.body.appendChild(zoomModal);
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('.main-view img')) {
        zoomModal.querySelector('img').src = e.target.src;
        zoomModal.classList.add('active');
      } else if (zoomModal.classList.contains('active') && !e.target.closest('.certificate-card')) {
        zoomModal.classList.remove('active');
      }
    });

    // Conic-gradient skill progress rings
    const progressBars = document.querySelectorAll('.progress');
    if (progressBars.length > 0) {
      const skillObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const progress = entry.target;
            if (progress.classList.contains('animated')) return;
            progress.classList.add('animated');

            const targetValue  = parseInt(progress.getAttribute('data-value'), 10) || 0;
            const numberText   = progress.querySelector('h3');
            const duration     = 1500;
            const intervalTime = 20;
            const steps        = duration / intervalTime;
            const increment    = targetValue / steps;
            let current        = 0;

            const interval = setInterval(() => {
              current += increment;
              if (current >= targetValue) {
                current = targetValue;
                clearInterval(interval);
              }

              progress.style.background = `conic-gradient(var(--clr) ${current * 3.6}deg, #2a2a2a 0deg)`;
              if (numberText) numberText.innerHTML = `${Math.round(current)}<span>%</span>`;
            }, intervalTime);

            skillObserver.unobserve(progress);
          });
        },
        { threshold: 0.2 }
      );

      progressBars.forEach(bar => skillObserver.observe(bar));
    }

    // Dynamic Projects rendering with filters, search, randomized grid spans, and pagination
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      const projects = [
        {
          id: 'aichat',
          title: 'NuraChat',
          desc: 'Production-grade real-time communication platform that solves the conflict between user privacy and modern collaboration features..',
          image: 'assets/images/aichat_preview.png',
          tags: [ 'MERN','HuggingFace', 'WebSockets', 'LiveKit',"Cloudinary","Nodemailer"],
          categories: ['MERN', 'AI / ML'],
          github: 'https://github.com/manish-panwarr',
          live: 'https://nura-chat-three.vercel.app',
          metrics: [
            { class: 'success', icon: 'fa-language', text: 'Real-time Translation' },
            { class: 'info', icon: 'fa-bolt', text: 'WebSockets' }
          ],
          status: 'completed'
        },
        {
          id: 'taskmanager',
          title: 'Task-Manager',
          desc: 'Production-grade collaboration platform built to support modern team workflows through task management, role-based access control, team messaging, analytics dashboards, and automated notifications.',
          image: 'assets/images/taskmanager_preview.png',
          tags: ['React', 'MongoDB', 'Express'],
          categories: ['MERN'],
          github: 'https://github.com/manish-panwarr',
          live: 'https://task-forge-three-chi.vercel.app/login',
          metrics: [
            { class: 'info', icon: 'fa-circle-check', text: '99.9% Task Sync' }
          ],
          status: 'completed'
        },
        {
          id: 'phishing',
          title: 'Phishing Detection',
          desc: 'Browser extension using heuristic scoring algorithms to identify and block malicious websites in real-time.',
          image: 'assets/images/phishing_preview.png',
          tags: ['JS', 'HTML', 'Security'],
          categories: ['Security'],
          github: 'https://github.com/manish-panwarr/phising-site-detection-browser-extension',
          live: 'https://github.com/manish-panwarr/phising-site-detection-browser-extension',
          metrics: [
            { class: 'warning', icon: 'fa-shield-halved', text: '98% Accuracy' }
          ],
          status: 'completed'
        },
        {
          id: 'rentease',
          title: 'RentEase',
          desc: 'Verified rooms, direct landlord communications, dynamic search indexes, and online booking workflows.',
          image: 'assets/images/rentease_preview.png',
          tags: ['MERN', 'Redux'],
          categories: ['MERN'],
          github: 'https://github.com/manish-panwarr',
          live: 'https://github.com/manish-panwarr',
          metrics: [
            { class: 'success', icon: 'fa-house', text: 'Zero Hassle Rentals' }
          ],
          status: 'under-development'
        },
        {
          id: 'movierec',
          title: 'Movie Recommender',
          desc: 'Designed to suggest movies based on content-based vector comparison, user preferences, and history.',
          image: 'assets/images/movierec_preview.png',
          tags: ['Python', 'ML'],
          categories: ['AI / ML'],
          github: 'https://github.com/manish-panwarr',
          live: 'https://github.com/manish-panwarr',
          metrics: [
            { class: 'purple', icon: 'fa-circle-nodes', text: 'Cosine Similarity' }
          ],
          status: 'under-development'
        },
        {
          id: 'lms',
          title: 'Learning Management System (LMS)',
          desc: 'Streamlines educational course workflows, progress checklists, role authorization, and grades tracking.',
          image: 'assets/images/lms_preview.png',
          tags: ['MERN', 'Redux', 'Role Based'],
          categories: ['MERN'],
          github: 'https://github.com/manish-panwarr',
          live: 'https://github.com/manish-panwarr',
          metrics: [
            { class: 'success', icon: 'fa-user-shield', text: 'Role-Based Control' }
          ],
          status: 'under-development'
        }
      ];

      const itemsPerPage = 4;
      let currentPage = 1;
      let activeFilter = 'All';
      let searchQuery = '';

      // Initialize elements
      const searchInput = document.getElementById('project-search-input');
      const searchClearBtn = document.getElementById('project-search-clear-btn');
      const filterTabsContainer = document.getElementById('project-filter-tabs');

      // Create Pagination Elements
      const paginationContainer = document.createElement('div');
      paginationContainer.className = 'projects-pagination animate-on-scroll';
      paginationContainer.innerHTML = `
        <button class="pag-btn pag-prev" id="project-prev-btn" aria-label="Previous Page"><i class="fa-solid fa-chevron-left"></i></button>
        <div class="pag-numbers" id="project-page-numbers"></div>
        <button class="pag-btn pag-next" id="project-next-btn" aria-label="Next Page"><i class="fa-solid fa-chevron-right"></i></button>
      `;
      projectsGrid.after(paginationContainer);

      const prevBtn = paginationContainer.querySelector('#project-prev-btn');
      const nextBtn = paginationContainer.querySelector('#project-next-btn');
      const pageNumbersContainer = paginationContainer.querySelector('#project-page-numbers');

      if (typeof scrollObserver !== 'undefined') {
        scrollObserver.observe(paginationContainer);
      } else {
        paginationContainer.classList.add('visible');
      }

      function generateRandomSpans(count) {
        const spans = [];
        let i = 0;
        while (i < count) {
          if (count - i >= 2) {
            const rand = Math.random();
            if (rand < 0.33) {
              spans.push(7, 5);
            } else if (rand < 0.66) {
              spans.push(5, 7);
            } else {
              spans.push(6, 6);
            }
            i += 2;
          } else {
            spans.push(12);
            i += 1;
          }
        }
        return spans;
      }

      function filterAndRender() {
        // Filter projects
        const filtered = projects.filter(proj => {
          const matchesCategory = activeFilter === 'All' || proj.categories.includes(activeFilter);
          const searchLower = searchQuery.toLowerCase();
          const matchesSearch = !searchQuery || 
            proj.title.toLowerCase().includes(searchLower) || 
            proj.desc.toLowerCase().includes(searchLower) || 
            proj.tags.some(tag => tag.toLowerCase().includes(searchLower));
          return matchesCategory && matchesSearch;
        });

        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

        // Clear grid
        projectsGrid.innerHTML = '';

        if (pageItems.length === 0) {
          projectsGrid.innerHTML = `
            <div class="no-projects-found">
              <i class="fa-regular fa-folder-open"></i>
              <h3>No projects found</h3>
              <p>Try refining your search term or selecting another filter category.</p>
            </div>
          `;
          paginationContainer.style.display = 'none';
          return;
        }

        paginationContainer.style.display = 'flex';

        // Generate spans and render
        const spans = generateRandomSpans(pageItems.length);
        pageItems.forEach((proj, idx) => {
          const span = spans[idx];
          const card = document.createElement('div');
          card.className = `bento-card col-${span} fade-in-card`;
          
          let metricsHtml = proj.metrics.map(m => `
            <span class="metric-pill ${m.class}"><i class="fa-solid ${m.icon}"></i> ${m.text}</span>
          `).join('');

          let tagsHtml = proj.tags.map(t => `
            <span class="bento-pill ${t.toLowerCase().replace(/[\s/.]/g, '')}">${t}</span>
          `).join('');

          let actionsHtml = '';
          if (proj.status === 'under-development') {
            actionsHtml = `
              <span class="bento-action-btn live-btn disabled" title="Under Development"><i class="fa-solid fa-hourglass-half"></i> Coming Soon</span>
              <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="bento-action-btn github-btn" title="GitHub Repository"><i class="fa-brands fa-github"></i> GitHub</a>
            `;
          } else {
            actionsHtml = `
              <a href="${proj.live}" target="_blank" rel="noopener noreferrer" class="bento-action-btn live-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
              <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="bento-action-btn github-btn" title="GitHub Repository"><i class="fa-brands fa-github"></i> GitHub</a>
            `;
          }

          card.innerHTML = `
            <div class="bento-visual-wrapper">
              <img src="${proj.image}" alt="${proj.title}" loading="lazy" />
              <div class="floating-metric-badge">
                ${metricsHtml}
              </div>
              ${proj.status === 'under-development' ? `
                <div class="under-dev-overlay">
                  <span class="under-dev-badge"><i class="fa-solid fa-screwdriver-wrench"></i> Under Dev</span>
                </div>
              ` : ''}
            </div>
            <div class="bento-content">
              <div class="bento-header-row">
                <h3 class="bento-title">${proj.title}</h3>
                <div class="bento-pills">
                  ${tagsHtml}
                </div>
              </div>
              <p class="bento-desc">${proj.desc}</p>
              <div class="bento-actions">
                ${actionsHtml}
              </div>
            </div>
          `;
          projectsGrid.appendChild(card);
        });

        // Update Pagination controls
        pageNumbersContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
          const pageNumBtn = document.createElement('button');
          pageNumBtn.className = `pag-num ${i === currentPage ? 'active' : ''}`;
          pageNumBtn.textContent = i;
          pageNumBtn.addEventListener('click', () => {
            if (i !== currentPage) {
              currentPage = i;
              filterAndRender();
              scrollToProjects();
            }
          });
          pageNumbersContainer.appendChild(pageNumBtn);
        }

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
      }

      function scrollToProjects() {
        const yOffset = -80; // height of sticky header
        const element = document.getElementById('projects');
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }

      // Pagination Click Listeners
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          filterAndRender();
          scrollToProjects();
        }
      });

      nextBtn.addEventListener('click', () => {
        const filteredCount = projects.filter(proj => {
          const matchesCategory = activeFilter === 'All' || proj.categories.includes(activeFilter);
          const searchLower = searchQuery.toLowerCase();
          return matchesCategory && (!searchQuery || proj.title.toLowerCase().includes(searchLower) || proj.desc.toLowerCase().includes(searchLower) || proj.tags.some(tag => tag.toLowerCase().includes(searchLower)));
        }).length;
        const totalPages = Math.ceil(filteredCount / itemsPerPage) || 1;
        if (currentPage < totalPages) {
          currentPage++;
          filterAndRender();
          scrollToProjects();
        }
      });

      // Filter Tabs Listeners
      if (filterTabsContainer) {
        filterTabsContainer.querySelectorAll('.filter-tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            filterTabsContainer.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            currentPage = 1;
            filterAndRender();
          });
        });
      }

      // Search Listeners
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          if (searchQuery) {
            searchClearBtn.style.display = 'block';
          } else {
            searchClearBtn.style.display = 'none';
          }
          currentPage = 1;
          filterAndRender();
        });
      }

      if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchQuery = '';
          searchClearBtn.style.display = 'none';
          currentPage = 1;
          filterAndRender();
        });
      }

      // Initial Render
      filterAndRender();
    }

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
