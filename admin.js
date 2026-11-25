/**
 * Beryl Command Console - Ultra-Luxury Bespoke Terminal Engine
 * 60 FPS • WYSIWYG Authentic Cards • Real-time Live Preview • Reorder Hierarchy • Zero Generic Templates
 */

let gangsData = {};
let currentGangKey = 'beryl';
let currentRoleFilter = 'all';
let adminSearchQuery = '';
let pendingDelete = null;

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  loadData();
  bindEvents();
});

/* ==========================================================================
   1. AUTHENTICATION & SESSION
   ========================================================================== */
function initAuth() {
  const loginModal = document.getElementById('login-modal');
  const dashboard = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('login-form');
  const loginInput = document.getElementById('login-password');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  const isAuth = sessionStorage.getItem('beryl_admin_auth') === 'true';
  const isAdmin = window.location.pathname.includes('keyrainahee') || window.location.hash.includes('keyrainahee');

  if (!isAdmin) {
    if (loginModal) loginModal.classList.add('hidden');
    if (dashboard) dashboard.classList.add('hidden');
    return;
  }

  if (isAuth) {
    if (loginModal) loginModal.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');
    renderAll();
  } else {
    if (loginModal) loginModal.classList.remove('hidden');
    if (dashboard) dashboard.classList.add('hidden');
    if (loginInput) {
      loginInput.value = '';
      setTimeout(() => loginInput.focus(), 50);
    }
  }

  if (loginForm && !loginForm._bound) {
    loginForm._bound = true;
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pwd = loginInput.value.trim();
      if (loginError) loginError.classList.add('hidden');

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd })
        });
        const result = await res.json();
        if (result.success) {
          sessionStorage.setItem('beryl_admin_auth', 'true');
          loginModal.classList.add('hidden');
          dashboard.classList.remove('hidden');
          showAdminToast('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับสู่ BERYL TERMINAL');
          renderAll();
        } else {
          loginInput.classList.add('border-red-500');
          if (loginError) {
            loginError.textContent = result.error || 'รหัสผ่านไม่ถูกต้อง';
            loginError.classList.remove('hidden');
          }
          loginInput.select();
        }
      } catch (err) {
        if (pwd === '0uqisdhc') {
          sessionStorage.setItem('beryl_admin_auth', 'true');
          loginModal.classList.add('hidden');
          dashboard.classList.remove('hidden');
          showAdminToast('เข้าสู่ระบบสำเร็จ');
          renderAll();
        } else {
          loginInput.classList.add('border-red-500');
          if (loginError) {
            loginError.textContent = 'รหัสผ่านไม่ถูกต้อง';
            loginError.classList.remove('hidden');
          }
          loginInput.select();
        }
      }
    });

    if (loginInput) {
      loginInput.addEventListener('input', () => {
        loginInput.classList.remove('border-red-500');
        if (loginError) loginError.classList.add('hidden');
      });
    }
  }

  if (logoutBtn && !logoutBtn._bound) {
    logoutBtn._bound = true;
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('beryl_admin_auth');
      if (loginModal) loginModal.classList.add('hidden');
      if (dashboard) dashboard.classList.add('hidden');
      if (typeof navigate === 'function') {
        navigate('home');
      } else {
        window.location.href = '/home';
      }
      showAdminToast('ออกจากระบบเรียบร้อย');
    });
  }
}

/* ==========================================================================
   2. DATA SYNCHRONIZATION
   ========================================================================== */
async function loadData() {
  // 1. Try data.json (pure JSON static file — always up-to-date on GitHub Pages)
  try {
    const basePath = window.location.pathname.includes('/beryl/') ? '/beryl' : '';
    const res = await fetch(basePath + '/data.json?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        gangsData = data;
        window.GANGS_DATA = gangsData;
        localStorage.setItem('beryl_gangs_data', JSON.stringify(gangsData));
        if (!gangsData[currentGangKey]) currentGangKey = Object.keys(gangsData)[0] || 'beryl';
        renderAll(); return;
      }
    }
  } catch (_) {}

  // 2. Local Python server
  try {
    const res = await fetch('/api/data?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        gangsData = await res.json();
        window.GANGS_DATA = gangsData;
        localStorage.setItem('beryl_gangs_data', JSON.stringify(gangsData));
        if (!gangsData[currentGangKey]) currentGangKey = Object.keys(gangsData)[0] || 'beryl';
        renderAll(); return;
      }
    }
  } catch (_) {}

  // 3. localStorage fallback
  try {
    const cached = localStorage.getItem('beryl_gangs_data');
    if (cached) { const p = JSON.parse(cached); if (p && Object.keys(p).length) { gangsData = p; window.GANGS_DATA = gangsData; } }
  } catch (_) {}

  if (!gangsData[currentGangKey]) currentGangKey = Object.keys(gangsData)[0] || 'beryl';
  renderAll();
}

