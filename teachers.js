// Teachers & Staff Management

const Teachers = {
  render() {
    const db = DB.get();
    const canEdit = ['admin', 'principal'].includes(Auth.getSession().role);
    return `
      <div class="page-enter">
        ${pageHeader('Teachers & Staff', canEdit ? `
          <button onclick="Teachers.showAddForm()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <i class="fas fa-plus"></i> Add Teacher
          </button>` : '')}
        
        <div class="mb-4">
          <div class="flex gap-2 border-b border-slate-200">
            <button onclick="Teachers.showTab('teachers')" id="tab-teachers" class="px-4 py-2 text-sm font-medium border-b-2 border-blue-600 text-blue-600">Teachers (${db.teachers.length})</button>
            <button onclick="Teachers.showTab('staff')" id="tab-staff" class="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-700">Staff (${db.staff.length})</button>
          </div>
        </div>

        <div id="teachers-content">
          <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div class="table-wrap">
              <table class="w-full data-table text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="py-3 px-4 text-left">Emp ID</th>
                    <th class="py-3 px-4 text-left">Name</th>
                    <th class="py-3 px-4 text-left">Subject</th>
                    <th class="py-3 px-4 text-left">Qualification</th>
                    <th class="py-3 px-4 text-left">Phone</th>
                    <th class="py-3 px-4 text-left">Status</th>
                    <th class="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${db.teachers.map(t => `
                    <tr class="border-b border-slate-50">
                      <td class="py-3 px-4 font-medium text-blue-700">${t.empId}</td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                          <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">${t.name.charAt(0)}</div>
                          ${t.name}
                        </div>
                      </td>
                      <td class="py-3 px-4">${t.subject}</td>
                      <td class="py-3 px-4">${t.qualification}</td>
                      <td class="py-3 px-4">${t.phone}</td>
                      <td class="py-3 px-4">${Utils.badge(t.status)}</td>
                      <td class="py-3 px-4 text-center">
                        <button onclick="Teachers.view(${t.id})" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><i class="fas fa-eye"></i></button>
                        ${canEdit ? `<button onclick="Teachers.edit(${t.id})" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><i class="fas fa-edit"></i></button>` : ''}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="staff-content" class="hidden">
          <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div class="table-wrap">
              <table class="w-full data-table text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="py-3 px-4 text-left">Emp ID</th>
                    <th class="py-3 px-4 text-left">Name</th>
                    <th class="py-3 px-4 text-left">Role</th>
                    <th class="py-3 px-4 text-left">Phone</th>
                    <th class="py-3 px-4 text-left">Joining</th>
                    <th class="py-3 px-4 text-left">Salary</th>
                    <th class="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${db.staff.map(s => `
                    <tr class="border-b border-slate-50">
                      <td class="py-3 px-4 font-medium">${s.empId}</td>
                      <td class="py-3 px-4">${s.name}</td>
                      <td class="py-3 px-4">${s.role}</td>
                      <td class="py-3 px-4">${s.phone}</td>
                      <td class="py-3 px-4">${Utils.formatDate(s.joiningDate)}</td>
                      <td class="py-3 px-4">${Utils.formatCurrency(s.salary)}</td>
                      <td class="py-3 px-4">${Utils.badge(s.status)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;
  },

  showTab(tab) {
    document.getElementById('teachers-content').classList.toggle('hidden', tab !== 'teachers');
    document.getElementById('staff-content').classList.toggle('hidden', tab !== 'staff');
    document.getElementById('tab-teachers').classList.toggle('border-blue-600', tab === 'teachers');
    document.getElementById('tab-teachers').classList.toggle('text-blue-600', tab === 'teachers');
    document.getElementById('tab-staff').classList.toggle('border-blue-600', tab === 'staff');
    document.getElementById('tab-staff').classList.toggle('text-blue-600', tab === 'staff');
  },

  view(id) {
    const t = getTeacher(id);
    if (!t) return;
    Utils.openModal(`
      <div class="p-6">
        <div class="flex justify-between mb-6">
          <h3 class="text-lg font-bold">Teacher Profile</h3>
          <button onclick="Utils.closeModal()"><i class="fas fa-times text-slate-400"></i></button>
        </div>
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">${t.name.charAt(0)}</div>
          <div>
            <h4 class="text-xl font-bold">${t.name}</h4>
            <p class="text-slate-500">${t.empId} • ${t.subject}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div><span class="text-slate-500">Email:</span> ${t.email}</div>
          <div><span class="text-slate-500">Phone:</span> ${t.phone}</div>
          <div><span class="text-slate-500">Qualification:</span> ${t.qualification}</div>
          <div><span class="text-slate-500">Joining:</span> ${Utils.formatDate(t.joiningDate)}</div>
          <div><span class="text-slate-500">Salary:</span> ${Utils.formatCurrency(t.salary)}</div>
          <div><span class="text-slate-500">Address:</span> ${t.address}</div>
          <div class="col-span-2"><span class="text-slate-500">Classes:</span> ${(t.classes||[]).join(', ')}</div>
        </div>
        <div class="mt-6 text-right"><button onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 rounded-lg text-sm">Close</button></div>
      </div>`);
  },

  showAddForm(t = null) {
    Utils.openModal(`
      <div class="p-6">
        <h3 class="text-lg font-bold mb-4">${t ? 'Edit' : 'Add'} Teacher</h3>
        <form onsubmit="Teachers.save(event, ${t?.id || 'null'})" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div><label class="text-sm font-medium">Name *</label><input name="name" required value="${t?.name||''}" class="w-full px-3 py-2 border rounded-lg text-sm"></div>
            <div><label class="text-sm font-medium">Subject *</label><input name="subject" required value="${t?.subject||''}" class="w-full px-3 py-2 border rounded-lg text-sm"></div>
            <div><label class="text-sm font-medium">Email</label><input name="email" value="${t?.email||''}" class="w-full px-3 py-2 border rounded-lg text-sm"></div>
            <div><label class="text-sm font-medium">Phone *</label><input name="phone" required value="${t?.phone||''}" class="w-full px-3 py-2 border rounded-lg text-sm"></div>
            <div><label class="text-sm font-medium">Qualification</label><input name="qualification" value="${t?.qualification||''}" class="w-full px-3 py-2 border rounded-lg text-sm"></div>
            <div><label class="text-sm font-medium">Salary</label><input type="number" name="salary" value="${t?.salary||''}" class="w-full px-3 py-2 border rounded-lg text-sm"></div>
            <div><label class="text-sm font-medium">Joining Date</label><input type="date" name="joiningDate" value="${t?.joiningDate||Utils.today()}" class="w-full px-3 py-2 border rounded-lg text-sm"></div>
            <div><label class="text-sm font-medium">Address</label><input name="address" value="${t?.address||''}" class="w-full px-3 py-2 border rounded-lg text-sm"></div>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 rounded-lg text-sm">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save</button>
          </div>
        </form>
      </div>`);
  },

  edit(id) { this.showAddForm(getTeacher(id)); },

  save(e, id) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.salary = parseInt(data.salary) || 0;
    const db = DB.get();
    if (id) {
      const idx = db.teachers.findIndex(t => t.id === id);
      if (idx >= 0) db.teachers[idx] = { ...db.teachers[idx], ...data };
      Utils.toast('Teacher updated');
    } else {
      db.teachers.push({
        id: Utils.generateId('teachers'),
        empId: `TCH-${String(db.teachers.length + 1).padStart(3,'0')}`,
        ...data,
        classes: [],
        status: 'active'
      });
      Utils.toast('Teacher added');
    }
    DB.set(db);
    Utils.closeModal();
    App.navigate('teachers');
  }
};
