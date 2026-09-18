// UI Components & Navigation

const NavMenus = {
  admin: [
    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { page: 'students', icon: 'fa-user-graduate', label: 'Students' },
    { page: 'teachers', icon: 'fa-chalkboard-teacher', label: 'Teachers & Staff' },
    { page: 'classes', icon: 'fa-school', label: 'Classes & Sections' },
    { page: 'attendance', icon: 'fa-clipboard-check', label: 'Attendance' },
    { page: 'fees', icon: 'fa-money-bill-wave', label: 'Fee Management' },
    { page: 'exams', icon: 'fa-file-alt', label: 'Exams & Results' },
    { page: 'timetable', icon: 'fa-calendar-alt', label: 'Timetable' },
    { page: 'notices', icon: 'fa-bullhorn', label: 'Notices' },
    { page: 'homework', icon: 'fa-book', label: 'Homework' },
    { page: 'reports', icon: 'fa-chart-bar', label: 'Reports' },
    { page: 'settings', icon: 'fa-cog', label: 'Settings' }
  ],
  principal: [
    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { page: 'students', icon: 'fa-user-graduate', label: 'Students' },
    { page: 'teachers', icon: 'fa-chalkboard-teacher', label: 'Teachers & Staff' },
    { page: 'classes', icon: 'fa-school', label: 'Classes' },
    { page: 'attendance', icon: 'fa-clipboard-check', label: 'Attendance' },
    { page: 'fees', icon: 'fa-money-bill-wave', label: 'Fees Overview' },
    { page: 'exams', icon: 'fa-file-alt', label: 'Exams & Results' },
    { page: 'timetable', icon: 'fa-calendar-alt', label: 'Timetable' },
    { page: 'notices', icon: 'fa-bullhorn', label: 'Notices' },
    { page: 'reports', icon: 'fa-chart-bar', label: 'Reports' }
  ],
  teacher: [
    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { page: 'students', icon: 'fa-user-graduate', label: 'My Students' },
    { page: 'attendance', icon: 'fa-clipboard-check', label: 'Mark Attendance' },
    { page: 'exams', icon: 'fa-file-alt', label: 'Marks Entry' },
    { page: 'timetable', icon: 'fa-calendar-alt', label: 'My Timetable' },
    { page: 'homework', icon: 'fa-book', label: 'Homework' },
    { page: 'notices', icon: 'fa-bullhorn', label: 'Notices' }
  ],
  accountant: [
    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { page: 'students', icon: 'fa-user-graduate', label: 'Students' },
    { page: 'fees', icon: 'fa-money-bill-wave', label: 'Fee Management' },
    { page: 'reports', icon: 'fa-chart-bar', label: 'Financial Reports' },
    { page: 'notices', icon: 'fa-bullhorn', label: 'Notices' }
  ],
  student: [
    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { page: 'profile', icon: 'fa-id-card', label: 'My Profile' },
    { page: 'attendance', icon: 'fa-clipboard-check', label: 'My Attendance' },
    { page: 'fees', icon: 'fa-money-bill-wave', label: 'Fee Status' },
    { page: 'exams', icon: 'fa-file-alt', label: 'Results' },
    { page: 'timetable', icon: 'fa-calendar-alt', label: 'Timetable' },
    { page: 'homework', icon: 'fa-book', label: 'Homework' },
    { page: 'notices', icon: 'fa-bullhorn', label: 'Notices' }
  ],
  parent: [
    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { page: 'profile', icon: 'fa-id-card', label: 'Child Profile' },
    { page: 'attendance', icon: 'fa-clipboard-check', label: 'Attendance' },
    { page: 'fees', icon: 'fa-money-bill-wave', label: 'Fee Status' },
    { page: 'exams', icon: 'fa-file-alt', label: 'Results' },
    { page: 'timetable', icon: 'fa-calendar-alt', label: 'Timetable' },
    { page: 'homework', icon: 'fa-book', label: 'Homework' },
    { page: 'notices', icon: 'fa-bullhorn', label: 'Notices' }
  ]
};

function renderSidebar() {
  const session = Auth.getSession();
  if (!session) return;
  const menu = NavMenus[session.role] || NavMenus.admin;
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = menu.map(item => `
    <a href="#" data-page="${item.page}" class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-100 transition">
      <i class="fas ${item.icon} w-5 text-center opacity-80"></i>
      <span>${item.label}</span>
    </a>
  `).join('');

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (Auth.canAccess(page)) {
        App.navigate(page);
        // close mobile sidebar
        document.getElementById('sidebar').classList.add('-translate-x-full');
        document.getElementById('sidebar-overlay').classList.add('hidden');
      } else {
        Utils.toast('Access denied', 'error');
      }
    });
  });

  // User info
  document.getElementById('user-name').textContent = session.name;
  document.getElementById('user-role').textContent = session.role;
  document.getElementById('user-avatar').textContent = session.name.charAt(0).toUpperCase();
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
}

function pageHeader(title, actions = '') {
  return `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <h2 class="text-xl font-bold text-slate-800">${title}</h2>
      <div class="flex flex-wrap gap-2">${actions}</div>
    </div>`;
}

function emptyState(icon, message) {
  return `
    <div class="text-center py-16 text-slate-400">
      <i class="fas ${icon} text-5xl mb-4 opacity-50"></i>
      <p class="text-lg">${message}</p>
    </div>`;
}

function loadingSpinner() {
  return `<div class="flex justify-center py-20"><div class="spinner"></div></div>`;
}
