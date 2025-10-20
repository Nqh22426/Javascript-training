class TodoList {
    constructor() {
        this.inputBox = document.getElementById("input-box");
        this.addBtn = document.getElementById("add-btn");
        this.taskList = document.getElementById("task-list");
        
        // Khởi tạo các event listeners
        this.init();
    }

    // Khởi tạo ứng dụng
    init() {
        this.addBtn.addEventListener("click", () => this.addTask());
        this.taskList.addEventListener("click", (e) => this.handleTaskAction(e));
        this.displayTasks();
    }

    // Thêm task mới
    addTask() {
        if(this.inputBox.value === "") {
            alert("Please type your task!");
            return;
        }
        
        // Tạo task
        let li = document.createElement("li");
        li.innerHTML = this.inputBox.value;
        this.taskList.appendChild(li);

        // Tạo nút delete
        let span = document.createElement("span");
        span.innerHTML = "delete";
        li.appendChild(span);

        // Xóa input và lưu vào storage
        this.inputBox.value = "";
        this.saveTasks();
    }

    // Xử lý các hành động với task
    handleTaskAction(e) {
        if(e.target.tagName === "LI") {
            // Đánh dấu task
            e.target.classList.toggle("completed");
            this.saveTasks();
        }
        else if(e.target.tagName === "SPAN") {
            // Xóa task
            e.target.parentElement.remove();
            this.saveTasks();
        }
    }

    // Lưu danh sách task vào localStorage
    saveTasks() {
        localStorage.setItem("data", this.taskList.innerHTML);
    }

    // Hiển thị danh sách task từ localStorage
    displayTasks() {
        const savedData = localStorage.getItem("data");
        if(savedData) {
            this.taskList.innerHTML = savedData;
        }
    }
}

// Khởi tạo ứng dụng Todo List
const myTodoList = new TodoList();