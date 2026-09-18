// Alshafique Public School Kamber - Sample Database (localStorage backed)

const DB_KEY = 'alshafique_sms_db_v1';

const defaultDB = {
  school: {
    name: 'Alshafique Public School Kamber',
    address: 'Kamber, Sindh, Pakistan',
    phone: '+92 300 1234567',
    email: 'info@alshafiqueschool.edu.pk',
    academicYear: '2025-2026',
    logo: null
  },
  users: [
    { id: 1, username: 'admin', email: 'admin@alshafique.edu.pk', password: 'admin123', role: 'admin', name: 'System Administrator', status: 'active' },
    { id: 2, username: 'principal', email: 'principal@alshafique.edu.pk', password: 'principal123', role: 'principal', name: 'Dr. Muhammad Khan', status: 'active' },
    { id: 3, username: 'teacher1', email: 'ahmed@alshafique.edu.pk', password: 'teacher123', role: 'teacher', name: 'Ahmed Ali', teacherId: 1, status: 'active' },
    { id: 4, username: 'teacher2', email: 'sara@alshafique.edu.pk', password: 'teacher123', role: 'teacher', name: 'Sara Fatima', teacherId: 2, status: 'active' },
    { id: 5, username: 'accountant', email: 'accounts@alshafique.edu.pk', password: 'account123', role: 'accountant', name: 'Bilal Hussain', status: 'active' },
    { id: 6, username: 'student1', email: 'ali.raza@student.edu.pk', password: 'student123', role: 'student', name: 'Ali Raza', studentId: 1, status: 'active' },
    { id: 7, username: 'parent1', email: 'parent.raza@email.com', password: 'parent123', role: 'parent', name: 'Muhammad Raza', parentId: 1, studentIds: [1, 2], status: 'active' },
    { id: 8, username: 'student2', email: 'aisha@student.edu.pk', password: 'student123', role: 'student', name: 'Aisha Khan', studentId: 2, status: 'active' }
  ],
  classes: [
    { id: 1, name: 'Nursery', sections: ['A', 'B'] },
    { id: 2, name: 'KG', sections: ['A', 'B'] },
    { id: 3, name: 'Grade 1', sections: ['A', 'B', 'C'] },
    { id: 4, name: 'Grade 2', sections: ['A', 'B'] },
    { id: 5, name: 'Grade 3', sections: ['A', 'B'] },
    { id: 6, name: 'Grade 4', sections: ['A', 'B'] },
    { id: 7, name: 'Grade 5', sections: ['A', 'B'] },
    { id: 8, name: 'Grade 6', sections: ['A', 'B'] },
    { id: 9, name: 'Grade 7', sections: ['A', 'B'] },
    { id: 10, name: 'Grade 8', sections: ['A', 'B'] },
    { id: 11, name: 'Grade 9', sections: ['A', 'B'] },
    { id: 12, name: 'Grade 10', sections: ['A', 'B'] }
  ],
  subjects: [
    { id: 1, name: 'English', code: 'ENG' },
    { id: 2, name: 'Urdu', code: 'URD' },
    { id: 3, name: 'Mathematics', code: 'MATH' },
    { id: 4, name: 'Science', code: 'SCI' },
    { id: 5, name: 'Islamiat', code: 'ISL' },
    { id: 6, name: 'Social Studies', code: 'SST' },
    { id: 7, name: 'Computer Science', code: 'CS' },
    { id: 8, name: 'Physics', code: 'PHY' },
    { id: 9, name: 'Chemistry', code: 'CHEM' },
    { id: 10, name: 'Biology', code: 'BIO' },
    { id: 11, name: 'Pakistan Studies', code: 'PST' },
    { id: 12, name: 'Art', code: 'ART' }
  ],
  teachers: [
    { id: 1, empId: 'TCH-001', name: 'Ahmed Ali', email: 'ahmed@alshafique.edu.pk', phone: '0300-1111111', qualification: 'M.Sc Mathematics', subject: 'Mathematics', classes: ['Grade 8-A', 'Grade 9-A', 'Grade 10-A'], joiningDate: '2020-03-15', salary: 55000, status: 'active', address: 'Kamber City' },
    { id: 2, empId: 'TCH-002', name: 'Sara Fatima', email: 'sara@alshafique.edu.pk', phone: '0300-2222222', qualification: 'M.A English', subject: 'English', classes: ['Grade 6-A', 'Grade 7-A', 'Grade 8-B'], joiningDate: '2019-08-01', salary: 52000, status: 'active', address: 'Larkana' },
    { id: 3, empId: 'TCH-003', name: 'Imran Shah', email: 'imran@alshafique.edu.pk', phone: '0300-3333333', qualification: 'B.Ed, M.Sc Physics', subject: 'Physics', classes: ['Grade 9-B', 'Grade 10-B'], joiningDate: '2021-01-10', salary: 50000, status: 'active', address: 'Kamber' },
    { id: 4, empId: 'TCH-004', name: 'Nadia Parveen', email: 'nadia@alshafique.edu.pk', phone: '0300-4444444', qualification: 'M.Sc Chemistry', subject: 'Chemistry', classes: ['Grade 9-A', 'Grade 10-A'], joiningDate: '2022-04-20', salary: 48000, status: 'active', address: 'Shahdadkot' },
    { id: 5, empId: 'TCH-005', name: 'Farhan Ahmed', email: 'farhan@alshafique.edu.pk', phone: '0300-5555555', qualification: 'B.S Computer Science', subject: 'Computer Science', classes: ['Grade 6-B', 'Grade 7-B', 'Grade 8-A'], joiningDate: '2023-02-01', salary: 45000, status: 'active', address: 'Kamber' }
  ],
  staff: [
    { id: 1, empId: 'STF-001', name: 'Bilal Hussain', role: 'Accountant', phone: '0300-6666666', joiningDate: '2018-06-01', salary: 40000, status: 'active' },
    { id: 2, empId: 'STF-002', name: 'Rashid Ali', role: 'Clerk', phone: '0300-7777777', joiningDate: '2020-09-15', salary: 28000, status: 'active' },
    { id: 3, empId: 'STF-003', name: 'Gulshan Bibi', role: 'Librarian', phone: '0300-8888888', joiningDate: '2021-11-01', salary: 25000, status: 'active' }
  ],
  students: [
    { id: 1, regNo: 'APS-2024-001', name: 'Ali Raza', fatherName: 'Muhammad Raza', gender: 'Male', dob: '2012-05-15', classId: 8, section: 'A', admissionDate: '2024-04-01', previousSchool: 'Govt Primary School', phone: '0300-9999001', address: 'Village A, Kamber', status: 'active', photo: null },
    { id: 2, regNo: 'APS-2024-002', name: 'Aisha Khan', fatherName: 'Muhammad Raza', gender: 'Female', dob: '2013-08-22', classId: 7, section: 'A', admissionDate: '2024-04-01', previousSchool: 'The Educators', phone: '0300-9999001', address: 'Village A, Kamber', status: 'active', photo: null },
    { id: 3, regNo: 'APS-2023-045', name: 'Hassan Ali', fatherName: 'Ali Akbar', gender: 'Male', dob: '2011-03-10', classId: 9, section: 'A', admissionDate: '2023-04-05', previousSchool: 'Public School', phone: '0301-1111222', address: 'Kamber Town', status: 'active', photo: null },
    { id: 4, regNo: 'APS-2023-078', name: 'Fatima Zahra', fatherName: 'Zahid Hussain', gender: 'Female', dob: '2012-11-30', classId: 8, section: 'B', admissionDate: '2023-04-10', previousSchool: 'Model School', phone: '0302-3333444', address: 'Shahdadkot Road', status: 'active', photo: null },
    { id: 5, regNo: 'APS-2024-015', name: 'Usman Ghani', fatherName: 'Ghulam Nabi', gender: 'Male', dob: '2014-01-18', classId: 6, section: 'A', admissionDate: '2024-04-02', previousSchool: '', phone: '0303-5555666', address: 'Near Bus Stand, Kamber', status: 'active', photo: null },
    { id: 6, regNo: 'APS-2022-112', name: 'Zainab Bibi', fatherName: 'Sikandar Ali', gender: 'Female', dob: '2010-07-05', classId: 10, section: 'A', admissionDate: '2022-04-01', previousSchool: 'Al-Huda School', phone: '0304-7777888', address: 'Larkana Road', status: 'active', photo: null },
    { id: 7, regNo: 'APS-2024-022', name: 'Bilal Ahmed', fatherName: 'Ahmed Raza', gender: 'Male', dob: '2015-09-12', classId: 5, section: 'A', admissionDate: '2024-04-03', previousSchool: '', phone: '0305-9999000', address: 'Colony No.2', status: 'active', photo: null },
    { id: 8, regNo: 'APS-2023-091', name: 'Maryam Sultana', fatherName: 'Sultan Mehmood', gender: 'Female', dob: '2011-12-25', classId: 9, section: 'B', admissionDate: '2023-04-08', previousSchool: 'Bright Future', phone: '0306-1212121', address: 'Main Bazaar', status: 'active', photo: null }
  ],
  parents: [
    { id: 1, name: 'Muhammad Raza', phone: '0300-9999001', email: 'parent.raza@email.com', address: 'Village A, Kamber', studentIds: [1, 2] }
  ],
  attendance: generateAttendance(),
  fees: generateFees(),
  exams: [
    { id: 1, name: 'First Term Examination 2025', type: 'Term', startDate: '2025-09-01', endDate: '2025-09-15', classes: [6,7,8,9,10], status: 'completed' },
    { id: 2, name: 'Mid Term Test', type: 'Test', startDate: '2025-11-10', endDate: '2025-11-15', classes: [1,2,3,4,5,6,7,8,9,10], status: 'upcoming' },
    { id: 3, name: 'Final Examination 2026', type: 'Final', startDate: '2026-03-01', endDate: '2026-03-20', classes: [1,2,3,4,5,6,7,8,9,10], status: 'upcoming' }
  ],
  results: generateResults(),
  timetable: generateTimetable(),
  notices: [
    { id: 1, title: 'Welcome to New Academic Year 2025-2026', content: 'Dear students and parents, we welcome you to the new academic session. Classes commence from 1st April 2025.', category: 'General', date: '2025-03-25', publishedBy: 'Admin', priority: 'high' },
    { id: 2, title: 'First Term Exam Schedule Released', content: 'The schedule for First Term Examinations has been published. Please check the notice board and student portal.', category: 'Exam', date: '2025-08-20', publishedBy: 'Principal', priority: 'high' },
    { id: 3, title: 'Independence Day Holiday', content: 'School will remain closed on 14th August 2025 on account of Independence Day.', category: 'Holiday', date: '2025-08-10', publishedBy: 'Admin', priority: 'normal' },
    { id: 4, title: 'Parent-Teacher Meeting', content: 'PTM for all classes will be held on 25th September 2025 from 9:00 AM to 1:00 PM.', category: 'Event', date: '2025-09-10', publishedBy: 'Principal', priority: 'high' },
    { id: 5, title: 'Fee Submission Deadline', content: 'Last date for submission of monthly fee for September is 10th September 2025. Late fee charges will apply after that.', category: 'Fee', date: '2025-09-01', publishedBy: 'Accountant', priority: 'normal' }
  ],
  homework: [
    { id: 1, classId: 8, section: 'A', subject: 'Mathematics', title: 'Exercise 5.2 Complete', description: 'Solve all questions of Exercise 5.2 from textbook.', dueDate: '2025-09-20', assignedBy: 'Ahmed Ali', date: '2025-09-15' },
    { id: 2, classId: 7, section: 'A', subject: 'English', title: 'Essay Writing', description: 'Write an essay on "My School" (150-200 words).', dueDate: '2025-09-18', assignedBy: 'Sara Fatima', date: '2025-09-14' }
  ],
  activities: [
    { id: 1, text: 'New student Ali Raza admitted to Grade 8-A', time: '2 hours ago', type: 'student' },
    { id: 2, text: 'Fee of Rs. 3,500 collected from Hassan Ali', time: '4 hours ago', type: 'fee' },
    { id: 3, text: 'Attendance marked for Grade 9-A (32 Present)', time: '5 hours ago', type: 'attendance' },
    { id: 4, text: 'First Term results published for Grade 10', time: '1 day ago', type: 'exam' },
    { id: 5, text: 'Notice published: Parent-Teacher Meeting', time: '2 days ago', type: 'notice' },
    { id: 6, text: 'Teacher Sara Fatima updated timetable', time: '3 days ago', type: 'timetable' }
  ]
};

