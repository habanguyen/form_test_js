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

// Thêm nhân viên mới
function addEmployee(id, name, age, position, department) {
    const email = arguments.length >= 5 ? arguments[3] : '';
    manager.add(new Person(id, name, age, email, position, department));
    renderEmployeeTable(manager.getAll());
}

// Sửa nhân viên theo id
function updateEmployeeById(id, data) {
    const emp = manager.Employees.find(e => e.id === id);
    if (emp) {
        emp.update(data);
        if (!data.email) emp.email = emp.email ?? '';
        renderEmployeeTable(manager.getAll());
    }
}

// Xóa nhân viên theo id
function deleteEmployeeById(id) {
    const idx = manager.Employees.findIndex(e => e.id === id);
    if (idx !== -1) {
        manager.Employees.splice(idx, 1);
        renderEmployeeTable(manager.getAll());
    }
}

// Hàm tìm kiếm nhân viên theo từ khóa nhập vào
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

// Hàm sắp xếp nhân viên
function sortEmployees(field, order) {
    const employees = manager.getAll();
    employees.sort((a, b) => {
        let valA = a[field] ? a[field].toString().toLowerCase() : '';
        let valB = b[field] ? b[field].toString().toLowerCase() : '';
        if (field === 'age') {
            valA = parseInt(valA, 10) || 0;
            valB = parseInt(valB, 10) || 0;
        }
        if (order === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
    });
    return employees;
}

// Hàm render danh sách nhân viên ra bảng HTML
function renderEmployeeTable(employees) {
    const tableDiv = document.getElementById('employee-list');
    if (!tableDiv) return;
    if (!employees || employees.length === 0) {
        tableDiv.innerHTML = '<div class="employee-empty">Không có nhân viên nào phù hợp</div>';
        return;
    }
    tableDiv.innerHTML = employees.map((emp) =>
        `<div class="employee-item" data-id="${emp.id}">
            <div><b>Mã NV:</b> ${emp.id}</div>
            <div><b>Tên:</b> ${emp.name}</div>
            <div><b>Tuổi:</b> ${emp.age}</div>
            <div><b>Email:</b> ${emp.email ?? ''}</div>
            <div><b>Chức vụ:</b> ${emp.position}</div>
            <div><b>Phòng ban:</b> ${emp.department}</div>
            <button class="update-employee-btn" data-id="${emp.id}">Cập nhật</button>
            <button class="delete-employee-btn" data-id="${emp.id}">Xóa</button>
        </div>`
    ).join('');
    if (typeof attachEmployeeActionEvents === 'function') attachEmployeeActionEvents();
}

// Gắn lại sự kiện cho các nút cập nhật/xóa sau mỗi lần render
function attachEmployeeActionEvents() {
    // Sự kiện cho nút cập nhật: show popup cập nhật
    document.querySelectorAll('.update-employee-btn').forEach(btn => {
        btn.onclick = function () {
            const id = Number(btn.getAttribute('data-id'));
            const emp = manager.Employees.find(e => e.id === id);
            if (emp) {
                document.getElementById('update-id').value = emp.id;
                document.getElementById('update-name').value = emp.name;
                document.getElementById('update-age').value = emp.age;
                document.getElementById('update-email').value = emp.email ?? '';
                document.getElementById('update-position').value = emp.position;
                document.getElementById('update-department').value = emp.department ?? '';
                const overlay = document.getElementById('update-employee-overlay');
                const popup = document.getElementById('update-employee-popup');
                if (overlay && popup) {
                    overlay.style.display = 'block';
                    popup.style.display = 'block';
                    document.body.classList.add('modal-open');
                }
            }
        };
    });

    // Sự kiện đóng popup cập nhật
    const overlay = document.getElementById('update-employee-overlay');
    const popup = document.getElementById('update-employee-popup');
    const closeBtn = document.getElementById('close-update-form');
    function closeUpdatePopup() {
        if (overlay && popup) {
            overlay.style.display = 'none';
            popup.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }
    if (closeBtn) closeBtn.onclick = closeUpdatePopup;
    if (overlay) overlay.onclick = closeUpdatePopup;

    // Sự kiện submit form cập nhật: ẩn popup khi xong
    const updateForm = document.getElementById('update-employee-form');
    if (updateForm) {
        updateForm.onsubmit = function (e) {
            e.preventDefault();
            const id = Number(document.getElementById('update-id').value);
            const name = document.getElementById('update-name').value.trim();
            const age = Number(document.getElementById('update-age').value);
            const email = document.getElementById('update-email').value.trim();
            const position = document.getElementById('update-position').value.trim();
            const department = document.getElementById('update-department').value.trim();
            updateEmployeeById(id, { name, age, email, position, department });
            alert('Cập nhật thành công!');
            updateForm.reset();
            closeUpdatePopup();
        };
    }

    // Sự kiện xóa
    document.querySelectorAll('.delete-employee-btn').forEach(btn => {
        btn.onclick = function () {
            const id = Number(btn.getAttribute('data-id'));
            const overlay = document.getElementById('delete-employee-overlay');
            const popup = document.getElementById('delete-employee-popup');
            const msg = document.getElementById('delete-employee-message');
            if (overlay && popup && msg) {
                overlay.style.display = 'block';
                popup.style.display = 'block';
                document.body.classList.add('modal-open');
                const emp = manager.Employees.find(e => e.id === id);
                msg.textContent = emp ? `Bạn có chắc muốn xóa nhân viên: ${emp.name} (ID: ${emp.id})?` : 'Bạn có chắc muốn xóa nhân viên này?';
                const cancelBtn = document.getElementById('cancel-delete-employee');
                const confirmBtn = document.getElementById('confirm-delete-employee');
                function closeDeletePopup() {
                    overlay.style.display = 'none';
                    popup.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    if (cancelBtn) cancelBtn.onclick = null;
                    if (confirmBtn) confirmBtn.onclick = null;
                    overlay.onclick = null;
                }
                if (cancelBtn) cancelBtn.onclick = closeDeletePopup;
                if (overlay) overlay.onclick = closeDeletePopup;
                if (confirmBtn) confirmBtn.onclick = function () {
                    deleteEmployeeById(id);
                    closeDeletePopup();
                };
            }
        };
    });
}

// Gắn sự kiện cho form tìm kiếm và in danh sách ban đầu
window.addEventListener('DOMContentLoaded', function () {
    // Kích hoạt kéo thả bằng SortableJS
    if (window.Sortable) {
        new Sortable(document.getElementById('employee-list'), {
            animation: 150,
            onEnd: function (evt) {
                const nodes = Array.from(document.querySelectorAll('#employee-list .employee-item'));
                const newOrder = nodes.map(node => Number(node.getAttribute('data-id')));
                manager.Employees.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
                renderEmployeeTable(manager.Employees);
            }
        });
    }

    // Sự kiện popup tạo mới nhân viên
    const btnShowCreate = document.getElementById('show-create-form');
    const overlayCreate = document.getElementById('create-employee-overlay');
    const popupCreate = document.getElementById('create-employee-popup');
    const closeCreateBtn = document.getElementById('close-create-form');

    function closeCreatePopup() {
        if (overlayCreate && popupCreate) {
            overlayCreate.style.display = 'none';
            popupCreate.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }
    if (btnShowCreate && overlayCreate && popupCreate) {
        btnShowCreate.onclick = function () {
            overlayCreate.style.display = 'block';
            popupCreate.style.display = 'block';
            document.body.classList.add('modal-open');
        };
    }
    if (closeCreateBtn) closeCreateBtn.onclick = closeCreatePopup;
    if (overlayCreate) overlayCreate.onclick = closeCreatePopup;

    // Sự kiện submit form tạo mới nhân viên
    const createForm = document.getElementById('create-employee-form');
    if (createForm && overlayCreate && popupCreate) {
        createForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('create-name').value.trim();
            const age = Number(document.getElementById('create-age').value);
            const email = document.getElementById('create-email').value.trim();
            const position = document.getElementById('create-position').value.trim();
            const department = document.getElementById('create-department').value.trim();
            const id = Date.now();
            addEmployee(id, name, age, email, position, department);
            alert('Đã thêm nhân viên mới!');
            createForm.reset();
            closeCreatePopup();
            renderEmployeeTable(manager.getAll());
        });
    }

    // Gắn sự kiện tìm kiếm
    const searchForm = document.getElementById('search-employee-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = document.getElementById('search-query').value;
            const results = searchEmployees(query);
            renderEmployeeTable(results);
            const employeeList = document.getElementById('employee-list');
            const employeeInfo = document.getElementById('employee-info');
            if (employeeList && employeeInfo) {
                employeeInfo.style.display = 'none';
                employeeList.style.display = 'block';
            }
        });
    }

    // Mở popup lọc
    document.getElementById('sort-employee-btn').addEventListener('click', () => {
        document.getElementById('sort-employee-overlay').style.display = 'block';
        document.getElementById('sort-employee-popup').style.display = 'block';
    });

    // Đóng popup lọc
    document.getElementById('close-filter-form').addEventListener('click', closeFilterPopup);
    document.getElementById('filter-employee-overlay').addEventListener('click', closeFilterPopup);

    function closeFilterPopup() {
        document.getElementById('filter-employee-overlay').style.display = 'none';
        document.getElementById('filter-employee-popup').style.display = 'none';
    }

    // Xử lý submit form lọc
    document.getElementById('filter-employee-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('filter-name').value.trim().toLowerCase();
        const age = Number(document.getElementById('filter-age').value);
        const email = document.getElementById('filter-email').value.trim().toLowerCase();
        const position = document.getElementById('filter-position').value.trim().toLowerCase();
        const department = document.getElementById('filter-department').value.trim().toLowerCase();
        const ageOrder = document.getElementById('filter-age-order').value;

        let results = manager.getAll().filter(emp => {
            return (!name || emp.name.toLowerCase().includes(name)) &&
                (!age || emp.age >= age) &&
                (!email || emp.email.toLowerCase().includes(email)) &&
                (!position || emp.position.toLowerCase().includes(position)) &&
                (!department || emp.department.toLowerCase().includes(department));
        });

        if (ageOrder === "asc") {
            results.sort((a, b) => a.age - b.age);
        } else if (ageOrder === "desc") {
            results.sort((a, b) => b.age - a.age);
        }

        renderEmployeeTable(results);
        closeFilterPopup();
        const employeeList = document.getElementById('employee-list');
        const employeeInfo = document.getElementById('employee-info');
        if (employeeList && employeeInfo) {
            employeeInfo.style.display = 'none';
            employeeList.style.display = 'block';
        }
    });

    // Lấy ID từ query string và hiển thị thông tin chi tiết
    const params = new URLSearchParams(window.location.search);
    const idFromQuery = parseInt(params.get("id"), 10);
    const employeeList = document.getElementById('employee-list');
    const employeeInfo = document.getElementById('employee-info');

    if (employeeList && employeeInfo) {
        if (!isNaN(idFromQuery)) {
            const employee = manager.Employees.find(e => e.id === idFromQuery);
            if (employee) {
                employeeInfo.innerHTML = `
                    <div class="employee-detail">
                        <h3>Thông tin nhân viên (ID: ${employee.id})</h3>
                        <p><strong>Tên:</strong> ${employee.name}</p>
                        <p><strong>Tuổi:</strong> ${employee.age}</p>
                        <p><strong>Email:</strong> ${employee.email ?? ''}</p>
                        <p><strong>Chức vụ:</strong> ${employee.position}</p>
                        <p><strong>Phòng ban:</strong> ${employee.department}</p>
                        <a href="/employee">Quay lại danh sách</a>
                    </div>`;
                employeeList.style.display = 'none';
                employeeInfo.style.display = 'block';
            } else {
                alert(`Không tìm thấy nhân viên với ID: ${idFromQuery}!`);
                employeeList.style.display = 'block';
                employeeInfo.style.display = 'none';
                renderEmployeeTable(manager.getAll());
            }
        } else {
            renderEmployeeTable(manager.getAll());
        }
    }

    // Sự kiện sắp xếp
    const sortBtn = document.getElementById('sort-employee-btn');
    const sortOverlay = document.getElementById('sort-employee-overlay');
    const sortPopup = document.getElementById('sort-employee-popup');
    const closeSortBtn = document.getElementById('close-sort-form');
    const sortForm = document.getElementById('sort-employee-form');

    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            sortOverlay.style.display = 'block';
            sortPopup.style.display = 'block';
        });
    }

    if (closeSortBtn) {
        closeSortBtn.addEventListener('click', () => {
            sortOverlay.style.display = 'none';
            sortPopup.style.display = 'none';
        });
    }

    if (sortOverlay) {
        sortOverlay.addEventListener('click', () => {
            sortOverlay.style.display = 'none';
            sortPopup.style.display = 'none';
        });
    }

    if (sortForm) {
        sortForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const field = document.getElementById('sort-field').value;
            const order = document.getElementById('sort-order').value;
            const sorted = sortEmployees(field, order);
            renderEmployeeTable(sorted);
            if (sortOverlay && sortPopup) {
                sortOverlay.style.display = 'none';
                sortPopup.style.display = 'none';
            }
            const employeeList = document.getElementById('employee-list');
            const employeeInfo = document.getElementById('employee-info');
            if (employeeList && employeeInfo) {
                employeeInfo.style.display = 'none';
                employeeList.style.display = 'block';
            }
        });
    }
});