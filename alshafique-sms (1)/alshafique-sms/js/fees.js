// Fee Management

const Fees = {
  render() {
    const session = Auth.getSession();
    if (session.role === 'student' || session.role === 'parent') return this.studentView();

    const db = DB.get();
    const paid = db.fees.filter(f => f.status === 'paid').reduce((s,f) => s + f.amount, 0);
    const pending = db.fees.filter(f => f.status === 'pending').reduce((s,f) => s + f.amount, 0);

    return `
      <div class="page-enter">
        ${pageHeader('Fee Management', `
          <button onclick="Fees.showCollectForm()" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
            <i class="fas fa-plus mr-1"></i> Collect Fee
          </button>`)}

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-50 border border-green-200 rounded-xl p-4">
            <p class="text-xs text-green-600 uppercase font-medium">Collected</p>
            <p class="text-2xl font-bold text-green-700">${Utils.formatCurrency(paid)}</p>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p class="text-xs text-amber-600 uppercase font-medium">Pending</p>
            <p class="text-2xl font-bold text-amber-700">${Utils.formatCurrency(pending)}</p>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p class="text-xs text-blue-600 uppercase font-medium">Total Records</p>
            <p class="text-2xl font-bold text-blue-700">${db.fees.length}</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border p-4 mb-4">
          <div class="flex flex-wrap gap-3">
            <input type="text" id="fee-search" placeholder="Search student..." class="px-3 py-2 border rounded-lg text-sm flex-1 min-w-[150px]" oninput="Fees.filter()">
            <select id="fee-status" class="px-3 py-2 border rounded-lg text-sm" onchange="Fees.filter()">
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div class="table-wrap">
            <table class="w-full data-table text-sm">
              <thead>
                <tr class="border-b">
                  <th class="py-3 px-4 text-left">Receipt</th>
                  <th class="py-3 px-4 text-left">Student</th>
                  <th class="py-3 px-4 text-left">Type</th>
                  <th class="py-3 px-4 text-left">Month</th>
                  <th class="py-3 px-4 text-right">Amount</th>
                  <th class="py-3 px-4 text-left">Status</th>
                  <th class="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody id="fees-tbody">
                ${this.renderRows(db.fees.slice().reverse().slice(0, 40))}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  },

  renderRows(list) {
    if (!list.length) return `<tr><td colspan="7" class="py-10 text-center text-slate-400">No fee records</td></tr>`;
    return list.map(f => {
      const s = getStudent(f.studentId);
      return `<tr class="border-b border-slate-50">
        <td class="py-2 px-4 text-xs">${f.receiptNo || '—'}</td>
        <td class="py-2 px-4">${s?.name || '—'}</td>
        <td class="py-2 px-4">${f.type}</td>
        <td class="py-2 px-4">${f.month} ${f.year}</td>
        <td class="py-2 px-4 text-right font-medium">${Utils.formatCurrency(f.amount)}</td>
        <td class="py-2 px-4">${Utils.badge(f.status)}</td>
        <td class="py-2 px-4 text-center">
          ${f.status === 'pending' ? `<button onclick="Fees.markPaid(${f.id})" class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Mark Paid</button>` : `
          <button onclick="Fees.printReceipt(${f.id})" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Print Receipt"><i class="fas fa-print"></i></button>`}
        </td>
      </tr>`;
    }).join('');
  },

  filter() {
    const db = DB.get();
    const q = (document.getElementById('fee-search')?.value || '').toLowerCase();
    const status = document.getElementById('fee-status')?.value;
    let list = db.fees.filter(f => {
      const s = getStudent(f.studentId);
      const matchQ = !q || (s && s.name.toLowerCase().includes(q));
      const matchS = !status || f.status === status;
      return matchQ && matchS;
    }).reverse().slice(0, 50);
    document.getElementById('fees-tbody').innerHTML = this.renderRows(list);
  },

  studentView() {
    const session = Auth.getSession();
    const db = DB.get();
    const ids = session.role === 'student' ? [session.studentId] : (session.studentIds || []);
    const fees = db.fees.filter(f => ids.includes(f.studentId)).reverse();
    return `
      <div class="page-enter">
        ${pageHeader('Fee Status')}
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div class="table-wrap">
            <table class="w-full data-table text-sm">
              <thead><tr class="border-b"><th class="py-3 px-4 text-left">Student</th><th class="py-3 px-4 text-left">Type</th><th class="py-3 px-4 text-left">Period</th><th class="py-3 px-4 text-right">Amount</th><th class="py-3 px-4 text-left">Status</th><th class="py-3 px-4 text-left">Paid Date</th></tr></thead>
              <tbody>
                ${fees.map(f => {
                  const s = getStudent(f.studentId);
                  return `<tr class="border-b border-slate-50">
                    <td class="py-2 px-4">${s?.name}</td>
                    <td class="py-2 px-4">${f.type}</td>
                    <td class="py-2 px-4">${f.month} ${f.year}</td>
                    <td class="py-2 px-4 text-right">${Utils.formatCurrency(f.amount)}</td>
                    <td class="py-2 px-4">${Utils.badge(f.status)}</td>
                    <td class="py-2 px-4">${f.paidDate ? Utils.formatDate(f.paidDate) : '—'}</td>
                  </tr>`;
                }).join('') || '<tr><td colspan="6" class="py-10 text-center text-slate-400">No fee records</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  },

  showCollectForm() {
    const db = DB.get();
    Utils.openModal(`
      <div class="p-6">
        <h3 class="text-lg font-bold mb-4">Collect Fee</h3>
        <form onsubmit="Fees.collect(event)" class="space-y-3">
          <div>
            <label class="text-sm font-medium">Student *</label>
            <select name="studentId" required class="w-full px-3 py-2 border rounded-lg text-sm">
              ${db.students.filter(s=>s.status==='active').map(s => `<option value="${s.id}">${s.name} (${s.regNo}) - ${getClassName(s.classId)}</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium">Fee Type *</label>
              <select name="type" required class="w-full px-3 py-2 border rounded-lg text-sm">
                <option>Monthly Fee</option>
                <option>Admission Fee</option>
                <option>Exam Fee</option>
                <option>Transport Fee</option>
                <option>Other Charges</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">Amount *</label>
              <input type="number" name="amount" required class="w-full px-3 py-2 border rounded-lg text-sm" value="2500">
            </div>
            <div>
              <label class="text-sm font-medium">Month</label>
              <select name="month" class="w-full px-3 py-2 border rounded-lg text-sm">
                ${['January','February','March','April','May','June','July','August','September','October','November','December'].map(m=>`<option>${m}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">Year</label>
              <input type="number" name="year" value="2025" class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 rounded-lg text-sm">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Collect & Generate Receipt</button>
          </div>
        </form>
      </div>`);
  },

  collect(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.studentId = parseInt(data.studentId);
    data.amount = parseInt(data.amount);
    data.year = parseInt(data.year);
    const db = DB.get();
    const receiptNo = `RCP-2025-${3000 + db.fees.length}`;
    db.fees.push({
      id: Utils.generateId('fees'),
      ...data,
      status: 'paid',
      paidDate: Utils.today(),
      receiptNo
    });
    DB.set(db);
    Utils.toast('Fee collected successfully. Receipt: ' + receiptNo);
    Utils.closeModal();
    App.navigate('fees');
  },

  markPaid(id) {
    const db = DB.get();
    const f = db.fees.find(x => x.id === id);
    if (f) {
      f.status = 'paid';
      f.paidDate = Utils.today();
      f.receiptNo = `RCP-2025-${3000 + id}`;
      DB.set(db);
      Utils.toast('Marked as paid');
      App.navigate('fees');
    }
  },

  printReceipt(id) {
    const f = DB.get().fees.find(x => x.id === id);
    const s = getStudent(f.studentId);
    const school = DB.get().school;
    Utils.openModal(`
      <div class="p-6" id="receipt-print">
        <div class="text-center border-b-2 border-blue-800 pb-4 mb-4">
          <h2 class="text-xl font-bold text-blue-900">${school.name}</h2>
          <p class="text-sm text-slate-500">${school.address}</p>
          <p class="text-sm text-slate-500">${school.phone} | ${school.email}</p>
          <h3 class="mt-2 font-semibold text-lg">FEE RECEIPT</h3>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm mb-4">
          <div><strong>Receipt No:</strong> ${f.receiptNo}</div>
          <div><strong>Date:</strong> ${Utils.formatDate(f.paidDate)}</div>
          <div><strong>Student:</strong> ${s?.name}</div>
          <div><strong>Reg No:</strong> ${s?.regNo}</div>
          <div><strong>Class:</strong> ${getClassName(s?.classId)}-${s?.section}</div>
          <div><strong>Father:</strong> ${s?.fatherName}</div>
        </div>
        <table class="w-full text-sm border mb-4">
          <thead><tr class="bg-slate-100"><th class="border p-2 text-left">Description</th><th class="border p-2 text-right">Amount</th></tr></thead>
          <tbody>
            <tr><td class="border p-2">${f.type} - ${f.month} ${f.year}</td><td class="border p-2 text-right">${Utils.formatCurrency(f.amount)}</td></tr>
            <tr class="font-bold"><td class="border p-2">Total</td><td class="border p-2 text-right">${Utils.formatCurrency(f.amount)}</td></tr>
          </tbody>
        </table>
        <p class="text-xs text-slate-500 text-center">This is a computer generated receipt.</p>
        <div class="flex justify-end gap-2 mt-4 no-print">
          <button onclick="Utils.closeModal()" class="px-4 py-2 bg-slate-100 rounded-lg text-sm">Close</button>
          <button onclick="Utils.printElement('#receipt-print')" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"><i class="fas fa-print mr-1"></i> Print</button>
        </div>
      </div>`);
  }
};