function generateAttendance() {
  const records = [];
  const statuses = ['present', 'present', 'present', 'present', 'absent', 'late', 'leave'];
  const today = new Date();
  for (let s = 1; s <= 8; s++) {
    for (let d = 0; d < 30; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      if (date.getDay() === 0) continue; // skip Sunday
      records.push({
        id: records.length + 1,
        studentId: s,
        date: date.toISOString().split('T')[0],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        markedBy: 'teacher1'
      });
    }
  }
  return records;
}

function generateFees() {
  const fees = [];
  const months = ['April', 'May', 'June', 'July', 'August', 'September'];
  const feeTypes = [
    { type: 'Monthly Fee', amount: 2500 },
    { type: 'Admission Fee', amount: 5000 },
    { type: 'Exam Fee', amount: 1000 },
    { type: 'Transport Fee', amount: 1500 }
  ];
  let id = 1;
  for (let s = 1; s <= 8; s++) {
    // Admission fee
    fees.push({ id: id++, studentId: s, type: 'Admission Fee', amount: 5000, month: 'April', year: 2025, status: 'paid', paidDate: '2025-04-05', receiptNo: `RCP-2025-${1000+id}` });
    months.forEach((m, idx) => {
      const paid = Math.random() > 0.25;
      fees.push({
        id: id++,
        studentId: s,
        type: 'Monthly Fee',
        amount: 2500 + (s % 3) * 200,
        month: m,
        year: 2025,
        status: paid ? 'paid' : 'pending',
        paidDate: paid ? `2025-${String(idx+4).padStart(2,'0')}-${String(5+Math.floor(Math.random()*10)).padStart(2,'0')}` : null,
        receiptNo: paid ? `RCP-2025-${2000+id}` : null
      });
    });
  }
  return fees;
}

