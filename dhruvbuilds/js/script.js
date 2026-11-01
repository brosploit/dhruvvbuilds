/**
 * DhruvBuilds - 3D Portfolio Master Controller
 * Engineered for high-impact visual performance, interactivity & InfinityFree static deployment
 */

// Global User Configuration
window.USER_CONFIG = {
  name: "Dhruv",
  brand: "DhruvBuilds",
  title: "Creative Technologist & 3D Web Architect",
  email: "dhruvbuilds@gmail.com",
  github: "https://github.com/dhruvbuilds",
  linkedin: "https://linkedin.com/in/dhruvbuilds",
  instagram: "https://instagram.com/dhruvbuilds",
  youtube: "https://youtube.com/@dhruvbuilds",
  resumePath: "./assets/Dhruv_Resume.pdf"
};

// ==========================================
// 1. Futuristic Web Audio Synthesizer (SFX)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('sound_enabled') === 'true';
    this.initAudio();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio API not supported in this browser.');
    }
  }

  ensureContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('sound_enabled', this.enabled);
    if (this.enabled) {
      this.ensureContext();
      this.playBeep(880, 0.08, 'sine');
      showToast('🔊 Cyber Audio FX Enabled', 'success');
    } else {
      showToast('🔇 Audio FX Muted', 'info');
    }
    return this.enabled;
  }

  playHover() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playWarp() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      }, idx * 60);
    });
  }

  playBeep(freq, dur, type = 'sine') {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }
}

window.soundFX = new SoundFX();

// ==========================================
// 2. Global Toast Notification Helper
// ==========================================
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('visible'), 10);
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
window.showToast = showToast;

