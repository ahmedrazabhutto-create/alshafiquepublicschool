// Main Application Controller

const App = {
  currentPage: 'dashboard',

  init() {
    // Date
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-PK', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    // Password toggle
    document.getElementById('toggle-password')?.addEventListener('click', () => {
      const input = document.getElementById('login-password');
      const icon = document.getElementById('password-icon');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });

    // Demo credentials
    document.querySelectorAll('.demo-cred').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('login-username').value = btn.dataset.user;
        document.getElementById('login-password').value = btn.dataset.pass;
      });
    });

    // Login form
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const remember = document.getElementById('remember-me').checked;
      const result = Auth.login(username, password, remember);
      if (result.success) {
        Utils.toast(`Welcome, ${result.user.name}!`);
        this.showApp();
      } else {
        Utils.toast(result.message, 'error');
      }
    });

    // Forgot password
    document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      Utils.toast('Please contact school administration to reset your password.', 'info');
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      Auth.logout();
      Utils.toast('Logged out successfully');
      this.showLogin();
    });

    // Mobile menu
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('-translate-x-full');
      document.getElementById('sidebar-overlay').classList.toggle('hidden');
    });
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('-translate-x-full');
      document.getElementById('sidebar-overlay').classList.add('hidden');
    });

    // Check existing session
    if (Auth.isLoggedIn()) {
      this.showApp();
    } else {
      this.showLogin();
    }
  },

  showLogin() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  },

  showApp() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    renderSidebar();
    this.navigate('dashboard');
  },

  navigate(page) {
    if (!Auth.canAccess(page)) {
      Utils.toast('You do not have permission to access this page', 'error');
      return;
    }
    this.currentPage = page;
    setActiveNav(page);
    const content = document.getElementById('main-content');
    content.innerHTML = loadingSpinner();

    // Small delay for UX
    setTimeout(() => {
      let html = '';
      switch (page) {
        case 'dashboard': html = Dashboards.render(); break;
        case 'students': html = Students.render(); break;
        case 'teachers': html = Teachers.render(); break;
        case 'classes': html = Classes.render(); break;
        case 'attendance': html = Attendance.render(); break;
        case 'fees': html = Fees.render(); break;
        case 'exams': html = Exams.render(); break;
        case 'timetable': html = Timetable.render(); break;
        case 'notices': html = Notices.render(); break;
        case 'homework': html = Homework.render(); break;
        case 'reports': html = Reports.render(); break;
        case 'settings': html = Settings.render(); break;
        case 'profile': html = Profile.render(); break;
        default: html = Dashboards.render();
      }
      content.innerHTML = html;
    }, 50);
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
