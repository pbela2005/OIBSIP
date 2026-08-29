const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task-btn");

const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");

const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");


let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


// ------------------------------------
// Save tasks to localStorage
// ------------------------------------

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );
}


// ------------------------------------
// Add a new task
// ------------------------------------

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task.");

        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false,

        createdAt: new Date().toLocaleString()

    };


    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


// ------------------------------------
// Render tasks
// ------------------------------------

function renderTasks() {

    pendingList.innerHTML = "";

    completedList.innerHTML = "";


    const pendingTasks =
        tasks.filter(task => !task.completed);

    const completedTasks =
        tasks.filter(task => task.completed);


    // Pending count

    pendingCount.textContent =
        `${pendingTasks.length} pending`;


    // Completed count

    completedCount.textContent =
        `${completedTasks.length} completed`;


    // Empty pending list

    if (pendingTasks.length === 0) {

        pendingList.innerHTML = `
            <p class="empty-message">
                No pending tasks. You're all caught up! 🎉
            </p>
        `;

    } else {

        pendingTasks.forEach(task => {

            pendingList.appendChild(
                createTaskElement(task)
            );

        });
    }


    // Empty completed list

    if (completedTasks.length === 0) {

        completedList.innerHTML = `
            <p class="empty-message">
                No completed tasks yet.
            </p>
        `;

    } else {

        completedTasks.forEach(task => {

            completedList.appendChild(
                createTaskElement(task)
            );

        });
    }
}


// ------------------------------------
// Create task HTML
// ------------------------------------

function createTaskElement(task) {

    const taskItem =
        document.createElement("div");

    taskItem.className =
        "task-item";

    if (task.completed) {

        taskItem.classList.add("completed");
    }


    const content =
        document.createElement("div");

    content.className =
        "task-content";


    const text =
        document.createElement("span");

    text.className =
        "task-text";

    text.textContent =
        task.text;


    const time =
        document.createElement("small");

    time.className =
        "task-time";

    time.textContent =
        `Added: ${task.createdAt}`;


    content.appendChild(text);

    content.appendChild(time);


    // Actions

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    // Complete button

    const completeButton =
        document.createElement("button");

    completeButton.className =
        "complete-btn";

    completeButton.textContent =
        task.completed
            ? "Undo"
            : "Complete";


    completeButton.addEventListener(
        "click",
        () => toggleTask(task.id)
    );


    // Edit button

    const editButton =
        document.createElement("button");

    editButton.className =
        "edit-btn";

    editButton.textContent =
        "Edit";


    editButton.addEventListener(
        "click",
        () => editTask(task.id)
    );


    // Delete button

    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "delete-btn";

    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );


    actions.appendChild(completeButton);

    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    taskItem.appendChild(content);

    taskItem.appendChild(actions);


    return taskItem;
}


// ------------------------------------
// Mark task complete / pending
// ------------------------------------

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;

    });


    saveTasks();

    renderTasks();
}


// ------------------------------------
// Edit task
// ------------------------------------

function editTask(id) {

    const task =
        tasks.find(task => task.id === id);


    if (!task) {
        return;
    }


    const newText =
        prompt("Edit your task:", task.text);


    if (newText === null) {
        return;
    }


    const trimmedText =
        newText.trim();


    if (trimmedText === "") {

        alert("Task cannot be empty.");

        return;
    }


    task.text = trimmedText;


    saveTasks();

    renderTasks();
}


// ------------------------------------
// Delete task
// ------------------------------------

function deleteTask(id) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");


    if (!confirmed) {
        return;
    }


    tasks =
        tasks.filter(task => task.id !== id);


    saveTasks();

    renderTasks();
}


// ------------------------------------
// Add task button
// ------------------------------------

addTaskButton.addEventListener(
    "click",
    addTask
);


// ------------------------------------
// Enter key support
// ------------------------------------

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();
        }

    }
);


// ------------------------------------
// Initial load
// ------------------------------------

renderTasks();