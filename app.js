/**
 * Winterfell Vega x Surreal - Ultra-Fast 60 FPS Engine
 * Zero Stutter • Zero Canvas Overhead • Instant DOM Rendering
 */

document.addEventListener('DOMContentLoaded', async () => {
  await syncDataFromServer();
  initI18n();
  initTypewriter();
  initAudioPlayer();
  initRouter();
  initModals();
  initToast();
});

async function syncDataFromServer() {
  try {
    const res = await fetch('/api/data?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      window.GANGS_DATA = await res.json();
    }
  } catch (e) {
    // Keep window.GANGS_DATA from data.js
  }
}

/* ==========================================================================
   1. i18n MULTI-LANGUAGE SYSTEM (TH / EN)
   ========================================================================== */
let currentLang = localStorage.getItem('site_lang') || 'TH';

const I18N = {
  TH: {
    systemOnline: 'ระบบออนไลน์ 24/7',
    joinSyndicate: 'สมัครเข้าแก๊ง',
    viewRoster: 'ดูทำเนียบสมาชิก',
    heroTagline: 'BORN OF BERYL • BERYL SYNDICATE',
    motto: 'BERYL NEVER LOSE • ยืนหยัดในเหมันต์นิรันดร์',
    selectAffiliate: 'เลือกดูทำเนียบสมาชิกแก๊งพันธมิตร',
    backHome: 'กลับหน้าแรก',
    bulletinTitle: 'ประกาศสำคัญจากหัวหน้าแก๊ง (OFFICIAL BULLETIN)',
    bulletinSnippet: 'ระเบียบการรวมแก๊งซีซั่นใหม่: ให้สมาชิกทุกคนประจำการใน Discord และเตรียมพร้อมสำหรับไฟต์ใหญ่...',
    bulletinBtn: 'อ่านประกาศฉบับเต็ม',
    statsOps: 'สมาชิกทั้งหมด',
    statsReadiness: 'สถานะพร้อมลุย 24/7',
    statsTier: 'TIER S เกียรติยศ',
    statsAlliances: 'พันธมิตร 5 แก๊ง',
    searchPlaceholder: 'ค้นหาชื่อสมาชิก หรือ Roblox...',
    allRanks: 'ทั้งหมด',
    founders: 'ผู้ก่อตั้ง',
    leaders: 'แกนนำ',
    members: 'สมาชิก',
    sortRank: 'เรียงตามยศ',
    sortAlpha: 'เรียงชื่อ (A-Z)',
    sortPopular: 'ยอดเข้าชมสูงสุด 🔥',
    viewGrid: 'การ์ด',
    viewBento: 'เบนโตะ',
    viewCompact: 'ตาราง',
    showingMembers: 'กำลังแสดง {shown} จากทั้งหมด {total} สมาชิก',
    loadMore: 'โหลดรายชื่อเพิ่มเติม (+48)',
    noMembers: 'ไม่พบสมาชิกที่ตรงกับการค้นหา',
    noMembersDesc: 'ไม่พบรายชื่อที่ตรงกับ "{q}" กรุณาลองค้นหาด้วยคำอื่น',
    viewsCount: 'เข้าชม',
    dossierTitle: 'แฟ้มประวัติสมาชิก (OPERATOR DOSSIER)',
    statusActive: 'พร้อมรบ (ACTIVE DUTY)',
    statusClearance: 'ระดับสิทธิ์ FIVEM / ROBLOX',
    copyName: 'คัดลอกชื่อ',
    copiedToast: 'คัดลอกลงคลิปบอร์ดแล้ว!',
    shareProfile: 'แชร์โปรไฟล์',
    applyTitle: 'ใบสมัครเข้าร่วมแก๊ง (JOIN SYNDICATE)',
    applyDesc: 'ยินดีต้อนรับสู่เครือข่าย Beryl กรุณาอ่านระเบียบและกรอกข้อมูล',
    rule1: '1. เคารพหัวหน้าแก๊งและพี่น้องในครอบครัว',
    rule2: '2. มีไมค์สื่อสารชัดเจน และพร้อมประจำการใน Discord',
    rule3: '3. ไม่สร้างปัญหาหรือทะเลาะวิวาทกับพันธมิตร',
    submitApp: 'ส่งใบสมัครเข้าแก๊ง',
    footerText: '© 2026 BERYL. สงวนลิขสิทธิ์ทั้งหมด.'
  },
  EN: {
    systemOnline: 'SYSTEM ONLINE 24/7',
    joinSyndicate: 'JOIN SYNDICATE',
    viewRoster: 'VIEW ROSTER',
    heroTagline: 'BORN OF BERYL • BERYL SYNDICATE',
    motto: 'BERYL NEVER LOSE • STANDING STRONG',
    selectAffiliate: 'SELECT AFFILIATE SYNDICATE ROSTER',
    backHome: 'HOME',
    bulletinTitle: 'OFFICIAL SYNDICATE BULLETIN',
    bulletinSnippet: 'New Season Directives: All operatives must remain on standby in Discord for the upcoming battle...',
    bulletinBtn: 'READ FULL BRIEFING',
    statsOps: 'TOTAL OPERATIVES',
    statsReadiness: '24/7 COMBAT READY',
    statsTier: 'TIER S SYNDICATE',
    statsAlliances: '5 ALLIED GUILDS',
    searchPlaceholder: 'Filter by operator or Roblox handle...',
    allRanks: 'ALL RANKS',
    founders: 'FOUNDERS',
    leaders: 'LEADERS',
    members: 'MEMBERS',
    sortRank: 'Sort by Rank',
    sortAlpha: 'Name (A-Z)',
    sortPopular: 'Most Popular 🔥',
    viewGrid: 'GRID',
    viewBento: 'BENTO',
    viewCompact: 'LIST',
    showingMembers: 'Showing {shown} of {total} roster operatives',
    loadMore: 'LOAD MORE (+48)',
    noMembers: 'No Operatives Found',
    noMembersDesc: 'No member records match "{q}". Try a different keyword.',
    viewsCount: 'views',
    dossierTitle: 'OPERATOR DOSSIER',
    statusActive: 'ACTIVE DUTY',
    statusClearance: 'CLEARANCE: FIVEM / ROBLOX',
    copyName: 'COPY NAME',
    copiedToast: 'Copied to clipboard!',
    shareProfile: 'SHARE PROFILE',
    applyTitle: 'JOIN SYNDICATE APPLICATION',
    applyDesc: 'Welcome to Beryl Syndicate. Review protocols and apply below.',
    rule1: '1. Absolute loyalty to clan leaders and brothers.',
    rule2: '2. Working microphone and active Discord presence required.',
    rule3: '3. Zero toxicity towards allied syndicate partners.',
    submitApp: 'SUBMIT APPLICATION',
    appSuccess: 'Application submitted! An officer will reach out on Discord.',
    allianceTitle: 'SYNDICATE ALLIANCE NETWORK',
    joinDiscord: 'JOIN DISCORD SERVER',
    nowPlaying: 'NOW PLAYING',
    footerText: 'Â© 2026 BERYL. ALL RIGHTS RESERVED.'
  }
};

