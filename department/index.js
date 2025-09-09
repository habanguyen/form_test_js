class Person {
    constructor(id, name, age, email, position, department) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.email = email;
        this.position = position;
        this.department = department;
    }

    update(data) {
        Object.assign(this, data);
    }

    toString() {
        return JSON.stringify({ id: this.id, name: this.name, age: this.age, position: this.position, department: this.department });
    }

    print() {
        console.log(this.toString());
    }
}

class EmployeesManager {
    Employees = [];

    constructor(...employees) {
        this.Employees = employees;
    }

    add(employee) {
        this.Employees.push(employee);
        return this;
    }

    getAll() {
        return [...this.Employees];
    }

    printAll() {
        this.Employees.forEach(emp => emp.print());
    }
}

const manager = new EmployeesManager();
manager
    .add(new Person(1001, "Nguyễn Văn A", 22, "a@email.com", "Kế toán", "Development"))
    .add(new Person(1002, "Trần Thị B", 24, "b@email.com", "Nhân sự", "Development"))
    .add(new Person(1003, "Lê Văn C", 28, "c@email.com", "Kỹ thuật", "Development"))
    .add(new Person(1004, "Phạm Thị D", 26, "d@email.com", "Bán hàng", "Sales"))
    .add(new Person(1005, "Hoàng Văn E", 30, "e@email.com", "Marketing", "Marketing"))
    .add(new Person(1006, "Đỗ Thị F", 27, "f@email.com", "Kế toán", "Finance"))
    .add(new Person(1007, "Vũ Văn G", 25, "g@email.com", "Nhân sự", "HR"))
    .add(new Person(1008, "Bùi Thị H", 29, "h@email.com", "Kỹ thuật", "IT"))
    .add(new Person(1009, "Phan Văn I", 31, "i@email.com", "Bán hàng", "Sales"))
    .add(new Person(1010, "Lý Thị K", 23, "k@email.com", "Marketing", "Marketing"));

function addEmployee(id, name, age, email, position, department) {
    manager.add(new Person(id, name, age, email, position, department));
    renderEmployeeTable(manager.getAll());
}

function updateEmployeeById(id, data) {
    const emp = manager.Employees.find(e => e.id === id);
    if (emp) {
        emp.update(data);
        if (!data.email) emp.email = emp.email ?? '';
        renderEmployeeTable(manager.getAll());
    }
}

function deleteEmployeeById(id) {
    const idx = manager.Employees.findIndex(e => e.id === id);
    if (idx !== -1) {
        manager.Employees.splice(idx, 1);
        renderEmployeeTable(manager.getAll());
    }
}

function searchEmployees(query) {
    query = query.trim().toLowerCase();
    return manager.getAll().filter(emp =>
        emp.name.toLowerCase().includes(query) ||
        String(emp.id).includes(query) ||
        String(emp.age).includes(query) ||
        emp.position.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
    );
}

