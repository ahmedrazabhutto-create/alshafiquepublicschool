// Attendance System

const Attendance = {
  render() {
    const session = Auth.getSession();
    const db = DB.get();
    const canMark = ['admin', 'principal', 'teacher'].includes(session.role);

    if (session.role === 'student' || session.role === 'parent') {
      return this.studentView();
    }

    return `
      <div class="page-enter">
        ${pageHeader('Attendance Management', canMark ? `
          <button onclick="Attendance.showMarkForm()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            <i class="fas fa-check-circle mr-1"></i> Mark Attendance
          </button>` : '')}

        <div class="bg-white rounded-xl shadow-sm border p-4 mb-4">
          <div class="flex flex-wrap gap-3">
            <input type="date" id="att-date" value="${Utils.today()}" class="px-3 py-2 border rounded-lg text-sm" onchange="Attendance.loadHistory()">
            <select id="att-class" class="px-3 py-2 border rounded-lg text-sm" onchange="Attendance.loadHistory()">
              <option value="">All Classes</option>
              ${db.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div class="table-wrap">
            <table class="w-full data-table text-sm">
              <thead>
                <tr class="border-b">
                  <th class="py-3 px-4 text-left">Student</th>
                  <th class="py-3 px-4 text-left">Class</th>
                  <th class="py-3 px-4 text-left">Date</th>
                  <th class="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody id="att-tbody">
                ${this.renderHistoryRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  },

  renderHistoryRows(filterDate, filterClass) {
    const db = DB.get();
    let records = [...db.attendance].sort((a,b) => b.date.localeCompare(a.date));
    if (filterDate) records = records.filter(r => r.date === filterDate);
    if (filterClass) records = records.filter(r => {
      const s = getStudent(r.studentId);
      return s && s.classId == filterClass;
    });
    records = records.slice(0, 50);
    if (!records.length) return `<tr><td colspan="4" class="py-10 text-center text-slate-400">No records</td></tr>`;
    return records.map(r => {
      const s = getStudent(r.studentId);
      return `<tr class="border-b border-slate-50">
        <td class="py-2 px-4">${s?.name || '—'}</td>
        <td class="py-2 px-4">${s ? getClassName(s.classId)+'-'+s.section : '—'}</td>
        <td class="py-2 px-4">${Utils.formatDate(r.date)}</td>
        <td class="py-2 px-4">${Utils.badge(r.status)}</td>
      </tr>`;
    }).join('');
  },

  loadHistory() {
    const date = document.getElementById('att-date')?.value;
    const cls = document.getElementById('att-class')?.value;
    document.getElementById('att-tbody').innerHTML = this.renderHistoryRows(date, cls);
  },

  studentView() {
    const session = Auth.getSession();
    const db = DB.get();
    let studentIds = session.role === 'student' ? [session.studentId] : (session.studentIds || []);
    const records = db.attendance.filter(a => studentIds.includes(a.studentId)).sort((a,b) => b.date.localeCompare(a.date)).slice(0, 40);
    return `
      <div class="page-enter">
        ${pageHeader('My Attendance')}
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div class="table-wrap">
            <table class="w-full data-table text-sm">
              <thead><tr class="border-b"><th class="py-3 px-4 text-left">Date</th><th class="py-3 px-4 text-left">Student</th><th class="py-3 px-4 text-left">Status</th></tr></thead>
              <tbody>
                ${records.map(r => {
                  const s = getStudent(r.studentId);
                  return `<tr class="border-b border-slate-50"><td class="py-2 px-4">${Utils.formatDate(r.date)}</td><td class="py-2 px-4">${s?.name}</td><td class="py-2 px-4">${Utils.badge(r.status)}</td></tr>`;
                }).join('') || '<tr><td colspan="3" class="py-10 text-center text-slate-400">No records</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  },

  showMarkForm() {
    const db = DB.get();
    Utils.openModal(`
      <div class="p-6">
        <h3 class="text-lg font-bold mb-4">Mark Attendance</h3>
        <div class="flex gap-3 mb-4">
          <input type="date" id="mark-date" value="${Utils.today()}" class="px-3 py-2 border rounded-lg text-sm">
          <select id="mark-class" class="px-3 py-2 border rounded-lg text-sm" onchange="Attendance.loadStudentsForMark()">
            <option value="">Select Class</option>
            ${db.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
          <select id="mark-section" class="px-3 py-2 border rounded-lg text-sm" onchange="Attendance.loadStudentsForMark()">
            <option value="A">A</option><option value="B">B</option><option value="C">C</option>
          </select>
        </div>
        <div id="mark-students-list" class="max-h-80 overflow-y-auto space-y-2"></div>
        <div class="flex justify-end gap-2 mt-4">
          <button onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 rounded-lg text-sm">Cancel</button>
          <button onclick="Attendance.saveMarks()" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save Attendance</button>
        </div>
      </div>`);
  },

  loadStudentsForMark() {
    const classId = document.getElementById('mark-class')?.value;
    const section = document.getElementById('mark-section')?.value;
    if (!classId) return;
    const students = DB.get().students.filter(s => s.classId == classId && s.section === section && s.status === 'active');
    document.getElementById('mark-students-list').innerHTML = students.map(s => `
      <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <span class="text-sm font-medium">${s.name} (${s.regNo})</span>
        <select data-sid="${s.id}" class="att-status px-2 py-1 border rounded text-sm">
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="leave">Leave</option>
        </select>
      </div>
    `).join('') || '<p class="text-slate-400 text-sm">No students in this class/section</p>';
  },

  saveMarks() {
    const date = document.getElementById('mark-date').value;
    const selects = document.querySelectorAll('.att-status');
    if (!selects.length) { Utils.toast('No students selected', 'warning'); return; }
    const db = DB.get();
    selects.forEach(sel => {
      const sid = parseInt(sel.dataset.sid);
      // remove existing for same day
      db.attendance = db.attendance.filter(a => !(a.studentId === sid && a.date === date));
      db.attendance.push({
        id: Utils.generateId('attendance'),
        studentId: sid,
        date,
        status: sel.value,
        markedBy: Auth.getSession().username
      });
    });
    DB.set(db);
    Utils.toast('Attendance saved successfully');
    Utils.closeModal();
    App.navigate('attendance');
  }
};