function t(key, vars = {}) {
  const dict = I18N[currentLang] || I18N.TH;
  let text = dict[key] || key;
  for (const k in vars) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
  }
  return text;
}

function initI18n() {
  const toggleBtn = document.getElementById('lang-toggle-btn');
  if (toggleBtn) {
    toggleBtn.textContent = currentLang === 'TH' ? 'EN' : 'TH';
    toggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'TH' ? 'EN' : 'TH';
      localStorage.setItem('site_lang', currentLang);
      toggleBtn.textContent = currentLang === 'TH' ? 'EN' : 'TH';
      updateI18nDom();
      if (currentGangId) applyFilterAndRender();
    });
  }
  updateI18nDom();
}

function updateI18nDom() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
}

/* ==========================================================================
   2. LIGHTWEIGHT TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const words = [
    'WELCOME BERYL',
    'BERYL',
    'BERYL SYNDICATE',
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 120;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 60;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 130;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 350;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   3. PERSISTENT AUDIO PLAYER CONTROLLER
   ========================================================================== */
let audioInstance = null;
let isAudioPlaying = false;
let isAudioExpanded = false;
let isMuted = false;

function initAudioPlayer() {
  const audio = document.getElementById('main-audio');
  const playBtnMin = document.getElementById('play-btn-min');
  const playBtnModal = document.getElementById('play-btn-modal');
  const playIconModal = document.getElementById('play-icon-modal');
  const playIconMin = document.getElementById('play-icon-min');
  const progressBar = document.getElementById('audio-progress');
  const progressFill = document.getElementById('audio-progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const totalDurationEl = document.getElementById('total-duration');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');
  const minimizeBtn = document.getElementById('minimize-player-btn');
  const playerModal = document.getElementById('audio-modal');
  const playerPill = document.getElementById('audio-pill');
  const eqVisualizer = document.getElementById('eq-visualizer');

  if (!audio) return;
  audioInstance = audio;

  function updatePlayState(playing) {
    isAudioPlaying = playing;
    const pauseSvg = `<svg class="w-4 h-4 fill-black" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    const playSvg = `<svg class="w-4 h-4 fill-black translate-x-0.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;

    if (playIconModal) playIconModal.innerHTML = playing ? pauseSvg : playSvg;
    if (playIconMin) playIconMin.innerHTML = playing ? pauseSvg : playSvg;
    if (eqVisualizer) {
      if (playing) eqVisualizer.classList.remove('eq-paused');
      else eqVisualizer.classList.add('eq-paused');
    }
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play().then(() => updatePlayState(true)).catch(() => {});
    } else {
      audio.pause();
      updatePlayState(false);
    }
  }

  if (playBtnMin) playBtnMin.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });
  if (playBtnModal) playBtnModal.addEventListener('click', togglePlay);

  audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (progressBar) progressBar.value = audio.currentTime;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (totalDurationEl) totalDurationEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (progressBar) {
      progressBar.max = audio.duration;
      progressBar.value = 0;
    }
    if (totalDurationEl) totalDurationEl.textContent = formatTime(audio.duration);
  });

  if (progressBar) {
    progressBar.addEventListener('input', (e) => {
      audio.currentTime = parseFloat(e.target.value);
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = parseFloat(e.target.value);
      audio.muted = audio.volume === 0;
      const vFill = document.getElementById('volume-fill');
      if (vFill) vFill.style.width = (audio.volume * 100) + '%';
      updateMuteIcon(audio.muted);
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      audio.muted = isMuted;
      updateMuteIcon(isMuted);
    });
  }

  function updateMuteIcon(muted) {
    if (!muteIcon) return;
    if (muted) {
      muteIcon.innerHTML = `<line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>`;
    } else {
      muteIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`;
    }
  }

  function setExpanded(expand) {
    isAudioExpanded = expand;
    if (expand) {
      playerModal.classList.remove('hidden');
      playerPill.classList.add('hidden');
    } else {
      playerModal.classList.add('hidden');
      playerPill.classList.remove('hidden');
    }
  }

  if (minimizeBtn) minimizeBtn.addEventListener('click', () => setExpanded(false));
  if (playerPill) playerPill.addEventListener('click', () => setExpanded(true));

  setExpanded(false);

  const startAutoplay = () => {
    audio.play().then(() => {
      updatePlayState(true);
      document.removeEventListener('click', startAutoplay);
    }).catch(() => {});
  };
  document.addEventListener('click', startAutoplay, { once: true });
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* ==========================================================================
   4. SPA ROUTER, BENTO/GRID/LIST VIEWS & CHUNKED ZERO-LAG ROSTER ENGINE
   ========================================================================== */
let currentGangId = null;
let currentRosterFilter = 'all'; // 'all', 'founders', 'leaders', 'members'
let currentViewMode = 'grid';    // 'grid', 'bento', 'compact'
let currentSortBy = 'rank';      // 'rank', 'alpha', 'popular'
let searchQuery = '';
let visibleItemLimit = 48;       // Chunked rendering prevents DOM locking!

// --- History API (pushState) Router — no # in URL ---
function navigate(path) {
  const clean = path.startsWith('/') ? path : '/' + path;
  if (window.location.pathname !== clean) {
    history.pushState(null, '', clean);
  }
  handleRoute();
}

function initRouter() {
  // Handle back/forward button
  window.addEventListener('popstate', handleRoute);

  // Legacy hash redirect: if someone arrives with a # URL, convert it
  if (window.location.hash) {
    const hashVal = window.location.hash.replace('#', '') || 'home';
    history.replaceState(null, '', '/' + hashVal);
  }

  handleRoute();
}

async function handleRoute() {
  // Get route from pathname (e.g. /beryl → "beryl", / → "home")
  let route = window.location.pathname.replace(/^\//, '') || 'home';

  // Legacy hash fallback (should not happen after initRouter, but safety net)
  if (!route && window.location.hash) {
    route = window.location.hash.replace('#', '') || 'home';
  }

  // Legacy alias redirects (clean pushState)
  if (route === 'vega') {
    history.replaceState(null, '', '/beryl');
    route = 'beryl';
  }

  await syncDataFromServer();

  const homeSection = document.getElementById('home-section');
  const rosterSection = document.getElementById('roster-section');
  const notfoundSection = document.getElementById('notfound-section');
  const adminSection = document.getElementById('admin-section');
  const loginModal = document.getElementById('login-modal');

  // Hide all sections smoothly
  [homeSection, rosterSection, notfoundSection, adminSection].forEach(s => {
    if (s) {
      s.classList.add('hidden');
      s.classList.remove('page-smooth-appear');
    }
  });

  // Ensure admin login modal is hidden when not in admin
  if (route !== 'keyrainahee' && loginModal) {
    loginModal.classList.add('hidden');
  }

  window.scrollTo({ top: 0, behavior: 'auto' });

  function showSection(sec) {
    if (!sec) return;
    sec.classList.remove('hidden');
    void sec.offsetWidth; // trigger reflow for animation restart
    sec.classList.add('page-smooth-appear');
  }

  if (route === 'home' || route === '') {
    currentGangId = null;
    history.replaceState(null, '', '/home');
    showSection(homeSection);
  } else if (route === 'keyrainahee') {
    currentGangId = null;
    showSection(adminSection);
    if (typeof window.initAdminAuth === 'function') {
      window.initAdminAuth();
    }
  } else if (window.GANGS_DATA && window.GANGS_DATA[route]) {
    currentGangId = route;
    showSection(rosterSection);
    searchQuery = '';
    currentRosterFilter = 'all';
    visibleItemLimit = 48;
    renderRosterView(route);
  } else {
    // 404
    currentGangId = null;
    if (notfoundSection) {
      showSection(notfoundSection);
      const routeDisplay = document.getElementById('notfound-route-display');
      if (routeDisplay) {
        routeDisplay.textContent = '/' + route;
      }
    }
  }
}

function renderRosterView(gangId) {
  const gang = window.GANGS_DATA[gangId];
  if (!gang) return;

  const titleEl = document.getElementById('roster-gang-title');
  const subtitleEl = document.getElementById('roster-gang-subtitle');
  const searchInput = document.getElementById('roster-search-input');

  if (titleEl) titleEl.textContent = gang.name;
  if (subtitleEl) subtitleEl.textContent = `${gang.name} MEMBERS`;

  if (searchInput) {
    searchInput.value = '';
    searchQuery = '';
    searchInput.oninput = (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilterAndRender();
    };
  }

  applyFilterAndRender();
}

function getMemberFields(m) {
  const fn = m.fn || m.firstname || '';
  const ln = m.ln || m.lastname || '';
  const fullName = `${fn} ${ln}`.trim() || 'OPERATOR';
  const imgUrl = m.img || m.imageurl || m.image || 'assets/images/beryl-logo.png';
  const fbLink = m.fb || (m.sociallinks ? m.sociallinks.facebook : '');
  const rbx = m.rbx || (m.roblox ? m.roblox.username : '@operative');
  const quote = m.quote || 'Welcome Beryl.';
  const views = m.views || 180;
  const status = m.status || m.discordStatus || 'online';
  const role = m.role || 'Member';
  return { fn, ln, fullName, imgUrl, fbLink, rbx, quote, views, status, role };
}

function applyFilterAndRender() {
  if (!currentGangId || !window.GANGS_DATA) return;
  const gang = window.GANGS_DATA[currentGangId];
  const container = document.getElementById('roster-content-container');
  if (!container) return;

  const q = searchQuery;

  // Filter function
  const filterFn = (m) => {
    if (!q) return true;
    const { fn, ln, rbx, fullName } = getMemberFields(m);
    const n = fullName.toLowerCase();
    return n.includes(q) || fn.toLowerCase().includes(q) || ln.toLowerCase().includes(q) || rbx.toLowerCase().includes(q);
  };

  const visibleFounders = (gang.founders || []).filter(filterFn);
  const visibleLeaders = (gang.leaders || []).filter(filterFn);
  const visibleMembers = (gang.members || []).filter(filterFn);

  const totalVisible = visibleFounders.length + visibleLeaders.length + visibleMembers.length;

  if (totalVisible === 0) {
    container.innerHTML = `
      <div class="py-20 text-center">
        <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-2xl text-white/30 mb-3 shadow-inner">
          â„ï¸
        </div>
        <p class="text-white/50 text-sm font-semibold uppercase tracking-wider">ยังไม่มีรายชื่อสมาชิกในระบบ</p>
      </div>
    `;
    return;
  }

  let html = '';

  // 1. Founders Section (/ 01)
  if (visibleFounders.length > 0) {
    html += `
      <section class="space-y-6">
        <div class="flex items-baseline gap-4 mb-6">
          <h2 class="text-3xl font-black uppercase tracking-tight text-white">Founders</h2>
          <span class="text-base text-white/30">/ 01</span>
        </div>
        <div class="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          ${visibleFounders.map((m) => `<div class="w-full md:w-[calc(50%-0.5rem)]">${renderAuthenticCard(m)}</div>`).join('')}
        </div>
      </section>
    `;
  }

  // Divider between Founders and Leaders
  if (visibleFounders.length > 0 && (visibleLeaders.length > 0 || visibleMembers.length > 0) && !q) {
    html += `
      <div class="flex items-center gap-4 my-8">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    `;
  }

  // 2. Leaders Section (/ 02)
  if (visibleLeaders.length > 0) {
    html += `
      <section class="space-y-6">
        <div class="flex items-baseline gap-4 mb-6">
          <h2 class="text-3xl font-black uppercase tracking-tight text-white">Leaders</h2>
          <span class="text-base text-white/30">/ 02</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${visibleLeaders.map((m) => renderAuthenticCard(m)).join('')}
        </div>
      </section>
    `;
  }

  // Divider between Leaders and Members
  if (visibleLeaders.length > 0 && visibleMembers.length > 0 && !q) {
    html += `
      <div class="flex items-center gap-4 my-8">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    `;
  }

  // 3. Members Section (/ 03)
  if (visibleMembers.length > 0) {
    html += `
      <section class="space-y-6">
        <div class="flex items-baseline gap-4 mb-6">
          <h2 class="text-3xl font-black uppercase tracking-tight text-white">Members</h2>
          <span class="text-base text-white/30">/ 03</span>
        </div>
        <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          ${visibleMembers.map((m) => `<div class="break-inside-avoid">${renderAuthenticCard(m)}</div>`).join('')}
        </div>
      </section>
    `;
  }

  container.innerHTML = html;
}

function renderAuthenticCard(m) {
  const { fullName, imgUrl, fbLink, role } = getMemberFields(m);
  const r = (role || 'MEMBER').trim();

  let roleClass = 'role-default';
  let roleTextColor = 'text-gray-400';
  let roleShadow = '0 0 8px rgba(156, 163, 175, 0.5)';
  let nameHover = 'group-hover:text-white';
  let iconSvg = '';

  if (r.toLowerCase() === 'founder') {
    roleClass = 'role-founder';
    roleTextColor = 'text-yellow-500';
    roleShadow = '0 0 8px rgba(234, 179, 8, 0.6)';
    nameHover = 'group-hover:text-amber-400';
    iconSvg = `<svg class="w-3 h-3 text-yellow-500 drop-shadow-[0_0_4px_rgba(234,179,8,0.7)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>`;
  } else if (r.toLowerCase() === 'leader') {
    roleClass = 'role-leader';
    roleTextColor = 'text-red-500';
    roleShadow = '0 0 8px rgba(239, 68, 68, 0.6)';
    nameHover = 'group-hover:text-red-400';
    iconSvg = `<svg class="w-3 h-3 text-red-500 drop-shadow-[0_0_4px_rgba(239, 68, 68, 0.7)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>`;
  } else if (r.toUpperCase() === 'SUPPORT') {
    roleClass = 'role-support';
    roleTextColor = 'text-blue-500';
    roleShadow = '0 0 8px rgba(59, 130, 246, 0.6)';
    nameHover = 'group-hover:text-blue-400';
    iconSvg = `<svg class="w-3 h-3 text-blue-500 drop-shadow-[0_0_4px_rgba(59,130,246,0.7)] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;
  } else if (r.toLowerCase().includes('temspeed')) {
    roleClass = 'role-temspeed';
    roleTextColor = 'text-purple-500';
    roleShadow = '0 0 8px rgba(168, 85, 247, 0.6)';
    nameHover = 'group-hover:text-purple-400';
    iconSvg = `<svg class="w-3 h-3 text-purple-500 drop-shadow-[0_0_4px_rgba(168,85,247,0.7)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  }

  const fbHtml = fbLink ? `
    <a href="${escapeHtml(fbLink)}" target="_blank" rel="noopener noreferrer" class="text-[#0084ff] text-sm font-medium hover:underline mt-0.5 truncate inline-flex items-center gap-1 font-outfit cursor-pointer">
      Facebook
    </a>
  ` : '';

  return `
    <div class="relative group">
      <div class="ln-member-card ${roleClass} select-none cursor-default">
        <!-- Avatar Container (Status indicator removed) -->
        <div class="relative w-14 h-14 flex-shrink-0 mr-4">
          <div class="w-full h-full rounded-full overflow-hidden bg-black/40 border border-white/10 shadow-lg">
            <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(fullName)}" class="rounded-full object-cover w-full h-full" loading="lazy" onerror="this.src='assets/images/beryl-logo.png'"/>
          </div>
        </div>

        <div class="flex flex-col flex-grow min-w-0 z-10">
          <div class="flex items-center gap-1 mb-0.5">
            ${iconSvg}
            <span class="text-[10px] font-outfit font-extrabold uppercase tracking-wider ${roleTextColor}" style="text-shadow: ${roleShadow}">
              ${escapeHtml(r)}
            </span>
          </div>
          <h3 class="text-white/95 font-outfit font-black text-base truncate ${nameHover} transition-colors tracking-wide">
            ${escapeHtml(fullName)}
          </h3>
          ${fbHtml}
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   6. MODAL SYSTEMS (DOSSIER, BULLETIN, APPLICATION)
   ========================================================================== */
function initModals() {
  document.querySelectorAll('.modal-backdrop').forEach((el) => {
    el.addEventListener('click', closeAllModals);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.system-modal').forEach((m) => {
    m.classList.add('hidden');
  });
  document.body.style.overflow = '';
}

function openProfileModal(m) {
  const modal = document.getElementById('profile-modal');
  const imgEl = document.getElementById('modal-avatar');
  const nameEl = document.getElementById('modal-name');
  const roleEl = document.getElementById('modal-role');
  const idEl = document.getElementById('modal-id');
  const quoteEl = document.getElementById('modal-quote');
  const rbxEl = document.getElementById('modal-roblox');
  const viewsEl = document.getElementById('modal-views');
  const fbBtn = document.getElementById('modal-fb-btn');
  const copyBtn = document.getElementById('modal-copy-btn');
  const shareBtn = document.getElementById('modal-share-btn');
  const statusDotEl = document.getElementById('modal-status-dot');

  if (!modal) return;

  const { fullName, imgUrl, fbLink, rbx, quote, views, role, status } = getMemberFields(m);

  if (statusDotEl) {
    const stLower = (status || '').toLowerCase();
    let dotClass = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
    if (stLower === 'idle') {
      dotClass = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
    } else if (stLower === 'dnd' || stLower.includes('ห้าม')) {
      dotClass = 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
    }
    statusDotEl.className = `absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${dotClass} border-2 border-[#0d0d12] z-30`;
  }

  if (imgEl) {
    imgEl.src = imgUrl;
    imgEl.onerror = () => { imgEl.src = 'assets/images/beryl-logo.png'; };
  }
  if (nameEl) nameEl.textContent = fullName;
  if (quoteEl) quoteEl.textContent = `"${quote}"`;
  if (rbxEl) rbxEl.textContent = rbx;
  if (viewsEl) viewsEl.textContent = views;

  if (roleEl) {
    roleEl.textContent = role.toUpperCase();
    roleEl.className = 'text-xs font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ';
    if (role.toLowerCase() === 'founder') {
      roleEl.className += 'bg-amber-400/10 text-amber-400 border-amber-400/30';
    } else if (role.toLowerCase() === 'leader') {
      roleEl.className += 'bg-red-500/10 text-red-500 border-red-500/30';
    } else {
      roleEl.className += 'bg-white/10 text-white/80 border-white/20';
    }
  }
  if (idEl) {
    idEl.textContent = m.id || m.$id || 'OPERATOR-VERIFIED';
  }

  if (fbBtn) {
    if (fbLink) {
      fbBtn.href = fbLink;
      fbBtn.classList.remove('hidden');
    } else {
      fbBtn.classList.add('hidden');
    }
  }

  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(fullName);
      showToast(t('copiedToast'));
    };
  }

  if (shareBtn) {
    shareBtn.onclick = () => {
      const shareUrl = `${window.location.origin}/#${currentGangId || 'beryl'}`;
      navigator.clipboard.writeText(`${fullName} (${role}) â€” ${shareUrl}`);
      showToast(t('copiedToast'));
    };
  }

  openModal('profile-modal');
}

/* ==========================================================================
   7. LIGHTWEIGHT TOAST NOTIFICATION ENGINE
   ========================================================================== */
function initToast() {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'toast-notice pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#121217] border border-white/20 shadow-2xl text-xs font-mono text-white';
  el.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
    <span>${escapeHtml(message)}</span>
  `;
  container.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.2s ease';
    setTimeout(() => el.remove(), 200);
  }, 2200);
}


