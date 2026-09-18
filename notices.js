// Notices & Homework

const Notices = {
  render() {
    const db = DB.get();
    const canPublish = ['admin', 'principal'].includes(Auth.getSession().role);
    return `
      <div class="page-enter">
        ${pageHeader('Notices & Announcements', canPublish ? `
          <button onclick="Notices.showForm()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            <i class="fas fa-plus mr-1"></i> Publish Notice
          </button>` : '')}
        <div class="space-y-4">
          ${db.notices.map(n => `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs px-2 py-0.5 rounded-full ${n.priority==='high'?'bg-red-100 text-red-700':'bg-slate-100 text-slate-600'}">${n.category}</span>
                    ${n.priority==='high' ? '<span class="text-xs text-red-500 font-medium">Important</span>' : ''}
                  </div>
                  <h3 class="font-semibold text-slate-800">${n.title}</h3>
                  <p class="text-sm text-slate-600 mt-2">${n.content}</p>
                  <p class="text-xs text-slate-400 mt-2">${Utils.formatDate(n.date)} • By ${n.publishedBy}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  },

  showForm() {
    Utils.openModal(`
      <div class="p-6">
        <h3 class="text-lg font-bold mb-4">Publish Notice</h3>
        <form onsubmit="Notices.publish(event)" class="space-y-3">
          <div>
            <label class="text-sm font-medium">Title *</label>
            <input name="title" required class="w-full px-3 py-2 border rounded-lg text-sm">
          </div>
          <div>
            <label class="text-sm font-medium">Content *</label>
            <textarea name="content" required rows="4" class="w-full px-3 py-2 border rounded-lg text-sm"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium">Category</label>
              <select name="category" class="w-full px-3 py-2 border rounded-lg text-sm">
                <option>General</option><option>Exam</option><option>Holiday</option><option>Event</option><option>Fee</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">Priority</label>
              <select name="priority" class="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="normal">Normal</option><option value="high">High</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 rounded-lg text-sm">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Publish</button>
          </div>
        </form>
      </div>`);
  },

  publish(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const db = DB.get();
    db.notices.unshift({
      id: Utils.generateId('notices'),
      ...data,
      date: Utils.today(),
      publishedBy: Auth.getSession().name
    });
    DB.set(db);
    Utils.toast('Notice published');
    Utils.closeModal();
    App.navigate('notices');
  }
};

const Homework = {
  render() {
    const session = Auth.getSession();
    const db = DB.get();
    const canAdd = ['admin', 'principal', 'teacher'].includes(session.role);
    let list = db.homework;
    if (session.role === 'student') {
      const s = getStudent(session.studentId);
      list = list.filter(h => h.classId === s?.classId);
    } else if (session.role === 'parent') {
      const classIds = (session.studentIds || []).map(id => getStudent(id)?.classId);
      list = list.filter(h => classIds.includes(h.classId));
    }

    return `
      <div class="page-enter">
        ${pageHeader('Homework', canAdd ? `
          <button onclick="Homework.showForm()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            <i class="fas fa-plus mr-1"></i> Assign Homework
          </button>` : '')}
        <div class="space-y-3">
          ${list.map(h => `
            <div class="bg-white rounded-xl shadow-sm border p-5">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">${h.subject}</span>
                  <h3 class="font-semibold mt-1">${h.title}</h3>
                  <p class="text-sm text-slate-600 mt-1">${h.description}</p>
                  <p class="text-xs text-slate-400 mt-2">
                    ${getClassName(h.classId)}-${h.section} • Due: ${Utils.formatDate(h.dueDate)} • By ${h.assignedBy}
                  </p>
                </div>
              </div>
            </div>
          `).join('') || emptyState('fa-book', 'No homework assigned')}
        </div>
      </div>`;
  },

  showForm() {
    const db = DB.get();
    Utils.openModal(`
      <div class="p-6">
        <h3 class="text-lg font-bold mb-4">Assign Homework</h3>
        <form onsubmit="Homework.save(event)" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium">Class</label>
              <select name="classId" class="w-full px-3 py-2 border rounded-lg text-sm">
                ${db.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">Section</label>
              <select name="section" class="w-full px-3 py-2 border rounded-lg text-sm">
                <option>A</option><option>B</option><option>C</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">Subject</label>
              <input name="subject" required class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div>
              <label class="text-sm font-medium">Due Date</label>
              <input type="date" name="dueDate" required class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
          </div>
          <div>
            <label class="text-sm font-medium">Title</label>
            <input name="title" required class="w-full px-3 py-2 border rounded-lg text-sm">
          </div>
          <div>
            <label class="text-sm font-medium">Description</label>
            <textarea name="description" rows="3" class="w-full px-3 py-2 border rounded-lg text-sm"></textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 rounded-lg text-sm">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Assign</button>
          </div>
        </form>
      </div>`);
  },

  save(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.classId = parseInt(data.classId);
    const db = DB.get();
    db.homework.unshift({
      id: Utils.generateId('homework'),
      ...data,
      assignedBy: Auth.getSession().name,
      date: Utils.today()
    });
    DB.set(db);
    Utils.toast('Homework assigned');
    Utils.closeModal();
    App.navigate('homework');
  }
};