function generateResults() {
  const results = [];
  let id = 1;
  const subjects = ['English', 'Urdu', 'Mathematics', 'Science', 'Islamiat', 'Computer Science'];
  for (let s = 1; s <= 8; s++) {
    subjects.forEach(sub => {
      const marks = 45 + Math.floor(Math.random() * 50);
      results.push({
        id: id++,
        examId: 1,
        studentId: s,
        subject: sub,
        maxMarks: 100,
        obtained: marks,
        grade: marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B' : marks >= 60 ? 'C' : marks >= 50 ? 'D' : 'F'
      });
    });
  }
  return results;
}

function generateTimetable() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    { no: 1, time: '08:00 - 08:40' },
    { no: 2, time: '08:40 - 09:20' },
    { no: 3, time: '09:20 - 10:00' },
    { no: 4, time: '10:20 - 11:00' },
    { no: 5, time: '11:00 - 11:40' },
    { no: 6, time: '11:40 - 12:20' },
    { no: 7, time: '12:20 - 13:00' }
  ];
  const subjectsPool = ['English', 'Urdu', 'Mathematics', 'Science', 'Islamiat', 'Computer Science', 'Social Studies', 'Art', 'PT'];
  const teachersPool = ['Ahmed Ali', 'Sara Fatima', 'Imran Shah', 'Nadia Parveen', 'Farhan Ahmed'];
  const tt = [];
  // Sample for Grade 8-A
  days.forEach(day => {
    periods.forEach(p => {
      tt.push({
        id: tt.length + 1,
        classId: 8,
        section: 'A',
        day,
        period: p.no,
        time: p.time,
        subject: subjectsPool[Math.floor(Math.random() * subjectsPool.length)],
        teacher: teachersPool[Math.floor(Math.random() * teachersPool.length)]
      });
    });
  });
  return tt;
}

// Database API
const DB = {
  load() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { console.warn('DB load error', e); }
    this.save(defaultDB);
    return JSON.parse(JSON.stringify(defaultDB));
  },
  save(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  },
  get() {
    if (!window._dbCache) window._dbCache = this.load();
    return window._dbCache;
  },
  set(data) {
    window._dbCache = data;
    this.save(data);
  },
  reset() {
    localStorage.removeItem(DB_KEY);
    window._dbCache = null;
    return this.get();
  }
};

// Helpers
function getClassName(id) {
  const c = DB.get().classes.find(x => x.id === id);
  return c ? c.name : 'N/A';
}

function getStudent(id) {
  return DB.get().students.find(s => s.id === id);
}

function getTeacher(id) {
  return DB.get().teachers.find(t => t.id === id);
}
