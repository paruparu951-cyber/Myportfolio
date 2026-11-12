// ========================================
// 1. SELECT HTML ELEMENTS
// ========================================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const pendingCount = document.getElementById("pending-count");

const filterButtons = document.querySelectorAll(".filter-btn");


// ========================================
// 2. APPLICATION STATE
// ========================================

// Get previously saved tasks from Local Storage

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Default filter
let currentFilter = "all";


// ========================================
// 3. SAVE TASKS TO LOCAL STORAGE
// ========================================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ========================================
// 4. DISPLAY TASKS
// ========================================

function renderTasks() {

    // Clear existing task elements
    taskList.innerHTML = "";

    // Filter tasks based on selected filter
    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });


    // Display empty message when no tasks exist
    if (filteredTasks.length === 0) {

        emptyMessage.classList.remove("hidden");

        if (tasks.length === 0) {
            emptyMessage.querySelector("h3").textContent = "No tasks yet!";
            emptyMessage.querySelector("p").textContent =
                "Add your first task and start being productive.";
        } else {
            emptyMessage.querySelector("h3").textContent = "No matching tasks!";
            emptyMessage.querySelector("p").textContent =
                "Try selecting another filter.";
        }

    } else {

        emptyMessage.classList.add("hidden");

    }


    // Dynamically create task elements
    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";

        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }


        // Task left section
        const taskLeft = document.createElement("div");

        taskLeft.className = "task-left";


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.text + " as completed"
        );


        // Task text
        const span = document.createElement("span");

        span.className = "task-text";

        span.textContent = task.text;


        // Add checkbox and text
        taskLeft.appendChild(checkbox);

        taskLeft.appendChild(span);


        // Task action buttons
        const taskActions = document.createElement("div");

        taskActions.className = "task-actions";


        // Edit button
        const editButton = document.createElement("button");

        editButton.className = "action-btn edit-btn";

        editButton.textContent = "Edit";

        editButton.dataset.action = "edit";

        editButton.setAttribute("aria-label", "Edit task");


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "action-btn delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.dataset.action = "delete";

        deleteButton.setAttribute("aria-label", "Delete task");


        // Add buttons
        taskActions.appendChild(editButton);

        taskActions.appendChild(deleteButton);


        // Add everything to the task item
        li.appendChild(taskLeft);

        li.appendChild(taskActions);


        // Add task to the list
        taskList.appendChild(li);

    });


    // Update statistics
    updateStatistics();

}


// ========================================
// 5. UPDATE TASK STATISTICS
// ========================================

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;


    totalCount.textContent = total;

    completedCount.textContent = completed;

    pendingCount.textContent = pending;

}


// ========================================
// 6. CREATE TASK
// ========================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();


    // Prevent empty tasks
    if (taskText === "") {
        return;
    }


    // Create new task object
    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    // Add task to array
    tasks.push(newTask);


    // Save and display
    saveTasks();

    renderTasks();


    // Clear input
    taskInput.value = "";

    taskInput.focus();

});


// ========================================
// 7. EVENT DELEGATION
// ========================================

// Handle checkbox changes using the parent list

taskList.addEventListener("change", function(event) {

    if (event.target.classList.contains("task-checkbox")) {

        const taskItem = event.target.closest(".task-item");

        const taskId = Number(taskItem.dataset.id);


        // Find the selected task
        const task = tasks.find(function(task) {

            return task.id === taskId;

        });


        if (task) {

            task.completed = event.target.checked;

            saveTasks();

            renderTasks();

        }

    }

});


// Handle Edit and Delete button clicks

taskList.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }


    const taskItem = button.closest(".task-item");

    const taskId = Number(taskItem.dataset.id);


    // ========================================
    // 8. UPDATE TASK
    // ========================================

    if (button.dataset.action === "edit") {

        const task = tasks.find(function(task) {

            return task.id === taskId;

        });


        if (task) {

            const updatedText = prompt(
                "Edit your task:",
                task.text
            );


            // Save only if user enters valid text
            if (updatedText !== null && updatedText.trim() !== "") {

                task.text = updatedText.trim();

                saveTasks();

                renderTasks();

            }

        }

    }


    // ========================================
    // 9. DELETE TASK
    // ========================================

    if (button.dataset.action === "delete") {

        tasks = tasks.filter(function(task) {

            return task.id !== taskId;

        });


        saveTasks();

        renderTasks();

    }

});


// ========================================
// 10. TASK FILTERING
// ========================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Highlight selected filter
        button.classList.add("active");


        // Update current filter
        currentFilter = button.dataset.filter;


        // Display filtered tasks
        renderTasks();

    });

});


// ========================================
// 11. INITIALIZE APPLICATION
// ========================================

// Load saved tasks when page opens

renderTasks();
