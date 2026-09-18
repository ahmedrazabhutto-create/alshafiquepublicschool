// Utility functions

const Utils = {
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  formatCurrency(amount) {
    return 'Rs. ' + Number(amount).toLocaleString('en-PK');
  },

  formatPercent(n) {
    return (n || 0).toFixed(1) + '%';
  },

  today() {
    return new Date().toISOString().split('T')[0];
  },

  generateId(collection) {
    const db = DB.get();
    const items = db[collection] || [];
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  },

  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const colors = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      warning: 'bg-amber-500',
      info: 'bg-blue-600'
    };
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    const el = document.createElement('div');
    el.className = `toast flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${colors[type] || colors.info}`;
    el.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },

  confirm(message) {
    return window.confirm(message);
  },

  openModal(html) {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onclick="if(event.target===this) Utils.closeModal()">
        <div class="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          ${html}
        </div>
      </div>`;
  },

  closeModal() {
    document.getElementById('modal-container').innerHTML = '';
  },

  badge(status) {
    const map = {
      present: 'badge-present', absent: 'badge-absent', late: 'badge-late', leave: 'badge-leave',
      paid: 'badge-paid', pending: 'badge-pending',
      active: 'badge-active', inactive: 'badge-inactive'
    };
    const cls = map[status?.toLowerCase()] || 'badge-inactive';
    return `<span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls} capitalize">${status || '—'}</span>`;
  },

  gradeColor(grade) {
    if (['A+', 'A'].includes(grade)) return 'text-green-600 font-bold';
    if (['B', 'C'].includes(grade)) return 'text-blue-600 font-semibold';
    if (grade === 'D') return 'text-amber-600';
    return 'text-red-600';
  },

  calcPercentage(obtained, max) {
    if (!max) return 0;
    return ((obtained / max) * 100).toFixed(1);
  },

  calcGrade(pct) {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  },

  downloadCSV(filename, rows) {
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  printElement(selector) {
    const content = document.querySelector(selector);
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Print</title>
      <style>
        body { font-family: Inter, Arial, sans-serif; padding: 20px; color: #1e293b; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
        th { background: #f1f5f9; }
        h1,h2,h3 { margin: 0 0 8px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 12px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; }
      </style></head><body>
      <div class="header">
        <h1>Alshafique Public School Kamber</h1>
        <p>School Management System</p>
      </div>
      ${content.innerHTML}
      <script>window.onload=()=>{window.print();window.close();}</script>
      </body></html>`);
    win.document.close();
  }
};
