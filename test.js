class person {
    constructor(id, name, age, email, position, department){
        this.id = id;
        this.name = name;
        this.age = age;
        this.email = email;
        this.position = position;
        this.department = department;
    }

    update(date){
        Object.assign(this, date);
    }

    toString(){
      return JSON.stringify({id: this.id, name: this.name, age: this.age, position: this.position, department: this.department});
    }

    print(){
        console.log(this.toString());
    }
}
class EmployeesManager{
    Employees = [];

    constructor(...employees){
        this.Employees = employees;
    }

    add(employee){
        this.Employees.push(employee);
        return this;
    }

    getAll(){
        return [...this.Employees];
    }

    printAll(){
        this.Employees.forEach(emp => emp.print());
    }
}
const manager = new EmployeesManager();
manager
    .add(new person(1001, "Nguyễn Văn A", 22, "a@email.com", "Kế toán", "Development"))
    .add(new person(1002, "Trần Thị B", 24, "b@email.com", "Nhân sự", "Development"))
    .add(new person(1003, "Lê Văn C", 28, "c@email.com", "Kỹ thuật", "Development"))
    .add(new person(1004, "Phạm Thị D", 26, "d@email.com", "Bán hàng", "Sales"))
    .add(new person(1005, "Hoàng Văn E", 30, "e@email.com", "Marketing", "Marketing"))
    .add(new person(1006, "Đỗ Thị F", 27, "f@email.com", "Kế toán", "Finance"))
    .add(new person(1007, "Vũ Văn G", 25, "g@email.com", "Nhân sự", "HR"))
    .add(new person(1008, "Bùi Thị H", 29, "h@email.com", "Kỹ thuật", "IT"))
    .add(new person(1009, "Phan Văn I", 31, "i@email.com", "Bán hàng", "Sales"))
    .add(new person(1010, "Lý Thị K", 23, "k@email.com", "Marketing", "Marketing"));

    // Thêm nhân viên mới
function addEmployee(id, name, age, position, department) {
    const email = arguments.length >= 5 ? arguments[3] : '';
    manager.add(new person(id, name, age, email, position, department));
    renderEmployeeTable(manager.getAll());
}

// Sửa nhân viên theo id
function updateEmployeeById(id, data) {
    const emp = manager.Employees.find(e => e.id === id);
    if (emp) {
        emp.update(data);
        // Nếu cập nhật thiếu email thì giữ lại email cũ
        if (!data.email) emp.email = emp.email ?? '';
        renderEmployeeTable(manager.getAll());
    }
}

