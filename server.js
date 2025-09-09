const express = require('express');
const app = express();
const port = 3000;

// Dữ liệu giả lập (thay bằng database sau này)
const employees = [
    { id: 1001, name: 'Nguyen Van A', position: 'Developer', department: 'IT', salary: 50000 },
    { id: 1002, name: 'Tran Thi B', position: 'Designer', department: 'Creative', salary: 45000 }
];

// API lấy thông tin nhân viên theo ID
app.get('/api/employee', (req, res) => {
    const id = parseInt(req.query.id); // Lấy ID từ query parameter
    const employee = employees.find(emp => emp.id === id);

    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});