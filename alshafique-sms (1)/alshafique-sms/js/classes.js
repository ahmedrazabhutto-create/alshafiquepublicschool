// Classes & Sections

const Classes = {
  render() {
    const db = DB.get();
    return `
      <div class="page-enter">
        ${pageHeader('Classes & Sections')}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${db.classes.map(c => {
            const studentCount = db.students.filter(s => s.classId === c.id && s.status === 'active').length;
            return `
              <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition">
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <i class="fas fa-school text-blue-600"></i>
                  </div>
                  <span class="text-xs font-medium text-slate-500">${studentCount} students</span>
                </div>
                <h3 class="font-bold text-slate-800">${c.name}</h3>
                <p class="text-sm text-slate-500 mt-1">Sections: ${c.sections.join(', ')}</p>
                <div class="mt-3 flex flex-wrap gap-1">
                  ${c.sections.map(sec => {
                    const cnt = db.students.filter(s => s.classId === c.id && s.section === sec).length;
                    return `<span class="px-2 py-0.5 bg-slate-100 rounded text-xs">${sec} (${cnt})</span>`;
                  }).join('')}
                </div>
              </div>`;
          }).join('')}
        </div>

        <div class="mt-8">
          <h3 class="font-semibold text-lg mb-4">Subjects</h3>
          <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div class="table-wrap">
              <table class="w-full data-table text-sm">
                <thead><tr class="border-b"><th class="py-3 px-4 text-left">Code</th><th class="py-3 px-4 text-left">Subject Name</th></tr></thead>
                <tbody>
                  ${db.subjects.map(s => `<tr class="border-b border-slate-50"><td class="py-2 px-4 font-medium text-blue-700">${s.code}</td><td class="py-2 px-4">${s.name}</td></tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;
  }
};
