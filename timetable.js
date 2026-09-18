// Timetable Module

const Timetable = {
  render() {
    const db = DB.get();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = [1,2,3,4,5,6,7];
    const classId = 8; // Default Grade 8
    const section = 'A';

    return `
      <div class="page-enter">
        ${pageHeader('Timetable')}
        <div class="bg-white rounded-xl shadow-sm border p-4 mb-4">
          <div class="flex flex-wrap gap-3">
            <select id="tt-class" class="px-3 py-2 border rounded-lg text-sm" onchange="Timetable.load()">
              ${db.classes.map(c => `<option value="${c.id}" ${c.id===8?'selected':''}>${c.name}</option>`).join('')}
            </select>
            <select id="tt-section" class="px-3 py-2 border rounded-lg text-sm" onchange="Timetable.load()">
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div class="table-wrap">
            <table class="w-full text-sm" id="tt-table">
              <thead>
                <tr class="bg-blue-900 text-white">
                  <th class="py-3 px-2 text-left">Period</th>
                  ${days.map(d => `<th class="py-3 px-2 text-center">${d.slice(0,3)}</th>`).join('')}
                </tr>
              </thead>
              <tbody id="tt-body">
                ${this.renderTable(classId, section)}
              </tbody>
            </table>
          </div>
        </div>
        <p class="text-xs text-slate-400 mt-3">* Sample timetable shown for Grade 8-A. Periods: 08:00–13:00 with short break.</p>
      </div>`;
  },

  renderTable(classId, section) {
    const db = DB.get();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = [
      { no: 1, time: '08:00' },
      { no: 2, time: '08:40' },
      { no: 3, time: '09:20' },
      { no: 4, time: '10:20' },
      { no: 5, time: '11:00' },
      { no: 6, time: '11:40' },
      { no: 7, time: '12:20' }
    ];
    const tt = db.timetable.filter(t => t.classId == classId && t.section === section);

    return periods.map(p => `
      <tr class="border-b border-slate-100">
        <td class="py-2 px-2 font-medium text-slate-600 bg-slate-50">
          <div class="text-xs">${p.time}</div>
          <div class="text-[10px] text-slate-400">P${p.no}</div>
        </td>
        ${days.map(day => {
          const slot = tt.find(t => t.day === day && t.period === p.no);
          return `<td class="py-2 px-1 text-center">
            ${slot ? `<div class="bg-blue-50 rounded px-1 py-1.5">
              <div class="text-xs font-medium text-blue-800">${slot.subject}</div>
              <div class="text-[10px] text-slate-500">${slot.teacher.split(' ')[0]}</div>
            </div>` : '<span class="text-slate-300">—</span>'}
          </td>`;
        }).join('')}
      </tr>
    `).join('');
  },

  load() {
    const classId = document.getElementById('tt-class')?.value || 8;
    const section = document.getElementById('tt-section')?.value || 'A';
    document.getElementById('tt-body').innerHTML = this.renderTable(classId, section);
  }
};
