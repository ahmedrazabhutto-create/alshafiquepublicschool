// Reports Module

const Reports = {
  render() {
    return `
      <div class="page-enter">
        ${pageHeader('Reports')}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${this.reportCard('fa-user-graduate', 'Student List', 'Complete list of all enrolled students', 'students')}
          ${this.reportCard('fa-clipboard-check', 'Attendance Report', 'Monthly attendance summary', 'attendance')}
          ${this.reportCard('fa-money-bill-wave', 'Fee Collection Report', 'All paid fee records', 'fees-paid')}
          ${this.reportCard('fa-exclamation-circle', 'Pending Fee Report', 'Outstanding fee dues', 'fees-pending')}
          ${this.reportCard('fa-file-alt', 'Exam Results Report', 'Term examination results', 'results')}
          ${this.reportCard('fa-chalkboard-teacher', 'Teacher/Staff Report', 'Staff directory', 'teachers')}
          ${this.reportCard('fa-school', 'Class-wise Report', 'Students by class & section', 'classwise')}
        </div>
        <div id="report-output" class="mt-6"></div>
      </div>`;
  },

  reportCard(icon, title, desc, type) {
    return `
      <div class="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition cursor-pointer" onclick="Reports.generate('${type}')">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
          <i class="fas ${icon} text-blue-600 text-xl"></i>
        </div>
        <h3 class="font-semibold text-slate-800">${title}</h3>
        <p class="text-sm text-slate-500 mt-1">${desc}</p>
        <button class="mt-3 text-sm text-blue-600 font-medium">Generate →</button>
      </div>`;
  },

  generate(type) {
    const db = DB.get();
    let html = '';

    if (type === 'students') {
      html = this.tableReport('Student List', ['Reg No','Name','Father','Class','Phone','Status'],
        db.students.map(s => [s.regNo, s.name, s.fatherName, getClassName(s.classId)+'-'+s.section, s.phone, s.status]));
    } else if (type === 'fees-paid') {
      const paid = db.fees.filter(f => f.status === 'paid');
      html = this.tableReport('Fee Collection Report', ['Receipt','Student','Type','Month','Amount','Date'],
        paid.map(f => {
          const s = getStudent(f.studentId);
          return [f.receiptNo, s?.name, f.type, f.month+' '+f.year, Utils.formatCurrency(f.amount), Utils.formatDate(f.paidDate)];
        }));
    } else if (type === 'fees-pending') {
      const pending = db.fees.filter(f => f.status === 'pending');
      html = this.tableReport('Pending Fee Report', ['Student','Type','Month','Amount'],
        pending.map(f => {
          const s = getStudent(f.studentId);
          return [s?.name, f.type, f.month+' '+f.year, Utils.formatCurrency(f.amount)];
        }));
    } else if (type === 'teachers') {
      html = this.tableReport('Teachers & Staff', ['Emp ID','Name','Role/Subject','Phone','Status'],
        [...db.teachers.map(t => [t.empId, t.name, t.subject, t.phone, t.status]),
         ...db.staff.map(s => [s.empId, s.name, s.role, s.phone, s.status])]);
    } else if (type === 'classwise') {
      html = db.classes.map(c => {
        const sts = db.students.filter(s => s.classId === c.id);
        return `<h4 class="font-semibold mt-4 mb-2">${c.name} (${sts.length})</h4>
          <div class="table-wrap mb-4"><table class="w-full text-sm border"><thead><tr class="bg-slate-50"><th class="border p-2">Name</th><th class="border p-2">Section</th><th class="border p-2">Reg No</th></tr></thead>
          <tbody>${sts.map(s => `<tr><td class="border p-2">${s.name}</td><td class="border p-2">${s.section}</td><td class="border p-2">${s.regNo}</td></tr>`).join('')}</tbody></table></div>`;
      }).join('');
      html = `<div id="print-area" class="bg-white rounded-xl shadow-sm border p-6"><h3 class="text-lg font-bold mb-4">Class-wise Student Report</h3>${html}
        <div class="mt-4 no-print"><button onclick="Utils.printElement('#print-area')" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"><i class="fas fa-print mr-1"></i> Print</button></div></div>`;
    } else if (type === 'attendance') {
      html = `<div class="bg-white rounded-xl shadow-sm border p-6"><p class="text-slate-500">Attendance report shows last 30 days summary. Use Attendance module for detailed view.</p>
        <p class="mt-2">Total records: ${db.attendance.length}</p></div>`;
    } else if (type === 'results') {
      html = this.tableReport('Exam Results (First Term)', ['Student','Class','Total','Percentage','Grade'],
        db.students.map(s => {
          const marks = db.results.filter(r => r.studentId === s.id && r.examId === 1);
          if (!marks.length) return null;
          const obt = marks.reduce((a,r)=>a+r.obtained,0);
          const max = marks.reduce((a,r)=>a+r.maxMarks,0);
          const pct = ((obt/max)*100).toFixed(1);
          return [s.name, getClassName(s.classId)+'-'+s.section, obt+'/'+max, pct+'%', Utils.calcGrade(parseFloat(pct))];
        }).filter(Boolean));
    }

    document.getElementById('report-output').innerHTML = html;
  },

  tableReport(title, headers, rows) {
    return `
      <div id="print-area" class="bg-white rounded-xl shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">${title}</h3>
          <div class="flex gap-2 no-print">
            <button onclick="Utils.printElement('#print-area')" class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"><i class="fas fa-print mr-1"></i> Print</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="w-full text-sm border">
            <thead><tr class="bg-slate-100">${headers.map(h => `<th class="border p-2 text-left">${h}</th>`).join('')}</tr></thead>
            <tbody>
              ${rows.map(r => `<tr>${r.map(c => `<td class="border p-2">${c}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="text-xs text-slate-400 mt-3">Generated on ${new Date().toLocaleString()} • Alshafique Public School Kamber</p>
      </div>`;
  }
};