// ==========================================
// 3. Main DOM Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Hero Scene
  if (typeof window.initHero3D === 'function') {
    window.hero3D = window.initHero3D('webgl-canvas-container');
  }

  // Navbar Scroll Behavior
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 250)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.includes(current) && current !== '') {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-links');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      window.soundFX.playClick();
    });

    document.querySelectorAll('.nav-link, .btn-resume-nav').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3D Geometry Mode Switchers (in Hero)
  const modeButtons = document.querySelectorAll('.mode-btn');
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');
      if (window.hero3D) {
        window.hero3D.switchMode(mode);
      }
      window.soundFX.playWarp();
    });
  });

  // 3D Wireframe Toggle
  const wireBtn = document.getElementById('toggle-wireframe');
  if (wireBtn) {
    wireBtn.addEventListener('click', () => {
      if (window.hero3D) {
        const isWire = window.hero3D.toggleWireframe();
        wireBtn.classList.toggle('active', isWire);
        showToast(isWire ? '🔷 Wireframe Hologram Active' : '✨ Solid Shaded Hologram Active');
        window.soundFX.playClick();
      }
    });
  }

  // 3D Card Tilt Physics (CSS 3D Perspective)
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      const glare = card.querySelector('.glare-effect');
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(0, 242, 254, 0.22), transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      const glare = card.querySelector('.glare-effect');
      if (glare) glare.style.background = 'transparent';
    });

    card.addEventListener('mouseenter', () => {
      window.soundFX.playHover();
    });
  });

  // Sound FX Toggle Buttons
  const soundToggles = document.querySelectorAll('.sound-toggle');
  soundToggles.forEach(toggle => {
    toggle.classList.toggle('active', window.soundFX.enabled);
    toggle.addEventListener('click', () => {
      const isEnabled = window.soundFX.toggle();
      soundToggles.forEach(t => t.classList.toggle('active', isEnabled));
    });
  });

  // Sound on interactive buttons
  document.querySelectorAll('.btn, .social-icon-btn, .filter-btn, .logo').forEach(el => {
    el.addEventListener('mouseenter', () => window.soundFX.playHover());
    el.addEventListener('click', () => window.soundFX.playClick());
  });

  // Copy Email to Clipboard
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(window.USER_CONFIG.email).then(() => {
        showToast(`📋 Copied "${window.USER_CONFIG.email}" to clipboard!`, 'success');
        window.soundFX.playSuccess();
      }).catch(() => {
        showToast(`Direct Email: ${window.USER_CONFIG.email}`, 'info');
      });
    });
  });

  // Interactive Theme Palette Switcher
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('portfolio_theme') || 'cyber-neon';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeBtns.forEach(btn => {
    if (btn.getAttribute('data-theme') === savedTheme) btn.classList.add('active');
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio_theme', theme);
      showToast(`🎨 Theme set to ${btn.title || theme}`);
      window.soundFX.playClick();
    });
  });

  // Stats Number Counter (Scroll Triggered)
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;
  const countStats = () => {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const decimals = parseInt(stat.getAttribute('data-decimals') || '0', 10);
      let start = 0;
      const duration = 1800;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = start + (target - start) * easeOut;

        stat.textContent = currentVal.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target.toFixed(decimals) + suffix;
        }
      };
      requestAnimationFrame(updateCount);
    });
  };

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          countStats();
        }
      });
    }, { threshold: 0.3 });
    const statsSection = document.querySelector('.stats-strip');
    if (statsSection) statsObserver.observe(statsSection);
  }

  // Portfolio Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-category') || '';
        if (filterValue === 'all' || cat.includes(filterValue)) {
          item.classList.remove('hidden');
          setTimeout(() => item.classList.add('fade-in'), 10);
        } else {
          item.classList.add('hidden');
          item.classList.remove('fade-in');
        }
      });
      window.soundFX.playClick();
    });
  });

  // Project Modal Logic
  const modal = document.getElementById('project-modal');
  const openModalBtns = document.querySelectorAll('.open-modal');
  const closeModalBtns = document.querySelectorAll('.modal-close, .modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech-list');
  const modalType = document.getElementById('modal-type');
  const modalDemoBtn = document.getElementById('modal-demo-btn');
  const modalGithubBtn = document.getElementById('modal-github-btn');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalTitle.textContent = btn.getAttribute('data-title');
      modalDesc.textContent = btn.getAttribute('data-desc');
      modalTech.textContent = btn.getAttribute('data-tech');
      modalType.textContent = btn.getAttribute('data-type');
      modalDemoBtn.href = btn.getAttribute('data-demo') || '#';
      modalGithubBtn.href = btn.getAttribute('data-github') || '#';

      modalDemoBtn.style.display = btn.getAttribute('data-demo') === '#' ? 'none' : 'inline-flex';
      modalGithubBtn.style.display = btn.getAttribute('data-github') === '#' ? 'none' : 'inline-flex';

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      window.soundFX.playWarp();
    });
  });

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
    const resumeModal = document.getElementById('resume-modal');
    if (resumeModal) resumeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Resume Modal Triggers
  const openResumeBtns = document.querySelectorAll('.open-resume-modal');
  const resumeModal = document.getElementById('resume-modal');
  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        window.soundFX.playSuccess();
      }
    });
  });

  // Download Resume Click Notification
  const downloadResumeBtns = document.querySelectorAll('.download-resume-btn');
  downloadResumeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('📥 Downloading Dhruv\'s Resume (PDF)...', 'success');
      window.soundFX.playSuccess();
    });
  });

  // Print Resume Button
  const printResumeBtn = document.getElementById('print-resume-btn');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.soundFX.playWarp();
    });
  }

  // Initialize Cyber Terminal
  initCyberTerminal();

  // Initialize Custom 3D Cursor (Desktop only)
  initCustomCursor();
});