function sortEmployees(field, order) { // truyền vào 2 tham số field là tên cột để sắp xếp(tên , tuổi , ...) và order là kiểu sắp xếp (lớn -> bé or ngược lại)
    const employees = manager.getAll();
    employees.sort((a, b) => {         // hàm sort trong js tự động lấy cặp phần từ trong mảng truyền vào hàm so sánh cụ thể ở đây là biến a và b
        let valA = a[field] ? a[field].toString().toLowerCase() : '';
        let valB = b[field] ? b[field].toString().toLowerCase() : '';
        if (field === 'age') {
            valA = parseInt(valA, 10) || 0;
            valB = parseInt(valB, 10) || 0;
        }
        // trả về -1 nếu a > b , = 1 nếu a < b 
        return order === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
    return employees;
}

function filterByDepartment(department) {
    return manager.getAll().filter(emp => !department || emp.department === department);
}

function renderEmployeeTable(employees) {
    const employeeList = document.getElementById('employeeList');
    if (!employeeList) return;
    if (!employees || employees.length === 0) {
        employeeList.innerHTML = '<div class="employee-empty">Không có nhân viên nào phù hợp</div>';
        return;
    }
    employeeList.innerHTML = employees.map(emp =>
        `<div class="employee-item" data-id="${emp.id}">
            <div><b>Mã NV:</b> ${emp.id}</div>
            <div><b>Tên:</b> ${emp.name}</div>
            <div><b>Tuổi:</b> ${emp.age}</div>
            <div><b>Email:</b> ${emp.email ?? ''}</div>
            <div><b>Chức vụ:</b> ${emp.position}</div>
            <div><b>Phòng ban:</b> ${emp.department}</div>
            <button class="update-btn" data-id="${emp.id}">Cập nhật</button>
            <button class="delete-btn" data-id="${emp.id}">Xoá</button>
        </div>`
    ).join('');
    attachEmployeeActionEvents();
}

function attachEmployeeActionEvents() {
    document.querySelectorAll('.update-btn').forEach(btn => {
        btn.onclick = function() {
            const id = Number(btn.getAttribute('data-id'));
            const emp = manager.Employees.find(e => e.id === id);
            if (emp) {
                document.getElementById('id').value = emp.id;
                document.getElementById('id').disabled = true;
                document.getElementById('name').value = emp.name;
                document.getElementById('age').value = emp.age;
                document.getElementById('email').value = emp.email ?? '';
                document.getElementById('position').value = emp.position;
                document.getElementById('department').value = emp.department;
                document.getElementById('modalTitle').textContent = 'Sửa nhân viên';
                document.getElementById('employeeModal').style.display = 'block';
            }
        };
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = function() {
            const id = Number(btn.getAttribute('data-id'));
            if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
                deleteEmployeeById(id);
            }
        };
    });
}

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addBtn = document.getElementById('addBtn');
const sortBtn = document.getElementById('sortBtn');
const filterBtn = document.getElementById('filterBtn');
const employeeModal = document.getElementById('employeeModal');
const filterModal = document.getElementById('filterModal');
const departmentFilterModal = document.getElementById('departmentFilterModal');
const sortModal = document.getElementById('sortModal');
const employeeForm = document.getElementById('employeeForm');
const filterForm = document.getElementById('filterForm');
const departmentFilterForm = document.getElementById('departmentFilterForm');
const sortForm = document.getElementById('sortForm');
const closeButtons = document.getElementsByClassName('close');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    const results = searchEmployees(query);
    renderEmployeeTable(results);
});

addBtn.addEventListener('click', () => {
    employeeForm.reset();
    document.getElementById('id').disabled = false;
    document.getElementById('modalTitle').textContent = 'Thêm nhân viên';
    employeeModal.style.display = 'block';
});

sortBtn.addEventListener('click', () => departmentFilterModal.style.display = 'block');
filterBtn.addEventListener('click', () => filterModal.style.display = 'block');

employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('id').value);
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    const email = document.getElementById('email').value;
    const position = document.getElementById('position').value;
    const department = document.getElementById('department').value;
    const data = { id, name, age, email, position, department };
    if (document.getElementById('id').disabled) {
        updateEmployeeById(id, data);
    } else {
        addEmployee(id, name, age, email, position, department);
    }
    employeeModal.style.display = 'none';
});

filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('filterName').value.trim().toLowerCase();
    const age = Number(document.getElementById('filterAge').value);
    const email = document.getElementById('filterEmail').value.trim().toLowerCase();
    const position = document.getElementById('filterPosition').value.trim().toLowerCase();
    const ageOrder = document.getElementById('filterAgeOrder').value;

    let results = manager.getAll().filter(emp => {
        return (!name || emp.name.toLowerCase().includes(name)) &&
               (!age || emp.age >= age) &&
               (!email || emp.email.toLowerCase().includes(email)) &&
               (!position || emp.position.toLowerCase().includes(position));
    });

    if (ageOrder === "asc") {
        results.sort((a, b) => a.age - b.age);
    } else if (ageOrder === "desc") {
        results.sort((a, b) => b.age - a.age);
    }

    renderEmployeeTable(results);
    filterModal.style.display = 'none';
});

departmentFilterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const department = document.getElementById('departmentFilterSelect').value;
    console.log("Selected department:", department);
    const results = filterByDepartment(department);
    renderEmployeeTable(results);
    departmentFilterModal.style.display = 'none';
});

sortForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const field = document.getElementById('sortField').value;
    const order = document.getElementById('sortOrder').value;
    const sorted = sortEmployees(field, order);
    renderEmployeeTable(sorted);
    sortModal.style.display = 'none';
});

Array.from(closeButtons).forEach(btn => {
    btn.addEventListener('click', () => {
        employeeModal.style.display = 'none';
        filterModal.style.display = 'none';
        departmentFilterModal.style.display = 'none';
        sortModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === employeeModal || e.target === filterModal || e.target === departmentFilterModal || e.target === sortModal) {
        employeeModal.style.display = 'none';
        filterModal.style.display = 'none';
        departmentFilterModal.style.display = 'none';
        sortModal.style.display = 'none';
    }
});

renderEmployeeTable(manager.getAll());