// Xoá nhân viên theo id
function deleteEmployeeById(id) {
    const idx = manager.Employees.findIndex(e => e.id === id);
    if (idx !== -1) {
        manager.Employees.splice(idx, 1);
        renderEmployeeTable(manager.getAll());
    }
}
// Hàm tìm kiếm nhân viên theo từ khoá nhập vào
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
function sortEmployees(field, order) {
    const employees = manager.getAll(); // lấy danh sách hiện tại
    
    employees.sort((a, b) => {
        let valA = a[field] ? a[field].toString().toLowerCase() : '';
        let valB = b[field] ? b[field].toString().toLowerCase() : '';

        if (field === 'age') { // nếu là số thì parseInt
            valA = parseInt(valA, 10) || 0;
            valB = parseInt(valB, 10) || 0;
        }

        if (order === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
    });

    return employees;
}
// // ------------------- UI Helpers -------------------

// Hàm render danh sách nhân viên ra bảng HTML (dùng bảng đã tạo trong Main.html)
function renderEmployeeTable(employees) {
    const tableDiv = document.getElementById('employee-list');
    if (!tableDiv) return;
    if (!employees || employees.length === 0) {
        tableDiv.innerHTML = '<div class="employee-empty">Không có nhân viên nào phù hợp</div>';
        return;
    }
    tableDiv.innerHTML = employees.map((emp, idx) =>
        `<div class="employee-item" data-id="${emp.id}">
            <div><b>Mã NV:</b> ${emp.id}</div>
            <div><b>Tên:</b> ${emp.name}</div>
            <div><b>Tuổi:</b> ${emp.age}</div>
            <div><b>Email:</b> ${emp.email ?? ''}</div>
            <div><b>Chức vụ:</b> ${emp.position}</div>
            <div><b>Phòng ban:</b> ${emp.department}</div>
            <button class="update-employee-btn" data-id="${emp.id}">Cập nhật</button>
            <button class="delete-employee-btn" data-id="${emp.id}">Xoá</button>
        </div>`
    ).join('');
    if (typeof attachEmployeeActionEvents === 'function') attachEmployeeActionEvents();
}

// Gắn lại sự kiện cho các nút cập nhật/xoá sau mỗi lần render
function attachEmployeeActionEvents() {
    // Sự kiện di chuyển vị trí nhân viên
    document.querySelectorAll('.move-up-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = Number(btn.getAttribute('data-idx'));
            if (idx > 0) {
                const arr = manager.Employees;
                [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]];
                renderEmployeeTable(arr);
            }
        };
    });
    document.querySelectorAll('.move-down-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = Number(btn.getAttribute('data-idx'));
            const arr = manager.Employees;
            if (idx < arr.length-1) {
                [arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]];
                renderEmployeeTable(arr);
            }
        };
    });
    // Sự kiện cho nút cập nhật: show popup cập nhật
    document.querySelectorAll('.update-employee-btn').forEach(btn => {
        btn.onclick = function() {
            const id = Number(btn.getAttribute('data-id'));
            const emp = manager.Employees.find(e => e.id === id);
            if (emp) {
                document.getElementById('update-id').value = emp.id;
                document.getElementById('update-name').value = emp.name;
                document.getElementById('update-age').value = emp.age;
                document.getElementById('update-email').value = emp.email ?? '';
                document.getElementById('update-position').value = emp.position;
                document.getElementById('update-department').value = emp.department ?? '';
                // Hiện popup cập nhật
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
        updateForm.onsubmit = function(e) {
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
    document.querySelectorAll('.delete-employee-btn').forEach(btn => {
        btn.onclick = function() {
            const id = Number(btn.getAttribute('data-id'));
            // Hiện modal xác nhận xoá
            const overlay = document.getElementById('delete-employee-overlay');
            const popup = document.getElementById('delete-employee-popup');
            const msg = document.getElementById('delete-employee-message');
            if (overlay && popup && msg) {
                overlay.style.display = 'block';
                popup.style.display = 'block';
                document.body.classList.add('modal-open');
                // Hiển thị thông tin nhân viên nếu muốn
                const emp = manager.Employees.find(e => e.id === id);
                msg.textContent = emp ? `Bạn có chắc muốn xoá nhân viên: ${emp.name} (ID: ${emp.id})?` : 'Bạn có chắc muốn xoá nhân viên này?';
                // Gắn sự kiện xác nhận/hủy
                const cancelBtn = document.getElementById('cancel-delete-employee');
                const confirmBtn = document.getElementById('confirm-delete-employee');
                function closeDeletePopup() {
                    overlay.style.display = 'none';
                    popup.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    // Xoá sự kiện để tránh leak
                    if (cancelBtn) cancelBtn.onclick = null;
                    if (confirmBtn) confirmBtn.onclick = null;
                    overlay.onclick = null;
                }
                if (cancelBtn) cancelBtn.onclick = closeDeletePopup;
                if (overlay) overlay.onclick = closeDeletePopup;
                if (confirmBtn) confirmBtn.onclick = function() {
                    deleteEmployeeById(id);
                    closeDeletePopup();
                };
            }
        };
    });
}

// // ------------------- UI Actions -------------------


// Gắn sự kiện cho form tìm kiếm và in danh sách ban đầu
window.addEventListener('DOMContentLoaded', function() {
    // Kích hoạt kéo thả bằng SortableJS
    if (window.Sortable) {
        new Sortable(document.getElementById('employee-list'), {
            animation: 150,
            onEnd: function (evt) {
                // Cập nhật lại thứ tự trong manager.Employees
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
    function handleSortFormSubmit(e) {
    e.preventDefault();
    const field = document.getElementById('sort-field').value;
    const order = document.getElementById('sort-order').value;

    const sorted = sortEmployees(field, order);
    renderEmployeeTable(sorted);

    // đóng popup
    closeSortPopup();
    }

    function closeSortPopup() {
        document.getElementById('sort-employee-overlay').style.display = 'none';
        document.getElementById('sort-employee-popup').style.display = 'none';
    } 
    function closeCreatePopup() {
        if (overlayCreate && popupCreate) {
            overlayCreate.style.display = 'none';
            popupCreate.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }
    if (btnShowCreate && overlayCreate && popupCreate) {
        btnShowCreate.onclick = function() {
            overlayCreate.style.display = 'block';
            popupCreate.style.display = 'block';
            document.body.classList.add('modal-open');
        };
    }
    if (closeCreateBtn) closeCreateBtn.onclick = closeCreatePopup;
    if (overlayCreate) overlayCreate.onclick = closeCreatePopup;

    // Sự kiện submit form tạo mới nhân viên (ẩn popup và overlay khi xong) - Đặt sau khi đã khai báo các biến overlayCreate, popupCreate
    const createForm = document.getElementById('create-employee-form');
    if (createForm && overlayCreate && popupCreate) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('create-name').value.trim();
            const age = Number(document.getElementById('create-age').value);
            const email = document.getElementById('create-email').value.trim();
            const position = document.getElementById('create-position').value.trim();
            const department = document.getElementById('create-department').value.trim();
            const id = Date.now();
            addEmployee(id, name, age, position, department);
            alert('Đã thêm nhân viên mới!');
            createForm.reset();
            overlayCreate.style.display = 'none';
            popupCreate.style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    }
    // In toàn bộ danh sách ban đầu
    renderEmployeeTable(manager.getAll());
    // Gắn sự kiện tìm kiếm
    const searchForm = document.getElementById('search-employee-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = document.getElementById('search-query').value;
            const results = searchEmployees(query);
            renderEmployeeTable(results);
        });
    }
        // mở popup lọc
    document.getElementById('filter-employee-btn').addEventListener('click', () => {
        document.getElementById('filter-employee-overlay').style.display = 'block';
        document.getElementById('filter-employee-popup').style.display = 'block';
    });

    // đóng popup lọc
    document.getElementById('close-filter-form').addEventListener('click', closeFilterPopup);
    document.getElementById('filter-employee-overlay').addEventListener('click', closeFilterPopup);

    function closeFilterPopup() {
        document.getElementById('filter-employee-overlay').style.display = 'none';
        document.getElementById('filter-employee-popup').style.display = 'none';
    }

   // xử lý submit form lọc
    document.getElementById('filter-employee-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('filter-name').value.trim().toLowerCase();
        const age = Number(document.getElementById('filter-age').value);
        const email = document.getElementById('filter-email').value.trim().toLowerCase();
        const position = document.getElementById('filter-position').value.trim().toLowerCase();
        const department = document.getElementById('filter-department').value.trim().toLowerCase();

        // 🔹 đọc thêm field sắp xếp theo tuổi
        const ageOrder = document.getElementById('filter-age-order').value;

        let results = manager.getAll().filter(emp => {
            return (!name || emp.name.toLowerCase().includes(name)) &&
                (!age || emp.age >= age) &&
                (!email || emp.email.toLowerCase().includes(email)) &&
                (!position || emp.position.toLowerCase().includes(position)) &&
                (!department || emp.department.toLowerCase().includes(department));
        });

        // 🔹 sắp xếp theo tuổi nếu có chọn
        if (ageOrder === "asc") {
            results.sort((a, b) => a.age - b.age);
        } else if (ageOrder === "desc") {
            results.sort((a, b) => b.age - a.age);
        }

        renderEmployeeTable(results);
        closeFilterPopup();
    });
});
// --- Lấy các phần tử cần thiết ---
const sortBtn = document.getElementById('sort-employee-btn'); // nút mở popup (bạn nhớ có trong HTML)
const sortOverlay = document.getElementById('sort-employee-overlay');
const sortPopup = document.getElementById('sort-employee-popup');
const closeSortBtn = document.getElementById('close-sort-form');
const sortForm = document.getElementById('sort-employee-form');

// --- Mở popup khi bấm nút "Sắp xếp nhân viên" ---
if (sortBtn) {
    sortBtn.addEventListener('click', () => {
        sortOverlay.style.display = 'block';
        sortPopup.style.display = 'block';
    });
}

// --- Đóng popup khi bấm nút "Huỷ" ---
if (closeSortBtn) {
    closeSortBtn.addEventListener('click', () => {
        sortOverlay.style.display = 'none';
        sortPopup.style.display = 'none';
    });
}

// --- Đóng popup khi click ra ngoài (overlay) ---
if (sortOverlay) {
    sortOverlay.addEventListener('click', () => {
        sortOverlay.style.display = 'none';
        sortPopup.style.display = 'none';
    });
}

// --- Xử lý khi submit form sắp xếp ---
if (sortForm) {
    sortForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const field = document.getElementById('sort-field').value;
        const order = document.getElementById('sort-order').value;

        // Lấy danh sách nhân viên (giả sử bạn đang lưu ở localStorage)
        let employees = JSON.parse(localStorage.getItem('employees') || '[]');

        // Hàm sắp xếp
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

        // Lưu lại và render ra giao diện
        localStorage.setItem('employees', JSON.stringify(employees));
        if (typeof renderEmployeeList === 'function') {
            renderEmployeeList();
        }

        // Đóng popup sau khi sắp xếp
        sortOverlay.style.display = 'none';
        sortPopup.style.display = 'none';
    });
}
