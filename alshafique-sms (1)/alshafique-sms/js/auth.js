// Authentication & Session Management

const SESSION_KEY = 'alshafique_session';

const Auth = {
  login(username, password, remember = false) {
    const db = DB.get();
    const user = db.users.find(u =>
      (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) &&
      u.password === password &&
      u.status === 'active'
    );
    if (!user) return { success: false, message: 'Invalid username or password' };

    const session = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      teacherId: user.teacherId || null,
      studentId: user.studentId || null,
      parentId: user.parentId || null,
      studentIds: user.studentIds || [],
      loginAt: new Date().toISOString()
    };

    if (remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    return { success: true, user: session };
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  },

  getSession() {
    const s = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  },

  isLoggedIn() {
    return !!this.getSession();
  },

  hasRole(...roles) {
    const session = this.getSession();
    return session && roles.includes(session.role);
  },

  canAccess(page) {
    const session = this.getSession();
    if (!session) return false;
    const permissions = {
      admin: ['dashboard', 'students', 'teachers', 'staff', 'classes', 'attendance', 'fees', 'exams', 'timetable', 'notices', 'homework', 'reports', 'settings', 'profile'],
      principal: ['dashboard', 'students', 'teachers', 'staff', 'classes', 'attendance', 'fees', 'exams', 'timetable', 'notices', 'homework', 'reports', 'profile'],
      teacher: ['dashboard', 'students', 'attendance', 'exams', 'timetable', 'notices', 'homework', 'profile'],
      accountant: ['dashboard', 'students', 'fees', 'reports', 'notices', 'profile'],
      student: ['dashboard', 'attendance', 'fees', 'exams', 'timetable', 'notices', 'homework', 'profile'],
      parent: ['dashboard', 'attendance', 'fees', 'exams', 'timetable', 'notices', 'homework', 'profile']
    };
    return (permissions[session.role] || []).includes(page);
  }
};