async function saveData() {
  window.GANGS_DATA = gangsData;
  localStorage.setItem('beryl_gangs_data', JSON.stringify(gangsData));

  // Try local server first
  try {
    const res = await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gangsData) });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      const result = await res.json();
      if (result.success) { showAdminToast('OK บันทึกลงเซิร์ฟเวอร์สำเร็จ'); renderAll(); return; }
    }
  } catch (_) {}

  // Static host: download data.json for GitHub upload
  downloadDataJson();
  renderAll();
}

function downloadDataJson() {
  const blob = new Blob([JSON.stringify(gangsData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'data.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showAdminToast('⬇️ ดาวน์โหลด data.json แล้ว — นำไป upload ขึ้น github.com/YOX90/beryl');
}

/* ==========================================================================
   3. RENDERING & BENTO METRICS & AUTHENTIC WYSIWYG CARDS
   ========================================================================== */
function renderAll() {
  renderMetrics();
  renderOperativeCards();
}

function renderMetrics() {
  const g = gangsData[currentGangKey] || { founders: [], leaders: [], members: [] };
  const totalFounders = (g.founders || []).length;
  const totalLeaders = (g.leaders || []).length;
  const totalMembers = (g.members || []).length;
  const totalAll = totalFounders + totalLeaders + totalMembers;

  const totalEl = document.getElementById('stat-total-all');
  const foundersEl = document.getElementById('stat-founders');
  const leadersEl = document.getElementById('stat-leaders');
  const membersEl = document.getElementById('stat-members');

  if (totalEl) totalEl.textContent = totalAll;
  if (foundersEl) foundersEl.textContent = totalFounders;
  if (leadersEl) leadersEl.textContent = totalLeaders;
  if (membersEl) membersEl.textContent = totalMembers;

  // Update filter count badges
  const fAll = document.getElementById('filter-count-all');
  const fFounders = document.getElementById('filter-count-founders');
  const fLeaders = document.getElementById('filter-count-leaders');
  const fMembers = document.getElementById('filter-count-members');

  if (fAll) fAll.textContent = totalAll;
  if (fFounders) fFounders.textContent = totalFounders;
  if (fLeaders) fLeaders.textContent = totalLeaders;
  if (fMembers) fMembers.textContent = totalMembers;
}

function renderOperativeCards() {
  const container = document.getElementById('admin-operatives-container');
  if (!container) return;

  const g = gangsData[currentGangKey] || { founders: [], leaders: [], members: [] };

  const q = (adminSearchQuery || '').toLowerCase();
  const filterFn = (m) => {
    if (!q) return true;
    const fn = (m.fn || m.firstname || '').toLowerCase();
    const ln = (m.ln || m.lastname || '').toLowerCase();
    const rbx = (m.rbx || '').toLowerCase();
    const role = (m.role || '').toLowerCase();
    const quote = (m.quote || '').toLowerCase();
    return fn.includes(q) || ln.includes(q) || `${fn} ${ln}`.includes(q) || rbx.includes(q) || role.includes(q) || quote.includes(q);
  };

  const founders = (g.founders || []).filter(filterFn);
  const leaders = (g.leaders || []).filter(filterFn);
  const members = (g.members || []).filter(filterFn);

  const showFounders = currentRoleFilter === 'all' || currentRoleFilter === 'Founder';
  const showLeaders = currentRoleFilter === 'all' || currentRoleFilter === 'Leader';
  const showMembers = currentRoleFilter === 'all' || currentRoleFilter === 'Member';

  let html = '';

  // 1. Founders Section (/ 01)
  if (showFounders) {
    html += `
      <section class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div class="flex items-center gap-3">
            <span class="text-2xl">👑</span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-black font-outfit uppercase tracking-tight text-white">Founders</h3>
                <span class="text-xs text-white/30 font-mono">/ 01</span>
                <span class="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-mono font-bold">${founders.length}</span>
              </div>
              <p class="text-[10px] text-white/40 font-mono">ผู้ก่อตั้งและแกนหลักขององค์กร BERYL</p>
            </div>
          </div>
          <button 
            type="button"
            class="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 shadow-sm"
            onclick="openAddMemberModal('Founder')"
          >
            <span>+</span>
            <span>เพิ่ม Founder</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${founders.length > 0 
            ? founders.map((m, idx) => renderOperativeCardHtml(m, 'founders', idx, founders.length)).join('')
            : renderEmptyTierSlot('Founder', 'founders')
          }
        </div>
      </section>
    `;
  }

  // 2. Leaders Section (/ 02)
  if (showLeaders) {
    html += `
      <section class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-red-500/20">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🔥</span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-black font-outfit uppercase tracking-tight text-white">Leaders</h3>
                <span class="text-xs text-white/30 font-mono">/ 02</span>
                <span class="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-mono font-bold">${leaders.length}</span>
              </div>
              <p class="text-[10px] text-white/40 font-mono">แกนนำและหัวหน้าฝ่ายยุทธการ BERYL</p>
            </div>
          </div>
          <button 
            type="button"
            class="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 shadow-sm"
            onclick="openAddMemberModal('Leader')"
          >
            <span>+</span>
            <span>เพิ่ม Leader</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${leaders.length > 0 
            ? leaders.map((m, idx) => renderOperativeCardHtml(m, 'leaders', idx, leaders.length)).join('')
            : renderEmptyTierSlot('Leader', 'leaders')
          }
        </div>
      </section>
    `;
  }

  // 3. Members Section (/ 03)
  if (showMembers) {
    html += `
      <section class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⚔️</span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-black font-outfit uppercase tracking-tight text-white">Members</h3>
                <span class="text-xs text-white/30 font-mono">/ 03</span>
                <span class="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-[10px] font-mono font-bold">${members.length}</span>
              </div>
              <p class="text-[10px] text-white/40 font-mono">สมาชิกกองกำลังประจำการ BERYL</p>
            </div>
          </div>
          <button 
            type="button"
            class="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 shadow-sm"
            onclick="openAddMemberModal('Member')"
          >
            <span>+</span>
            <span>เพิ่ม Member</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${members.length > 0 
            ? members.map((m, idx) => renderOperativeCardHtml(m, 'members', idx, members.length)).join('')
            : renderEmptyTierSlot('Member', 'members')
          }
        </div>
      </section>
    `;
  }

  container.innerHTML = html;
}

/**
 * 1:1 WYSIWYG Authentic Member Card matching public site (#beryl)
 * Augmented with floating glass admin action dock (Edit, Reorder, Delete)
 */
function renderOperativeCardHtml(m, section, idx, totalCount) {
  const fn = m.fn || m.firstname || '';
  const ln = m.ln || m.lastname || '';
  const fullName = `${fn} ${ln}`.trim() || 'OPERATOR';
  const imgUrl = m.img || m.imageurl || 'assets/images/beryl-logo.png';
  const fb = m.fb || '';
  const rbx = m.rbx || '';
  const role = (m.role || 'Member').trim();

  let roleClass = 'role-default';
  let roleTextColor = 'text-gray-400';
  let roleShadow = '0 0 8px rgba(156, 163, 175, 0.5)';
  let iconSvg = '';

  if (role.toLowerCase() === 'founder') {
    roleClass = 'role-founder';
    roleTextColor = 'text-yellow-500';
    roleShadow = '0 0 8px rgba(234, 179, 8, 0.6)';
    iconSvg = `<svg class="w-3 h-3 text-yellow-500 drop-shadow-[0_0_4px_rgba(234,179,8,0.7)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>`;
  } else if (role.toLowerCase() === 'leader') {
    roleClass = 'role-leader';
    roleTextColor = 'text-red-500';
    roleShadow = '0 0 8px rgba(239, 68, 68, 0.6)';
    iconSvg = `<svg class="w-3 h-3 text-red-500 drop-shadow-[0_0_4px_rgba(239, 68, 68, 0.7)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>`;
  } else if (role.toUpperCase() === 'SUPPORT') {
    roleClass = 'role-support';
    roleTextColor = 'text-blue-500';
    roleShadow = '0 0 8px rgba(59, 130, 246, 0.6)';
    iconSvg = `<svg class="w-3 h-3 text-blue-500 drop-shadow-[0_0_4px_rgba(59,130,246,0.7)] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;
  } else if (role.toLowerCase().includes('temspeed')) {
    roleClass = 'role-temspeed';
    roleTextColor = 'text-purple-500';
    roleShadow = '0 0 8px rgba(168, 85, 247, 0.6)';
    iconSvg = `<svg class="w-3 h-3 text-purple-500 drop-shadow-[0_0_4px_rgba(168,85,247,0.7)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  }

  const fbHtml = fb ? `
    <a href="${adminEscapeHtml(fb)}" target="_blank" rel="noopener noreferrer" class="text-[#0084ff] text-xs font-semibold hover:underline inline-flex items-center gap-1 font-outfit">
      Facebook ↗
    </a>
  ` : '';

  return `
    <div class="relative group">
      <!-- Authentic 1:1 Member Card -->
      <div class="ln-member-card ${roleClass} select-none cursor-default !pr-28">
        
        <!-- Avatar Container (No status dot) -->
        <div class="relative w-14 h-14 flex-shrink-0 mr-4">
          <div class="w-full h-full rounded-full overflow-hidden bg-black/40 border border-white/10 shadow-lg">
            <img src="${adminEscapeHtml(imgUrl)}" alt="${adminEscapeHtml(fullName)}" class="rounded-full object-cover w-full h-full" onerror="this.src='assets/images/beryl-logo.png'"/>
          </div>
        </div>

        <!-- Body Details -->
        <div class="flex flex-col flex-grow min-w-0 z-10">
          <div class="flex items-center gap-1 mb-0.5">
            ${iconSvg}
            <span class="text-[10px] font-outfit font-extrabold uppercase tracking-wider ${roleTextColor}" style="text-shadow: ${roleShadow}">
              ${adminEscapeHtml(role)}
            </span>
          </div>
          <h3 class="text-white/95 font-outfit font-black text-base truncate tracking-wide">
            ${adminEscapeHtml(fullName)}
          </h3>
          <div class="flex items-center gap-2.5 mt-0.5">
            ${fbHtml}
            ${rbx ? `<span class="text-white/30 font-mono text-[11px] truncate">${adminEscapeHtml(rbx)}</span>` : ''}
          </div>
        </div>

      </div>

      <!-- Floating Glass Action Dock (Top Right) -->
      <div class="admin-actions absolute top-3 right-3 flex items-center gap-1 z-20">
        <!-- Reorder buttons -->
        <button 
          type="button" 
          onclick="moveMember('${section}', ${idx}, -1)" 
          class="admin-dock-btn !p-1.5 ${idx === 0 ? 'opacity-30 pointer-events-none' : ''}" 
          title="เลื่อนขึ้น"
        >
          ▲
        </button>
        <button 
          type="button" 
          onclick="moveMember('${section}', ${idx}, 1)" 
          class="admin-dock-btn !p-1.5 ${idx >= totalCount - 1 ? 'opacity-30 pointer-events-none' : ''}" 
          title="เลื่อนลง"
        >
          ▼
        </button>
        <!-- Edit button -->
        <button 
          type="button" 
          onclick="openEditMemberModal('${section}', ${idx})" 
          class="admin-dock-btn text-amber-300 hover:text-white" 
          title="แก้ไขข้อมูล"
        >
          ✏️
        </button>
        <!-- Delete button -->
        <button 
          type="button" 
          onclick="promptDeleteMember('${section}', ${idx})" 
          class="admin-dock-btn admin-dock-btn-danger" 
          title="ลบสมาชิก"
        >
          🗑️
        </button>
      </div>
    </div>
  `;
}

function renderEmptyTierSlot(roleTitle, section) {
  return `
    <div 
      onclick="openAddMemberModal('${roleTitle}')"
      class="col-span-full border border-dashed border-white/10 hover:border-white/30 rounded-2xl p-7 text-center cursor-pointer bg-white/[0.01] hover:bg-white/[0.03] transition-all group shadow-inner"
    >
      <div class="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-lg text-white/40 group-hover:scale-110 group-hover:text-white group-hover:border-white/30 transition-all mb-2.5">
        +
      </div>
      <p class="text-xs font-mono font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">
        + คลิกเพื่อเพิ่ม ${roleTitle} คนแรก
      </p>
      <p class="text-[10px] text-white/30 font-mono mt-1">กดที่นี่เพื่อเปิดหน้าต่างกรอกข้อมูลสมาชิกใหม่</p>
    </div>
  `;
}

/* ==========================================================================
   4. REORDERING & DELETE CONFIRMATION
   ========================================================================== */
function moveMember(section, index, direction) {
  const g = gangsData[currentGangKey];
  if (!g || !g[section]) return;
  const list = g[section];
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= list.length) return;

  const temp = list[index];
  list[index] = list[newIndex];
  list[newIndex] = temp;

  renderAll();
  saveData();
  showAdminToast('ปรับลำดับสมาชิกเรียบร้อยแล้ว');
}

function promptDeleteMember(section, index) {
  const g = gangsData[currentGangKey];
  if (!g || !g[section] || !g[section][index]) return;
  const m = g[section][index];
  const name = `${m.fn || m.firstname || ''} ${m.ln || m.lastname || ''}`.trim() || 'OPERATOR';

  pendingDelete = { section, index, name };
  const targetNameEl = document.getElementById('delete-target-name');
  if (targetNameEl) targetNameEl.textContent = name;

  const modal = document.getElementById('delete-confirm-modal');
  if (modal) modal.classList.remove('hidden');
}

function confirmDeleteMember() {
  if (!pendingDelete) return;
  const { section, index, name } = pendingDelete;
  const g = gangsData[currentGangKey];
  if (g && g[section] && g[section][index]) {
    g[section].splice(index, 1);
    showAdminToast(`ลบสมาชิก ${name} แล้ว`);
    saveData();
  }
  closeDeleteConfirmModal();
}

function closeDeleteConfirmModal() {
  pendingDelete = null;
  const modal = document.getElementById('delete-confirm-modal');
  if (modal) modal.classList.add('hidden');
}

/* ==========================================================================
   5. BESPOKE LIVE OPERATIVE EDITOR (With Real-Time Card Preview)
   ========================================================================== */
function openAddMemberModal(presetRole) {
  const modal = document.getElementById('member-modal');
  const title = document.getElementById('member-modal-title');
  const form = document.getElementById('member-form');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('edit-member-index').value = '-1';
  document.getElementById('edit-member-section').value = '';

  const initialRole = presetRole || 'Founder';
  setRolePill(initialRole);

  document.getElementById('form-fn').value = '';
  document.getElementById('form-ln').value = '';
  document.getElementById('form-img').value = '';
  document.getElementById('form-fb').value = '';
  document.getElementById('form-rbx').value = '';
  document.getElementById('form-quote').value = 'Welcome Beryl, Standing Strong.';

  if (title) title.textContent = `เพิ่มสมาชิกใหม่ (${initialRole})`;
  modal.classList.remove('hidden');

  updateLiveCardPreview();
  setTimeout(() => document.getElementById('form-fn').focus(), 100);
}

function openEditMemberModal(section, index) {
  const modal = document.getElementById('member-modal');
  const title = document.getElementById('member-modal-title');
  const form = document.getElementById('member-form');
  if (!modal || !form) return;

  const g = gangsData[currentGangKey] || {};
  const list = g[section] || [];
  const m = list[index];
  if (!m) return;

  document.getElementById('edit-member-index').value = index;
  document.getElementById('edit-member-section').value = section;

  document.getElementById('form-fn').value = m.fn || m.firstname || '';
  document.getElementById('form-ln').value = m.ln || m.lastname || '';
  document.getElementById('form-img').value = m.img || m.imageurl || '';
  document.getElementById('form-fb').value = m.fb || '';
  document.getElementById('form-rbx').value = m.rbx || '';
  document.getElementById('form-quote').value = m.quote || 'Welcome Beryl, Standing Strong.';

  setRolePill(m.role || 'Member');

  if (title) title.textContent = `แก้ไขข้อมูล: ${m.fn || m.firstname || 'สมาชิก'}`;
  modal.classList.remove('hidden');

  updateLiveCardPreview();
}

function closeMemberModal() {
  const modal = document.getElementById('member-modal');
  if (modal) modal.classList.add('hidden');
}

function setRolePill(role) {
  const input = document.getElementById('form-role');
  if (input) input.value = role;

  const buttons = document.querySelectorAll('#role-pill-selector .role-pill-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-role').toLowerCase() === role.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  updateLiveCardPreview();
}

function updateLiveCardPreview() {
  const preview = document.getElementById('editor-card-preview');
  if (!preview) return;

  const fn = (document.getElementById('form-fn')?.value || '').trim();
  const ln = (document.getElementById('form-ln')?.value || '').trim();
  const fullName = `${fn} ${ln}`.trim() || 'ชื่อสมาชิก (NAME)';
  const imgUrl = (document.getElementById('form-img')?.value || '').trim() || 'assets/images/beryl-logo.png';
  const role = document.getElementById('form-role')?.value || 'Founder';
  const fb = (document.getElementById('form-fb')?.value || '').trim();
  const rbx = (document.getElementById('form-rbx')?.value || '').trim() || '@operative';
  const quote = (document.getElementById('form-quote')?.value || '').trim() || 'Welcome Beryl, Standing Strong.';

  let roleClass = 'role-default';
  let roleTextColor = 'text-gray-400';
  let roleShadow = '0 0 8px rgba(156, 163, 175, 0.5)';
  let iconSvg = '';

  if (role.toLowerCase() === 'founder') {
    roleClass = 'role-founder';
    roleTextColor = 'text-yellow-500';
    roleShadow = '0 0 8px rgba(234, 179, 8, 0.6)';
    iconSvg = `<svg class="w-3 h-3 text-yellow-500 drop-shadow-[0_0_4px_rgba(234,179,8,0.7)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>`;
  } else if (role.toLowerCase() === 'leader') {
    roleClass = 'role-leader';
    roleTextColor = 'text-red-500';
    roleShadow = '0 0 8px rgba(239, 68, 68, 0.6)';
    iconSvg = `<svg class="w-3 h-3 text-red-500 drop-shadow-[0_0_4px_rgba(239, 68, 68, 0.7)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>`;
  } else if (role.toUpperCase() === 'SUPPORT') {
    roleClass = 'role-support';
    roleTextColor = 'text-blue-500';
    roleShadow = '0 0 8px rgba(59, 130, 246, 0.6)';
    iconSvg = `<svg class="w-3 h-3 text-blue-500 drop-shadow-[0_0_4px_rgba(59,130,246,0.7)] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;
  } else if (role.toLowerCase().includes('temspeed')) {
    roleClass = 'role-temspeed';
    roleTextColor = 'text-purple-500';
    roleShadow = '0 0 8px rgba(168, 85, 247, 0.6)';
    iconSvg = `<svg class="w-3 h-3 text-purple-500 drop-shadow-[0_0_4px_rgba(168,85,247,0.7)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  }

  const fbHtml = fb ? `
    <span class="text-[#0084ff] text-xs font-semibold inline-flex items-center gap-1 font-outfit">
      Facebook ↗
    </span>
  ` : '<span class="text-white/20 text-xs font-mono">ไม่มี Facebook</span>';

  preview.innerHTML = `
    <div class="relative group">
      <div class="ln-member-card ${roleClass} select-none cursor-default shadow-2xl">
        <!-- Avatar Container (No status dot) -->
        <div class="relative w-14 h-14 flex-shrink-0 mr-4">
          <div class="w-full h-full rounded-full overflow-hidden bg-black/40 border border-white/10 shadow-lg">
            <img src="${adminEscapeHtml(imgUrl)}" alt="${adminEscapeHtml(fullName)}" class="rounded-full object-cover w-full h-full" onerror="this.src='assets/images/beryl-logo.png'"/>
          </div>
        </div>

        <!-- Body Details -->
        <div class="flex flex-col flex-grow min-w-0 z-10">
          <div class="flex items-center gap-1 mb-0.5">
            ${iconSvg}
            <span class="text-[10px] font-outfit font-extrabold uppercase tracking-wider ${roleTextColor}" style="text-shadow: ${roleShadow}">
              ${adminEscapeHtml(role)}
            </span>
          </div>
          <h3 class="text-white font-outfit font-black text-base truncate tracking-wide">
            ${adminEscapeHtml(fullName)}
          </h3>
          <div class="flex items-center gap-2.5 mt-0.5">
            ${fbHtml}
            <span class="text-white/30 font-mono text-[11px] truncate">${adminEscapeHtml(rbx)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function saveMemberFromForm(e) {
  e.preventDefault();

  const editIndex = parseInt(document.getElementById('edit-member-index').value, 10);
  const editSection = document.getElementById('edit-member-section').value;

  const fn = document.getElementById('form-fn').value.trim();
  const ln = document.getElementById('form-ln').value.trim();
  const role = document.getElementById('form-role').value;
  const img = document.getElementById('form-img').value.trim();
  const fb = document.getElementById('form-fb').value.trim();
  const rbx = document.getElementById('form-rbx').value.trim() || '@operative';
  const quote = document.getElementById('form-quote').value.trim() || 'Welcome Beryl, Standing Strong.';

  // Target target array
  let targetSection = 'members';
  const rLower = role.toLowerCase();
  if (rLower === 'founder') {
    targetSection = 'founders';
  } else if (rLower === 'leader') {
    targetSection = 'leaders';
  }

  const memberObj = {
    fn,
    ln,
    role,
    img: img || 'assets/images/beryl-logo.png',
    fb,
    rbx,
    quote,
    views: 240
  };

  const g = gangsData[currentGangKey];
  if (!g) return;

  if (editIndex >= 0 && editSection) {
    if (editSection === targetSection) {
      g[editSection][editIndex] = memberObj;
    } else {
      g[editSection].splice(editIndex, 1);
      if (!g[targetSection]) g[targetSection] = [];
      g[targetSection].push(memberObj);
    }
    showAdminToast(`อัปเดตข้อมูล ${fn} ${ln} เรียบร้อยแล้ว`);
  } else {
    if (!g[targetSection]) g[targetSection] = [];
    g[targetSection].push(memberObj);
    showAdminToast(`เพิ่มสมาชิก ${fn} ${ln} สำเร็จ`);
  }

  closeMemberModal();
  saveData();
}

/* ==========================================================================
   6. DOWNLOAD data.json — upload to GitHub Pages to deploy
   ========================================================================== */
async function commitToGitHub() {
  downloadDataJson();
}

/* ==========================================================================
   6B. PDF EXPORT — print-formatted roster
   ========================================================================== */
function exportPDF() {
  const g = gangsData[currentGangKey];
  if (!g) { showAdminToast('ไม่มีข้อมูลสมาชิก'); return; }

  const founders = g.founders || [];
  const leaders  = g.leaders  || [];
  const members  = g.members  || [];

  function memberRows(list, roleLabel) {
    if (!list.length) return '';
    return `
      <tr class="section-header">
        <td colspan="5">${roleLabel} (${list.length} คน)</td>
      </tr>
      ${list.map((m, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${adminEscapeHtml((m.fn||'') + ' ' + (m.ln||''))}</td>
          <td>${adminEscapeHtml(m.rbx || '-')}</td>
          <td>${m.fb ? `<a href="${adminEscapeHtml(m.fb)}">${adminEscapeHtml(m.fb.substring(0,40))}…</a>` : '-'}</td>
          <td>${adminEscapeHtml(m.quote || '-')}</td>
        </tr>
      `).join('')}
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="th"><head><meta charset="UTF-8">
<title>BERYL — ทำเนียบสมาชิก</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Anuphan', sans-serif; color: #111; padding: 24px; font-size: 12px; }
  h1 { font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px; }
  .meta { color: #555; font-size: 11px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #111; color: #fff; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
  td { padding: 7px 10px; border-bottom: 1px solid #e5e5e5; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr.section-header td { background: #f5f5f5; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #333; padding: 6px 10px; }
  tr:nth-child(even):not(.section-header) td { background: #fafafa; }
  a { color: #1a73e8; text-decoration: none; }
  .summary { display: flex; gap: 24px; margin-bottom: 20px; }
  .stat { text-align: center; }
  .stat-num { font-size: 28px; font-weight: 700; line-height: 1; }
  .stat-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }
  @media print {
    body { padding: 12px; }
    .no-print { display: none; }
    @page { margin: 15mm; size: A4; }
  }
</style>
</head><body>
  <h1>BERYL SYNDICATE — ทำเนียบสมาชิก</h1>
  <p class="meta">พิมพ์เมื่อ: ${new Date().toLocaleString('th-TH')} &nbsp;|&nbsp; แก๊ง: ${adminEscapeHtml(g.name || currentGangKey.toUpperCase())}</p>
  <div class="summary">
    <div class="stat"><div class="stat-num">${founders.length + leaders.length + members.length}</div><div class="stat-label">สมาชิกทั้งหมด</div></div>
    <div class="stat"><div class="stat-num">${founders.length}</div><div class="stat-label">👑 Founders</div></div>
    <div class="stat"><div class="stat-num">${leaders.length}</div><div class="stat-label">🔥 Leaders</div></div>
    <div class="stat"><div class="stat-num">${members.length}</div><div class="stat-label">⚡ Members</div></div>
  </div>
  <button class="no-print" onclick="window.print()" style="margin-bottom:16px;padding:8px 20px;background:#111;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;">🖨️ พิมพ์ / บันทึก PDF</button>
  <table>
    <thead>
      <tr>
        <th>#</th><th>ชื่อ</th><th>Roblox</th><th>Facebook</th><th>Quote</th>
      </tr>
    </thead>
    <tbody>
      ${memberRows(founders, '👑 Founders')}
      ${memberRows(leaders, '🔥 Leaders')}
      ${memberRows(members, '⚡ Members')}
    </tbody>
  </table>
</body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

/* ==========================================================================
   7. BACKUP MODAL & EVENT BINDINGS
   ========================================================================== */
function openBackupModal() {
  const modal = document.getElementById('backup-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeBackupModal() {
  const modal = document.getElementById('backup-modal');
  if (modal) modal.classList.add('hidden');
}

function bindEvents() {
  const saveBtn = document.getElementById('save-data-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveData);

  const commitBtn = document.getElementById('commit-github-btn');
  if (commitBtn) commitBtn.addEventListener('click', commitToGitHub);

  const pdfBtn = document.getElementById('pdf-export-btn');
  if (pdfBtn) pdfBtn.addEventListener('click', exportPDF);

  const openAddBtn = document.getElementById('open-add-member-btn');
  if (openAddBtn) openAddBtn.addEventListener('click', () => openAddMemberModal());

  const closeMemberBtn = document.getElementById('close-member-modal-btn');
  if (closeMemberBtn) closeMemberBtn.addEventListener('click', closeMemberModal);

  const memberForm = document.getElementById('member-form');
  if (memberForm) memberForm.addEventListener('submit', saveMemberFromForm);

  // Live input sync to preview
  ['form-fn', 'form-ln', 'form-img', 'form-fb', 'form-rbx', 'form-quote'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateLiveCardPreview);
  });

  // Role pill selector
  const roleButtons = document.querySelectorAll('#role-pill-selector .role-pill-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setRolePill(btn.getAttribute('data-role'));
    });
  });

  // Search input & clear button
  const searchInput = document.getElementById('admin-search-input');
  const searchClear = document.getElementById('admin-search-clear');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      adminSearchQuery = e.target.value.trim();
      if (searchClear) {
        searchClear.classList.toggle('hidden', !adminSearchQuery);
      }
      renderOperativeCards();
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      adminSearchQuery = '';
      searchClear.classList.add('hidden');
      renderOperativeCards();
      searchInput.focus();
    });
  }

  // Filter tabs
  const filterButtons = document.querySelectorAll('.admin-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-white', 'text-black');
        b.classList.add('text-white/60');
      });
      btn.classList.add('bg-white', 'text-black');
      btn.classList.remove('text-white/60');

      currentRoleFilter = btn.getAttribute('data-filter') || 'all';
      renderOperativeCards();
    });
  });

  // Delete modal buttons
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);

  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', confirmDeleteMember);

  // Backup modal buttons
  const openBackupBtn = document.getElementById('open-backup-modal-btn');
  if (openBackupBtn) openBackupBtn.addEventListener('click', openBackupModal);

  const closeBackupBtn = document.getElementById('close-backup-modal-btn');
  if (closeBackupBtn) closeBackupBtn.addEventListener('click', closeBackupModal);

  // File Upload Handling
  const fileUploadInput = document.getElementById('form-file-upload');
  if (fileUploadInput) {
    fileUploadInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64Data = ev.target.result;

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64Data,
              filename: file.name
            })
          });
          const result = await res.json();
          if (result.success && result.url) {
            document.getElementById('form-img').value = result.url;
            showAdminToast('อัปโหลดรูปภาพสำเร็จ');
          } else {
            document.getElementById('form-img').value = base64Data;
          }
        } catch (err) {
          document.getElementById('form-img').value = base64Data;
        }

        updateLiveCardPreview();
      };
      reader.readAsDataURL(file);
    });
  }

  // Export JSON
  const exportBtn = document.getElementById('export-json-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gangsData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `beryl_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showAdminToast('ดาวน์โหลดไฟล์สำรองข้อมูลแล้ว');
    });
  }

  // Import JSON
  const importInput = document.getElementById('import-json-input');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          if (imported && typeof imported === 'object') {
            gangsData = imported;
            saveData();
            closeBackupModal();
            showAdminToast('นำเข้าข้อมูลเรียบร้อยแล้ว');
          }
        } catch (err) {
          showAdminToast('ไฟล์ JSON ไม่ถูกต้อง');
        }
      };
      reader.readAsText(file);
    });
  }

  // Escape to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMemberModal();
      closeDeleteConfirmModal();
      closeBackupModal();
    }
  });
}

function showAdminToast(message) {
  let container = document.getElementById('admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-toast-container';
    container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'px-4 py-2.5 rounded-2xl bg-[#0f0f15]/95 border border-white/20 text-white text-xs font-mono shadow-2xl backdrop-blur-xl flex items-center gap-2 fade-in';
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
    <span>${adminEscapeHtml(message)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function adminEscapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.initAdminAuth = initAuth;
window.loadAdminData = loadData;
window.renderAdminAll = renderAll;
window.showAdminToast = showAdminToast;
window.openAddMemberModal = openAddMemberModal;
window.openEditMemberModal = openEditMemberModal;
window.closeMemberModal = closeMemberModal;
window.moveMember = moveMember;
window.promptDeleteMember = promptDeleteMember;
