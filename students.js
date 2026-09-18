// Student Management Module

const Students = {
  render() {
    const session = Auth.getSession();
    const db = DB.get();
    let list = [...db.students];

    // Role restrictions
    if (session.role === 'teacher') {
      // Teachers see all for demo simplicity, or filter by assigned
      list = list;
    } else if (session.role === 'student') {
      list = list.filter(s => s.id === session.studentId);
    } else if (session.role === 'parent') {
      list = list.filter(s => (session.studentIds || []).includes(s.id));
    }

    const canEdit = ['admin', 'principal'].includes(session.role);

    return `
      <div class="page-enter">
        ${pageHeader('Student Management', canEdit ? `
          <button onclick="Students.showAddForm()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <i class="fas fa-plus"></i> Add Student
          </button>` : '')}
        
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" id="student-search" placeholder="Search by name, reg no, father..." 
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                oninput="Students.filter()">
            </div>
            <select id="student-class-filter" class="px-3 py-2 border border-slate-300 rounded-lg text-sm" onchange="Students.filter()">
              <option value="">All Classes</option>
              ${db.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
            <select id="student-status-filter" class="px-3 py-2 border border-slate-300 rounded-lg text-sm" onchange="Students.filter()">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="table-wrap">
            <table class="w-full data-table text-sm" id="students-table">
              <thead>
                <tr class="border-b border-slate-200">
                  <th class="py-3 px-4 text-left">Reg No</th>
                  <th class="py-3 px-4 text-left">Name</th>
                  <th class="py-3 px-4 text-left">Father Name</th>
                  <th class="py-3 px-4 text-left">Class</th>
                  <th class="py-3 px-4 text-left">Contact</th>
                  <th class="py-3 px-4 text-left">Status</th>
                  <th class="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody id="students-tbody">
                ${this.renderRows(list)}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  },

  renderRows(list) {
    if (!list.length) return `<tr><td colspan="7" class="py-12 text-center text-slate-400">No students found</td></tr>`;
    const canEdit = ['admin', 'principal'].includes(Auth.getSession().role);
    return list.map(s => `
      <tr class="border-b border-slate-50 hover:bg-slate-50">
        <td class="py-3 px-4 font-medium text-blue-700">${s.regNo}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">${s.name.charAt(0)}</div>
            <span>${s.name}</span>
          </div>
        </td>
        <td class="py-3 px-4">${s.fatherName}</td>
        <td class="py-3 px-4">${getClassName(s.classId)}-${s.section}</td>
        <td class="py-3 px-4">${s.phone}</td>
        <td class="py-3 px-4">${Utils.badge(s.status)}</td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-1">
            <button onclick="Students.view(${s.id})" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View"><i class="fas fa-eye"></i></button>
            ${canEdit ? `
              <button onclick="Students.edit(${s.id})" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Edit"><i class="fas fa-edit"></i></button>
              <button onclick="Students.remove(${s.id})" class="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><i class="fas fa-trash"></i></button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  },

  filter() {
    const db = DB.get();
    const q = (document.getElementById('student-search')?.value || '').toLowerCase();
    const classId = document.getElementById('student-class-filter')?.value;
    const status = document.getElementById('student-status-filter')?.value;
    let list = db.students.filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.regNo.toLowerCase().includes(q) || s.fatherName.toLowerCase().includes(q);
      const matchC = !classId || s.classId == classId;
      const matchS = !status || s.status === status;
      return matchQ && matchC && matchS;
    });
    document.getElementById('students-tbody').innerHTML = this.renderRows(list);
  },

  view(id) {
    const s = getStudent(id);
    if (!s) return;
    Utils.openModal(`
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold">Student Profile</h3>
          <button onclick="Utils.closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
        </div>
        <div class="flex items-center gap-4 mb-6">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">${s.name.charAt(0)}</div>
          <div>
            <h4 class="text-xl font-bold">${s.name}</h4>
            <p class="text-slate-500">${s.regNo}</p>
            ${Utils.badge(s.status)}
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><span class="text-slate-500">Father/Guardian:</span> <span class="font-medium">${s.fatherName}</span></div>
          <div><span class="text-slate-500">Gender:</span> <span class="font-medium">${s.gender}</span></div>
          <div><span class="text-slate-500">Date of Birth:</span> <span class="font-medium">${Utils.formatDate(s.dob)}</span></div>
          <div><span class="text-slate-500">Class:</span> <span class="font-medium">${getClassName(s.classId)} - ${s.section}</span></div>
          <div><span class="text-slate-500">Admission Date:</span> <span class="font-medium">${Utils.formatDate(s.admissionDate)}</span></div>
          <div><span class="text-slate-500">Previous School:</span> <span class="font-medium">${s.previousSchool || '—'}</span></div>
          <div><span class="text-slate-500">Contact:</span> <span class="font-medium">${s.phone}</span></div>
          <div><span class="text-slate-500">Address:</span> <span class="font-medium">${s.address}</span></div>
        </div>
        <div class="mt-6 flex justify-end">
          <button onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm">Close</button>
        </div>
      </div>`);
  },

  showAddForm(student = null) {
    const db = DB.get();
    const isEdit = !!student;
    Utils.openModal(`
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold">${isEdit ? 'Edit Student' : 'Add New Student'}</h3>
          <button onclick="Utils.closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
        </div>
        <form id="student-form" class="space-y-4" onsubmit="Students.save(event, ${student?.id || 'null'})">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Full Name *</label>
              <input name="name" required value="${student?.name || ''}" class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Father / Guardian Name *</label>
              <input name="fatherName" required value="${student?.fatherName || ''}" class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Gender *</label>
              <select name="gender" required class="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="Male" ${student?.gender==='Male'?'selected':''}>Male</option>
                <option value="Female" ${student?.gender==='Female'?'selected':''}>Female</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Date of Birth *</label>
              <input type="date" name="dob" required value="${student?.dob || ''}" class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Class *</label>
              <select name="classId" required class="w-full px-3 py-2 border rounded-lg text-sm">
                ${db.classes.map(c => `<option value="${c.id}" ${student?.classId==c.id?'selected':''}>${c.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Section *</label>
              <select name="section" required class="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="A" ${student?.section==='A'?'selected':''}>A</option>
                <option value="B" ${student?.section==='B'?'selected':''}>B</option>
                <option value="C" ${student?.section==='C'?'selected':''}>C</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Contact Number *</label>
              <input name="phone" required value="${student?.phone || ''}" class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Admission Date *</label>
              <input type="date" name="admissionDate" required value="${student?.admissionDate || Utils.today()}" class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium mb-1">Address</label>
              <input name="address" value="${student?.address || ''}" class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Previous School</label>
              <input name="previousSchool" value="${student?.previousSchool || ''}" class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status</label>
              <select name="status" class="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="active" ${!student || student.status==='active'?'selected':''}>Active</option>
                <option value="inactive" ${student?.status==='inactive'?'selected':''}>Inactive</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 rounded-lg text-sm">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">${isEdit ? 'Update' : 'Add Student'}</button>
          </div>
        </form>
      </div>`);
  },

  edit(id) {
    const s = getStudent(id);
    if (s) this.showAddForm(s);
  },

  save(e, id) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    data.classId = parseInt(data.classId);
    const db = DB.get();
    if (id) {
      const idx = db.students.findIndex(s => s.id === id);
      if (idx >= 0) {
        db.students[idx] = { ...db.students[idx], ...data };
        Utils.toast('Student updated successfully');
      }
    } else {
      const year = new Date().getFullYear();
      const regNo = `APS-${year}-${String(db.students.length + 1).padStart(3, '0')}`;
      db.students.push({
        id: Utils.generateId('students'),
        regNo,
        ...data,
        photo: null
      });
      Utils.toast('Student added successfully');
    }
    DB.set(db);
    Utils.closeModal();
    App.navigate('students');
  },

  remove(id) {
    if (!Utils.confirm('Are you sure you want to delete this student?')) return;
    const db = DB.get();
    db.students = db.students.filter(s => s.id !== id);
    DB.set(db);
    Utils.toast('Student deleted', 'warning');
    App.navigate('students');
  }
};