// ==========================================
// 4. Interactive Cyber Terminal (CLI Engine)
// ==========================================
function initCyberTerminal() {
  const terminalBody = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-cli-input');
  const terminalQuickChips = document.querySelectorAll('.cli-chip');

  if (!terminalBody || !terminalInput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
<div class="cli-res">
  <span class="cli-highlight">AVAILABLE COMMANDS:</span>
  <div class="cli-grid">
    <div><span class="cli-cmd">about</span> - Summary of background & philosophy</div>
    <div><span class="cli-cmd">skills</span> - Inspect full technical arsenal</div>
    <div><span class="cli-cmd">projects</span> - View featured 3D & software builds</div>
    <div><span class="cli-cmd">resume</span> - Download & preview official resume</div>
    <div><span class="cli-cmd">readme</span> - Interactive system docs & architecture</div>
    <div><span class="cli-cmd">socials</span> - List GitHub, LinkedIn, YouTube, Instagram</div>
    <div><span class="cli-cmd">matrix</span> - Run cyber code rain stream</div>
    <div><span class="cli-cmd">theme</span> - Cycle futuristic color schemes</div>
    <div><span class="cli-cmd">clear</span> - Clear terminal screen buffer</div>
  </div>
</div>`,

    about: () => `
<div class="cli-res">
  <span class="cli-highlight">DHRUV // CREATIVE TECHNOLOGIST & 3D ENGINEER</span>
  <p>Exploring the intersection of WebGL 3D graphics, generative intelligence, and high-scale software engineering.</p>
  <p>I architect intuitive, mathematically grounded, and immersive digital platforms that bridge aesthetic beauty with performant code.</p>
  <span class="cli-tag">STATUS: Available for impactful roles & collaborations</span>
</div>`,

    skills: () => `
<div class="cli-res">
  <span class="cli-highlight">TECHNICAL ARSENAL:</span>
  <div>[3D & Graphics]  Three.js, WebGL, GLSL Shaders, HTML5 Canvas, GSAP, 3D Physics</div>
  <div>[Frontend]      JavaScript (ES6+), TypeScript, React, HTML5/CSS3, Tailwind</div>
  <div>[Backend]       Node.js, Python, Express, RESTful APIs, Linux/Bash, Serverless</div>
  <div>[AI & Tools]    Generative AI APIs, Git/GitHub, Docker, Postman, Vite, Apache/InfinityFree</div>
</div>`,

    projects: () => `
<div class="cli-res">
  <span class="cli-highlight">FEATURED ENGINEERING PROJECTS:</span>
  <div>1. <span class="cli-cyan">3D WebGL Portfolio</span> - Interactive Three.js spatial dimension</div>
  <div>2. <span class="cli-cyan">Polaris AI Assistant</span> - Autonomous multimodal intelligence agent</div>
  <div>3. <span class="cli-cyan">DegreePilot Portal</span> - Student roadmap & curriculum intelligence</div>
  <div>4. <span class="cli-cyan">CyberGuard Suite</span> - Network telemetry analyzer & security automation</div>
  <p>Type <span class="cli-cmd">about</span> or click "Projects" in the navigation bar for detailed deep dives.</p>
</div>`,

    resume: () => {
      setTimeout(() => {
        const resumeModal = document.getElementById('resume-modal');
        if (resumeModal) resumeModal.classList.add('active');
        window.soundFX.playSuccess();
      }, 300);
      return `<div class="cli-res"><span class="cli-success">Opening resume modal and preparing PDF download...</span></div>`;
    },

    readme: () => `
<div class="cli-res">
  <span class="cli-highlight">⚡ DHRUVBUILDS // INTERACTIVE ARCHITECTURE & README</span>
  <div>• <strong>3D Engine:</strong> Three.js r128 + WebGL 2.0 (Quantum Core, Torus Portal, Hypercube, Neural Stars)</div>
  <div>• <strong>Audio Synthesizer:</strong> Native Web Audio API procedural sound generation (zero external mp3s)</div>
  <div>• <strong>Host Deployment:</strong> 100% static client-side, zero Node server needed, pre-configured for InfinityFree</div>
  <div>• <strong>Resume:</strong> Instant download (Dhruv_Resume.pdf) + in-browser printable CV modal</div>
  <div>• <strong>Interactive Terminal:</strong> Try typing <span class="cli-cmd">matrix</span>, <span class="cli-cmd">skills</span>, <span class="cli-cmd">theme</span>, or <span class="cli-cmd">resume</span></div>
  <div>• <strong>Full Docs:</strong> Read the comprehensive interactive guide in <span class="cli-cyan">README.md</span></div>
</div>`,

    socials: () => `
<div class="cli-res">
  <span class="cli-highlight">CONNECT DIRECTLY:</span>
  <div>• GitHub:    <a href="${window.USER_CONFIG.github}" target="_blank" class="cli-link">${window.USER_CONFIG.github}</a></div>
  <div>• LinkedIn:  <a href="${window.USER_CONFIG.linkedin}" target="_blank" class="cli-link">${window.USER_CONFIG.linkedin}</a></div>
  <div>• YouTube:   <a href="${window.USER_CONFIG.youtube}" target="_blank" class="cli-link">${window.USER_CONFIG.youtube}</a></div>
  <div>• Instagram: <a href="${window.USER_CONFIG.instagram}" target="_blank" class="cli-link">${window.USER_CONFIG.instagram}</a></div>
  <div>• Email:     <a href="mailto:${window.USER_CONFIG.email}" class="cli-link">${window.USER_CONFIG.email}</a></div>
</div>`,

    matrix: () => {
      runMatrixRain();
      return `<div class="cli-res"><span class="cli-success">⚡ Entering the Matrix... Initializing neural stream...</span></div>`;
    },

    theme: () => {
      const themes = ['cyber-neon', 'matrix', 'solar', 'deep-cosmos'];
      const current = document.documentElement.getAttribute('data-theme') || 'cyber-neon';
      const next = themes[(themes.indexOf(current) + 1) % themes.length];
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio_theme', next);
      return `<div class="cli-res"><span class="cli-success">Color theme switched to: <strong>${next}</strong></span></div>`;
    },

    sudo: () => `<div class="cli-res"><span class="cli-highlight">Access Granted! User Dhruv authenticated as Root Administrator. Welcome to the core.</span></div>`,

    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    const cmdLine = document.createElement('div');
    cmdLine.className = 'cli-line user-echo';
    cmdLine.innerHTML = `<span class="cli-prompt">dhruv@quantum:~$</span> <span class="cli-input-echo">${escapeHtml(cmd)}</span>`;
    terminalBody.appendChild(cmdLine);

    if (commands[cmd]) {
      const result = commands[cmd]();
      if (result) {
        const resLine = document.createElement('div');
        resLine.className = 'cli-line response';
        resLine.innerHTML = result;
        terminalBody.appendChild(resLine);
      }
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'cli-line error';
      errLine.innerHTML = `<span class="cli-err">Command not recognized: "${escapeHtml(cmd)}". Type <strong class="cli-cmd">help</strong> for a list of valid commands.</span>`;
      terminalBody.appendChild(errLine);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
    window.soundFX.playBeep(700, 0.05, 'triangle');
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  terminalQuickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function runMatrixRain() {
    let matrixContainer = document.getElementById('matrix-rain-overlay');
    if (!matrixContainer) {
      matrixContainer = document.createElement('canvas');
      matrixContainer.id = 'matrix-rain-overlay';
      document.body.appendChild(matrixContainer);
    }

    matrixContainer.style.display = 'block';
    const ctx = matrixContainer.getContext('2d');
    matrixContainer.width = window.innerWidth;
    matrixContainer.height = window.innerHeight;

    const characters = '0123456789ABCDEFΞΨΩ⚡DHRUVBUILDS3D';
    const fontSize = 16;
    const columns = Math.floor(matrixContainer.width / fontSize);
    const drops = Array(columns).fill(1);

    let frames = 0;
    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(8, 9, 15, 0.08)';
      ctx.fillRect(0, 0, matrixContainer.width, matrixContainer.height);

      ctx.fillStyle = '#00f2fe';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixContainer.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frames++;
      if (frames > 220) {
        clearInterval(interval);
        matrixContainer.style.display = 'none';
      }
    }, 33);
  }
}

// ==========================================
// 5. Custom 3D Glowing Cursor (Desktop)
// ==========================================
function initCustomCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorOutline = document.createElement('div');
  cursorOutline.className = 'cursor-outline';

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);

  let mouseX = -100, mouseY = -100;
  let outlineX = -100, outlineY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  const animateCursor = () => {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  document.querySelectorAll('a, button, .tilt-card, .cli-chip, input').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-hover');
    });
  });
}
