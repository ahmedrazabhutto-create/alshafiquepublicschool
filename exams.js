// Exams & Results

const Exams = {
  render() {
    const session = Auth.getSession();
    if (session.role === 'student' || session.role === 'parent') return this.studentResults();

    const db = DB.get();
    return `
      <div class="page-enter">
        ${pageHeader('Exams & Results')}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          ${db.exams.map(e => `
            <div class="bg-white rounded-xl shadow-sm border p-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs px-2 py-0.5 rounded-full ${e.status==='completed'?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'} capitalize">${e.status}</span>
                <span class="text-xs text-slate-400">${e.type}</span>
              </div>
              <h3 class="font-semibold">${e.name}</h3>
              <p class="text-sm text-slate-500 mt-1">${Utils.formatDate(e.startDate)} – ${Utils.formatDate(e.endDate)}</p>
            </div>
          `).join('')}
        </div>

        <div class="bg-white rounded-xl shadow-sm border p-4 mb-4">
          <div class="flex flex-wrap gap-3 items-center">
            <select id="result-exam" class="px-3 py-2 border rounded-lg text-sm" onchange="Exams.loadResults()">
              ${db.exams.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
            </select>
            <select id="result-class" class="px-3 py-2 border rounded-lg text-sm" onchange="Exams.loadResults()">
              <option value="">All Classes</option>
              ${db.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
            ${['admin','principal','teacher'].includes(session.role) ? `
              <button onclick="Exams.showMarksEntry()" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm ml-auto">
                <i class="fas fa-edit mr-1"></i> Enter Marks
              </button>` : ''}
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div class="table-wrap">
            <table class="w-full data-table text-sm" id="results-table">
              <thead>
                <tr class="border-b">
                  <th class="py-3 px-4 text-left">Student</th>
                  <th class="py-3 px-4 text-left">Class</th>
                  <th class="py-3 px-4 text-center">Total</th>
                  <th class="py-3 px-4 text-center">%</th>
                  <th class="py-3 px-4 text-center">Grade</th>
                  <th class="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody id="results-tbody">${this.renderResultSummary(1)}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  },

  renderResultSummary(examId, classId) {
    const db = DB.get();
    const students = db.students.filter(s => s.status === 'active' && (!classId || s.classId == classId));
    const rows = students.map(s => {
      const marks = db.results.filter(r => r.examId == examId && r.studentId === s.id);
      if (!marks.length) return null;
      const totalObt = marks.reduce((a,r) => a + r.obtained, 0);
      const totalMax = marks.reduce((a,r) => a + r.maxMarks, 0);
      const pct = totalMax ? ((totalObt / totalMax) * 100).toFixed(1) : 0;
      const grade = Utils.calcGrade(parseFloat(pct));
      return { s, totalObt, totalMax, pct, grade };
    }).filter(Boolean).sort((a,b) => b.pct - a.pct);

    if (!rows.length) return `<tr><td colspan="6" class="py-10 text-center text-slate-400">No results found</td></tr>`;

    return rows.map((r, i) => `
      <tr class="border-b border-slate-50">
        <td class="py-2 px-4">
          <span class="text-xs text-slate-400 mr-2">#${i+1}</span>
          ${r.s.name}
        </td>
        <td class="py-2 px-4">${getClassName(r.s.classId)}-${r.s.section}</td>
        <td class="py-2 px-4 text-center">${r.totalObt}/${r.totalMax}</td>
        <td class="py-2 px-4 text-center font-medium">${r.pct}%</td>
        <td class="py-2 px-4 text-center ${Utils.gradeColor(r.grade)}">${r.grade}</td>
        <td class="py-2 px-4 text-center">
          <button onclick="Exams.viewReportCard(${r.s.id}, ${examId})" class="text-blue-600 hover:underline text-xs">Report Card</button>
        </td>
      </tr>
    `).join('');
  },

  loadResults() {
    const examId = document.getElementById('result-exam')?.value || 1;
    const classId = document.getElementById('result-class')?.value;
    document.getElementById('results-tbody').innerHTML = this.renderResultSummary(examId, classId);
  },

  studentResults() {
    const session = Auth.getSession();
    const db = DB.get();
    const ids = session.role === 'student' ? [session.studentId] : (session.studentIds || []);
    return `
      <div class="page-enter">
        ${pageHeader('My Results')}
        ${ids.map(sid => {
          const s = getStudent(sid);
          const marks = db.results.filter(r => r.studentId === sid && r.examId === 1);
          const totalObt = marks.reduce((a,r) => a + r.obtained, 0);
          const totalMax = marks.reduce((a,r) => a + r.maxMarks, 0);
          const pct = totalMax ? ((totalObt/totalMax)*100).toFixed(1) : 0;
          return `
            <div class="bg-white rounded-xl shadow-sm border p-5 mb-4">
              <h3 class="font-semibold mb-3">${s?.name} — First Term Examination</h3>
              <div class="table-wrap">
                <table class="w-full text-sm">
                  <thead><tr class="border-b bg-slate-50"><th class="py-2 px-3 text-left">Subject</th><th class="py-2 px-3 text-center">Obtained</th><th class="py-2 px-3 text-center">Max</th><th class="py-2 px-3 text-center">Grade</th></tr></thead>
                  <tbody>
                    ${marks.map(m => `<tr class="border-b border-slate-50"><td class="py-2 px-3">${m.subject}</td><td class="py-2 px-3 text-center">${m.obtained}</td><td class="py-2 px-3 text-center">${m.maxMarks}</td><td class="py-2 px-3 text-center ${Utils.gradeColor(m.grade)}">${m.grade}</td></tr>`).join('')}
                    <tr class="font-bold bg-slate-50"><td class="py-2 px-3">Total</td><td class="py-2 px-3 text-center">${totalObt}</td><td class="py-2 px-3 text-center">${totalMax}</td><td class="py-2 px-3 text-center">${pct}%</td></tr>
                  </tbody>
                </table>
              </div>
              <button onclick="Exams.viewReportCard(${sid}, 1)" class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"><i class="fas fa-print mr-1"></i> Print Report Card</button>
            </div>`;
        }).join('')}
      </div>`;
  },

  viewReportCard(studentId, examId) {
    const db = DB.get();
    const s = getStudent(studentId);
    const exam = db.exams.find(e => e.id == examId);
    const marks = db.results.filter(r => r.studentId === studentId && r.examId == examId);
    const totalObt = marks.reduce((a,r) => a + r.obtained, 0);
    const totalMax = marks.reduce((a,r) => a + r.maxMarks, 0);
    const pct = totalMax ? ((totalObt/totalMax)*100).toFixed(1) : 0;
    const grade = Utils.calcGrade(parseFloat(pct));
    const school = db.school;

    Utils.openModal(`
      <div class="p-6" id="report-card">
        <div class="text-center border-b-2 border-blue-800 pb-4 mb-4">
          <h2 class="text-xl font-bold text-blue-900">${school.name}</h2>
          <p class="text-sm text-slate-500">${school.address}</p>
          <h3 class="mt-2 font-semibold">REPORT CARD</h3>
          <p class="text-sm">${exam?.name || ''}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm mb-4">
          <div><strong>Name:</strong> ${s?.name}</div>
          <div><strong>Reg No:</strong> ${s?.regNo}</div>
          <div><strong>Class:</strong> ${getClassName(s?.classId)}-${s?.section}</div>
          <div><strong>Father:</strong> ${s?.fatherName}</div>
        </div>
        <table class="w-full text-sm border mb-4">
          <thead><tr class="bg-slate-100"><th class="border p-2 text-left">Subject</th><th class="border p-2 text-center">Max</th><th class="border p-2 text-center">Obtained</th><th class="border p-2 text-center">Grade</th></tr></thead>
          <tbody>
            ${marks.map(m => `<tr><td class="border p-2">${m.subject}</td><td class="border p-2 text-center">${m.maxMarks}</td><td class="border p-2 text-center">${m.obtained}</td><td class="border p-2 text-center">${m.grade}</td></tr>`).join('')}
            <tr class="font-bold"><td class="border p-2">Total</td><td class="border p-2 text-center">${totalMax}</td><td class="border p-2 text-center">${totalObt}</td><td class="border p-2 text-center">${grade} (${pct}%)</td></tr>
          </tbody>
        </table>
        <div class="flex justify-end gap-2 no-print">
          <button onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 rounded-lg text-sm">Close</button>
          <button onclick="Utils.printElement('#report-card')" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"><i class="fas fa-print mr-1"></i> Print</button>
        </div>
      </div>`);
  },

  showMarksEntry() {
    Utils.toast('Marks entry: Select exam & class from filters, then use individual student report for detailed entry. Demo data is pre-loaded.', 'info');
  }
};
