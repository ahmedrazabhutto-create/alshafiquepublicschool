// Admin Settings

const Settings = {
  render() {
    const db = DB.get();
    const school = db.school;
    return `
      <div class="page-enter">
        ${pageHeader('Settings')}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm border p-6">
            <h3 class="font-semibold mb-4 flex items-center gap-2"><i class="fas fa-school text-blue-500"></i> School Information</h3>
            <form onsubmit="Settings.saveSchool(event)" class="space-y-3">
              <div>
                <label class="text-sm font-medium">School Name</label>
                <input name="name" value="${school.name}" class="w-full px-3 py-2 border rounded-lg text-sm">
              </div>
              <div>
                <label class="text-sm font-medium">Address</label>
                <input name="address" value="${school.address}" class="w-full px-3 py-2 border rounded-lg text-sm">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-sm font-medium">Phone</label>
                  <input name="phone" value="${school.phone}" class="w-full px-3 py-2 border rounded-lg text-sm">
                </div>
                <div>
                  <label class="text-sm font-medium">Email</label>
                  <input name="email" value="${school.email}" class="w-full px-3 py-2 border rounded-lg text-sm">
                </div>
              </div>
              <div>
                <label class="text-sm font-medium">Academic Year</label>
                <input name="academicYear" value="${school.academicYear}" class="w-full px-3 py-2 border rounded-lg text-sm">
              </div>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save Changes</button>
            </form>
          </div>

          <div class="bg-white rounded-xl shadow-sm border p-6">
            <h3 class="font-semibold mb-4 flex items-center gap-2"><i class="fas fa-users-cog text-blue-500"></i> User Accounts</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              ${db.users.map(u => `
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm">
                  <div>
                    <span class="font-medium">${u.name}</span>
                    <span class="text-xs text-slate-400 ml-2">@${u.username}</span>
                  </div>
                  <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded capitalize">${u.role}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border p-6">
            <h3 class="font-semibold mb-4 flex items-center gap-2"><i class="fas fa-database text-blue-500"></i> Data Management</h3>
            <p class="text-sm text-slate-500 mb-4">Reset all data to original demo dataset. This cannot be undone.</p>
            <button onclick="Settings.resetData()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">
              <i class="fas fa-trash-restore mr-1"></i> Reset to Demo Data
            </button>
          </div>

          <div class="bg-white rounded-xl shadow-sm border p-6">
            <h3 class="font-semibold mb-4 flex items-center gap-2"><i class="fas fa-info-circle text-blue-500"></i> About</h3>
            <p class="text-sm text-slate-600">Alshafique Public School Kamber</p>
            <p class="text-sm text-slate-500 mt-1">School Management System v1.0</p>
            <p class="text-xs text-slate-400 mt-3">Built with modern web technologies. Data is stored locally in your browser.</p>
          </div>
        </div>
      </div>`;
  },

  saveSchool(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const db = DB.get();
    db.school = { ...db.school, ...data };
    DB.set(db);
    Utils.toast('School settings saved');
  },

  resetData() {
    if (!Utils.confirm('Reset all data to demo defaults? All changes will be lost.')) return;
    DB.reset();
    Utils.toast('Data reset to demo defaults');
    App.navigate('settings');
  }
};

// Profile page for student/parent
const Profile = {
  render() {
    const session = Auth.getSession();
    const db = DB.get();
    if (session.role === 'student') {
      const s = getStudent(session.studentId);
      if (!s) return emptyState('fa-user', 'Profile not found');
      return `
        <div class="page-enter">
          ${pageHeader('My Profile')}
          <div class="bg-white rounded-xl shadow-sm border p-6 max-w-2xl">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">${s.name.charAt(0)}</div>
              <div>
                <h3 class="text-xl font-bold">${s.name}</h3>
                <p class="text-slate-500">${s.regNo}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><span class="text-slate-500">Father:</span> <strong>${s.fatherName}</strong></div>
              <div><span class="text-slate-500">Gender:</span> <strong>${s.gender}</strong></div>
              <div><span class="text-slate-500">DOB:</span> <strong>${Utils.formatDate(s.dob)}</strong></div>
              <div><span class="text-slate-500">Class:</span> <strong>${getClassName(s.classId)}-${s.section}</strong></div>
              <div><span class="text-slate-500">Admission:</span> <strong>${Utils.formatDate(s.admissionDate)}</strong></div>
              <div><span class="text-slate-500">Phone:</span> <strong>${s.phone}</strong></div>
              <div class="col-span-2"><span class="text-slate-500">Address:</span> <strong>${s.address}</strong></div>
            </div>
          </div>
        </div>`;
    }
    if (session.role === 'parent') {
      const children = (session.studentIds || []).map(id => getStudent(id)).filter(Boolean);
      return `
        <div class="page-enter">
          ${pageHeader('Children Profiles')}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${children.map(s => `
              <div class="bg-white rounded-xl shadow-sm border p-5">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">${s.name.charAt(0)}</div>
                  <div>
                    <h3 class="font-semibold">${s.name}</h3>
                    <p class="text-xs text-slate-500">${s.regNo} • ${getClassName(s.classId)}-${s.section}</p>
                  </div>
                </div>
                <div class="text-sm space-y-1">
                  <p><span class="text-slate-500">Father:</span> ${s.fatherName}</p>
                  <p><span class="text-slate-500">DOB:</span> ${Utils.formatDate(s.dob)}</p>
                  <p><span class="text-slate-500">Phone:</span> ${s.phone}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }
    return emptyState('fa-user', 'Profile');
  }
};
