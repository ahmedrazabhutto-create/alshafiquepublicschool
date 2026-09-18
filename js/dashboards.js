// Role-based Dashboards

const Dashboards = {
  render() {
    const session = Auth.getSession();
    const role = session.role;
    if (role === 'admin' || role === 'principal') return this.adminDashboard();
    if (role === 'teacher') return this.teacherDashboard();
    if (role === 'accountant') return this.accountantDashboard();
    if (role === 'student') return this.studentDashboard();
    if (role === 'parent') return this.parentDashboard();
    return this.adminDashboard();
  },

  adminDashboard() {
    const db = DB.get();
    const totalStudents = db.students.filter(s => s.status === 'active').length;
    const totalTeachers = db.teachers.filter(t => t.status === 'active').length;
    const totalClasses = db.classes.length;
    const totalStaff = db.staff.filter(s => s.status === 'active').length + totalTeachers;
    const paidFees = db.fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
    const pendingFees = db.fees.filter(f => f.status === 'pending').reduce((s, f) => s + f.amount, 0);
    const today = Utils.today();
    const todayAtt = db.attendance.filter(a => a.date === today);
    const presentToday = todayAtt.filter(a => a.status === 'present').length;
    const attPercent = todayAtt.length ? ((presentToday / todayAtt.length) * 100).toFixed(0) : 0;

    // Chart data - monthly fee collection
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const feeByMonth = months.map((m, i) => {
      const monthName = ['April','May','June','July','August','September'][i];
      return db.fees.filter(f => f.month === monthName && f.status === 'paid').reduce((s, f) => s + f.amount, 0);
    });

    setTimeout(() => {
      const ctx1 = document.getElementById('feeChart');
      if (ctx1) {
        new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              label: 'Fee Collection (Rs.)',
              data: feeByMonth,
              backgroundColor: 'rgba(37, 99, 235, 0.7)',
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }
        });
      }
      const ctx2 = document.getElementById('attChart');
      if (ctx2) {
        const present = db.attendance.filter(a => a.status === 'present').length;
        const absent = db.attendance.filter(a => a.status === 'absent').length;
        const late = db.attendance.filter(a => a.status === 'late').length;
        const leave = db.attendance.filter(a => a.status === 'leave').length;
        new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: ['Present', 'Absent', 'Late', 'Leave'],
            datasets: [{
              data: [present, absent, late, leave],
              backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#6366f1']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
      }
    }, 100);

    return `
      <div class="page-enter">
        ${pageHeader('Dashboard Overview')}
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div class="stat-card bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase">Total Students</p>
                <p class="text-3xl font-bold text-slate-800 mt-1">${totalStudents}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <i class="fas fa-user-graduate text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div class="stat-card bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase">Total Teachers</p>
                <p class="text-3xl font-bold text-slate-800 mt-1">${totalTeachers}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <i class="fas fa-chalkboard-teacher text-indigo-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div class="stat-card bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase">Total Classes</p>
                <p class="text-3xl font-bold text-slate-800 mt-1">${totalClasses}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <i class="fas fa-school text-cyan-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div class="stat-card bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase">Total Staff</p>
                <p class="text-3xl font-bold text-slate-800 mt-1">${totalStaff}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <i class="fas fa-users text-violet-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div class="stat-card bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 shadow text-white">
            <p class="text-xs font-medium text-green-100 uppercase">Fee Collection</p>
            <p class="text-2xl font-bold mt-1">${Utils.formatCurrency(paidFees)}</p>
          </div>
          <div class="stat-card bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 shadow text-white">
            <p class="text-xs font-medium text-amber-100 uppercase">Pending Fees</p>
            <p class="text-2xl font-bold mt-1">${Utils.formatCurrency(pendingFees)}</p>
          </div>
          <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 shadow text-white">
            <p class="text-xs font-medium text-blue-100 uppercase">Today Attendance</p>
            <p class="text-2xl font-bold mt-1">${attPercent}%</p>
          </div>
          <div class="stat-card bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 shadow text-white">
            <p class="text-xs font-medium text-purple-100 uppercase">Active Notices</p>
            <p class="text-2xl font-bold mt-1">${db.notices.length}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 class="font-semibold text-slate-800 mb-4">Fee Collection Overview</h3>
            <div style="height:260px"><canvas id="feeChart"></canvas></div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 class="font-semibold text-slate-800 mb-4">Attendance Summary</h3>
            <div style="height:260px"><canvas id="attChart"></canvas></div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 class="font-semibold text-slate-800 mb-4 flex items-center gap-2"><i class="fas fa-history text-blue-500"></i> Recent Activities</h3>
            <ul class="space-y-3">
              ${db.activities.map(a => `
                <li class="flex items-start gap-3 text-sm">
                  <span class="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></span>
                  <div>
                    <p class="text-slate-700">${a.text}</p>
                    <p class="text-xs text-slate-400">${a.time}</p>
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 class="font-semibold text-slate-800 mb-4 flex items-center gap-2"><i class="fas fa-bullhorn text-amber-500"></i> Announcements</h3>
            <ul class="space-y-3">
              ${db.notices.slice(0, 5).map(n => `
                <li class="border-l-4 ${n.priority === 'high' ? 'border-red-400' : 'border-blue-400'} pl-3">
                  <p class="text-sm font-medium text-slate-800">${n.title}</p>
                  <p class="text-xs text-slate-500 mt-0.5">${Utils.formatDate(n.date)} • ${n.category}</p>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>`;
  },

  teacherDashboard() {
    const session = Auth.getSession();
    const db = DB.get();
    const teacher = db.teachers.find(t => t.id === session.teacherId) || db.teachers[0];
    const myClasses = teacher?.classes || [];
    return `
      <div class="page-enter">
        ${pageHeader('Teacher Dashboard')}
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white mb-6">
          <h3 class="text-xl font-bold">Welcome, ${session.name}!</h3>
          <p class="text-blue-100 mt-1">Subject: ${teacher?.subject || 'N/A'} • ${myClasses.length} Class(es) Assigned</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-xl p-5 shadow-sm border">
            <p class="text-xs text-slate-500 uppercase font-medium">Assigned Classes</p>
            <p class="text-2xl font-bold mt-1">${myClasses.length}</p>
          </div>
          <div class="bg-white rounded-xl p-5 shadow-sm border">
            <p class="text-xs text-slate-500 uppercase font-medium">Pending Homework</p>
            <p class="text-2xl font-bold mt-1">${db.homework.length}</p>
          </div>
          <div class="bg-white rounded-xl p-5 shadow-sm border">
            <p class="text-xs text-slate-500 uppercase font-medium">Notices</p>
            <p class="text-2xl font-bold mt-1">${db.notices.length}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm border p-5">
            <h3 class="font-semibold mb-3">My Classes</h3>
            <div class="space-y-2">
              ${myClasses.map(c => `<div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"><span class="font-medium">${c}</span><span class="text-xs text-slate-500">${teacher.subject}</span></div>`).join('') || '<p class="text-slate-400">No classes assigned</p>'}
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border p-5">
            <h3 class="font-semibold mb-3">Recent Notices</h3>
            ${db.notices.slice(0,4).map(n => `<div class="mb-3 pb-3 border-b border-slate-100 last:border-0"><p class="text-sm font-medium">${n.title}</p><p class="text-xs text-slate-400">${Utils.formatDate(n.date)}</p></div>`).join('')}
          </div>
        </div>
      </div>`;
  },

  accountantDashboard() {
    const db = DB.get();
    const paid = db.fees.filter(f => f.status === 'paid').reduce((s,f) => s + f.amount, 0);
    const pending = db.fees.filter(f => f.status === 'pending').reduce((s,f) => s + f.amount, 0);
    const pendingCount = db.fees.filter(f => f.status === 'pending').length;
    return `
      <div class="page-enter">
        ${pageHeader('Accounts Dashboard')}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow">
            <p class="text-xs text-green-100 uppercase">Total Collected</p>
            <p class="text-2xl font-bold mt-1">${Utils.formatCurrency(paid)}</p>
          </div>
          <div class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow">
            <p class="text-xs text-amber-100 uppercase">Pending Amount</p>
            <p class="text-2xl font-bold mt-1">${Utils.formatCurrency(pending)}</p>
          </div>
          <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white shadow">
            <p class="text-xs text-red-100 uppercase">Pending Records</p>
            <p class="text-2xl font-bold mt-1">${pendingCount}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <h3 class="font-semibold mb-4">Recent Pending Fees</h3>
          <div class="table-wrap">
            <table class="w-full data-table text-sm">
              <thead><tr class="border-b"><th class="py-2 px-3 text-left">Student</th><th class="py-2 px-3 text-left">Type</th><th class="py-2 px-3 text-left">Month</th><th class="py-2 px-3 text-right">Amount</th></tr></thead>
              <tbody>
                ${db.fees.filter(f => f.status === 'pending').slice(0, 8).map(f => {
                  const st = getStudent(f.studentId);
                  return `<tr class="border-b border-slate-50"><td class="py-2 px-3">${st?.name || '—'}</td><td class="py-2 px-3">${f.type}</td><td class="py-2 px-3">${f.month}</td><td class="py-2 px-3 text-right font-medium">${Utils.formatCurrency(f.amount)}</td></tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  },

  studentDashboard() {
    const session = Auth.getSession();
    const db = DB.get();
    const student = getStudent(session.studentId);
    if (!student) return emptyState('fa-user', 'Student profile not found');
    const myFees = db.fees.filter(f => f.studentId === student.id);
    const pending = myFees.filter(f => f.status === 'pending').reduce((s,f) => s + f.amount, 0);
    const myAtt = db.attendance.filter(a => a.studentId === student.id);
    const present = myAtt.filter(a => a.status === 'present').length;
    const attPct = myAtt.length ? ((present / myAtt.length) * 100).toFixed(0) : 0;
    const myResults = db.results.filter(r => r.studentId === student.id && r.examId === 1);
    const totalObt = myResults.reduce((s,r) => s + r.obtained, 0);
    const totalMax = myResults.reduce((s,r) => s + r.maxMarks, 0);
    const pct = totalMax ? ((totalObt / totalMax) * 100).toFixed(1) : 0;

    return `
      <div class="page-enter">
        ${pageHeader('Student Dashboard')}
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white mb-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">${student.name.charAt(0)}</div>
            <div>
              <h3 class="text-xl font-bold">${student.name}</h3>
              <p class="text-blue-100">${student.regNo} • ${getClassName(student.classId)}-${student.section}</p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-xl p-5 shadow-sm border text-center">
            <p class="text-xs text-slate-500 uppercase">Attendance</p>
            <p class="text-3xl font-bold text-green-600 mt-1">${attPct}%</p>
          </div>
          <div class="bg-white rounded-xl p-5 shadow-sm border text-center">
            <p class="text-xs text-slate-500 uppercase">Pending Fees</p>
            <p class="text-3xl font-bold text-amber-600 mt-1">${Utils.formatCurrency(pending)}</p>
          </div>
          <div class="bg-white rounded-xl p-5 shadow-sm border text-center">
            <p class="text-xs text-slate-500 uppercase">Last Exam %</p>
            <p class="text-3xl font-bold text-blue-600 mt-1">${pct}%</p>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm border p-5">
            <h3 class="font-semibold mb-3">Recent Notices</h3>
            ${db.notices.slice(0,4).map(n => `<div class="mb-2 pb-2 border-b last:border-0"><p class="text-sm font-medium">${n.title}</p><p class="text-xs text-slate-400">${Utils.formatDate(n.date)}</p></div>`).join('')}
          </div>
          <div class="bg-white rounded-xl shadow-sm border p-5">
            <h3 class="font-semibold mb-3">Homework</h3>
            ${db.homework.filter(h => h.classId === student.classId).map(h => `<div class="mb-2 pb-2 border-b last:border-0"><p class="text-sm font-medium">${h.subject}: ${h.title}</p><p class="text-xs text-slate-400">Due: ${Utils.formatDate(h.dueDate)}</p></div>`).join('') || '<p class="text-slate-400 text-sm">No homework</p>'}
          </div>
        </div>
      </div>`;
  },

  parentDashboard() {
    const session = Auth.getSession();
    const db = DB.get();
    const children = (session.studentIds || []).map(id => getStudent(id)).filter(Boolean);
    return `
      <div class="page-enter">
        ${pageHeader('Parent Portal')}
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white mb-6">
          <h3 class="text-xl font-bold">Welcome, ${session.name}</h3>
          <p class="text-blue-100 mt-1">You have ${children.length} child(ren) enrolled</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          ${children.map(c => {
            const pending = db.fees.filter(f => f.studentId === c.id && f.status === 'pending').reduce((s,f) => s + f.amount, 0);
            const att = db.attendance.filter(a => a.studentId === c.id);
            const pct = att.length ? ((att.filter(a => a.status === 'present').length / att.length) * 100).toFixed(0) : 0;
            return `
              <div class="bg-white rounded-xl shadow-sm border p-5">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">${c.name.charAt(0)}</div>
                  <div>
                    <p class="font-semibold">${c.name}</p>
                    <p class="text-xs text-slate-500">${c.regNo} • ${getClassName(c.classId)}-${c.section}</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div class="bg-slate-50 rounded-lg p-3 text-center">
                    <p class="text-xs text-slate-500">Attendance</p>
                    <p class="font-bold text-green-600">${pct}%</p>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-3 text-center">
                    <p class="text-xs text-slate-500">Pending Fee</p>
                    <p class="font-bold text-amber-600">${Utils.formatCurrency(pending)}</p>
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <h3 class="font-semibold mb-3">School Notices</h3>
          ${db.notices.slice(0,5).map(n => `<div class="mb-2 pb-2 border-b last:border-0"><p class="text-sm font-medium">${n.title}</p><p class="text-xs text-slate-400">${Utils.formatDate(n.date)} • ${n.category}</p></div>`).join('')}
        </div>
      </div>`;
  }
};
