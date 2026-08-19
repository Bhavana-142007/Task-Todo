/* =========================================================
   TASKFLOW
   JavaScript Logic & State Management
========================================================= */


/* =========================================================
   1. APPLICATION STATE
========================================================= */

const STORAGE_KEY = "bhavana-taskflow-tasks";

let tasks = loadTasks();

let currentFilter = "all";


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

const taskForm =
    document.querySelector("#task-form");

const taskInput =
    document.querySelector("#task-input");

const taskList =
    document.querySelector("#task-list");

const emptyState =
    document.querySelector("#empty-state");

const taskCount =
    document.querySelector("#task-count");

const taskLabel =
    document.querySelector("#task-label");

const clearCompletedButton =
    document.querySelector("#clear-completed");

const filterButtons =
    document.querySelectorAll(".filter-button");


/* =========================================================
   3. LOAD DATA FROM LOCAL STORAGE
========================================================= */

function loadTasks() {

    try {

        const savedTasks =
            localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const parsedTasks =
            JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks;

    } catch (error) {

        console.error(
            "Unable to load tasks:",
            error
        );

        return [];
    }
}


/* =========================================================
   4. SAVE DATA TO LOCAL STORAGE
========================================================= */

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}


/* =========================================================
   5. CREATE UNIQUE ID
========================================================= */

function createTaskId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


/* =========================================================
   6. CREATE TASK
========================================================= */

function addTask(text) {

    const cleanText =
        text.trim();

    if (!cleanText) {
        return;
    }


    const newTask = {

        id: createTaskId(),

        text: cleanText,

        completed: false,

        createdAt: Date.now()
    };


    tasks.unshift(newTask);

    saveTasks();

    renderTasks();
}


/* =========================================================
   7. READ / DISPLAY TASKS
========================================================= */

function getFilteredTasks() {

    switch (currentFilter) {

        case "active":

            return tasks.filter(
                task => !task.completed
            );


        case "completed":

            return tasks.filter(
                task => task.completed
            );


        default:

            return tasks;
    }
}


function renderTasks() {

    const filteredTasks =
        getFilteredTasks();


    /* Clear existing DOM */

    taskList.innerHTML = "";


    /* Create task elements dynamically */

    filteredTasks.forEach(task => {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(
            taskElement
        );
    });


    updateEmptyState(
        filteredTasks.length
    );


    updateTaskCount();
}


/* =========================================================
   8. CREATE DOM ELEMENT FOR TASK
========================================================= */

function createTaskElement(task) {

    const li =
        document.createElement("li");

    li.className = "task-item";

    li.dataset.id = task.id;


    if (task.completed) {

        li.classList.add(
            "completed"
        );
    }


    /* Checkbox */

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className =
        "task-checkbox";

    checkbox.dataset.action =
        "toggle";

    checkbox.checked =
        task.completed;

    checkbox.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task as active"
            : "Mark task as completed"
    );


    /* Task text */

    const text =
        document.createElement("span");

    text.className =
        "task-text";

    text.textContent =
        task.text;


    /* Action buttons */

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.className =
        "task-action";

    editButton.dataset.action =
        "edit";

    editButton.textContent =
        "Edit";

    editButton.setAttribute(
        "aria-label",
        `Edit task: ${task.text}`
    );


    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "task-action delete";

    deleteButton.dataset.action =
        "delete";

    deleteButton.textContent =
        "Delete";

    deleteButton.setAttribute(
        "aria-label",
        `Delete task: ${task.text}`
    );


    actions.append(
        editButton,
        deleteButton
    );


    li.append(
        checkbox,
        text,
        actions
    );


    return li;
}


/* =========================================================
   9. UPDATE TASK
========================================================= */

function editTask(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );

    if (!task) {
        return;
    }


    const newText =
        window.prompt(
            "Edit your task:",
            task.text
        );


    if (newText === null) {
        return;
    }


    const cleanText =
        newText.trim();


    if (!cleanText) {

        window.alert(
            "Task cannot be empty."
        );

        return;
    }


    task.text =
        cleanText;


    saveTasks();

    renderTasks();
}


/* =========================================================
   10. DELETE TASK
========================================================= */

function deleteTask(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );

    if (!task) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${task.text}"?`
        );


    if (!confirmed) {
        return;
    }


    tasks =
        tasks.filter(
            item => item.id !== taskId
        );


    saveTasks();

    renderTasks();
}


/* =========================================================
   11. TOGGLE COMPLETED STATUS
========================================================= */

function toggleTask(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );

    if (!task) {
        return;
    }


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();
}


/* =========================================================
   12. UPDATE TASK COUNTER
========================================================= */

function updateTaskCount() {

    const activeTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    taskCount.textContent =
        activeTasks;


    taskLabel.textContent =
        activeTasks === 1
            ? "task left"
            : "tasks left";
}


/* =========================================================
   13. EMPTY STATE
========================================================= */

function updateEmptyState(count) {

    if (count === 0) {

        emptyState.hidden = false;

        if (currentFilter === "active") {

            emptyState.textContent =
                "Great! You have no active tasks.";

        } else if (
            currentFilter === "completed"
        ) {

            emptyState.textContent =
                "No completed tasks yet.";

        } else {

            emptyState.textContent =
                "No tasks yet. Add your first task above.";
        }

    } else {

        emptyState.hidden = true;
    }
}


/* =========================================================
   14. CLEAR COMPLETED
========================================================= */

function clearCompletedTasks() {

    const completedCount =
        tasks.filter(
            task => task.completed
        ).length;


    if (completedCount === 0) {

        window.alert(
            "There are no completed tasks to clear."
        );

        return;
    }


    tasks =
        tasks.filter(
            task => !task.completed
        );


    saveTasks();

    renderTasks();
}


/* =========================================================
   15. CHANGE FILTER
========================================================= */

function changeFilter(filter) {

    currentFilter =
        filter;


    filterButtons.forEach(button => {

        const isActive =
            button.dataset.filter === filter;


        button.classList.toggle(
            "active",
            isActive
        );


        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });


    renderTasks();
}


/* =========================================================
   16. FORM EVENT
========================================================= */

taskForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        addTask(
            taskInput.value
        );


        taskInput.value = "";

        taskInput.focus();
    }
);


/* =========================================================
   17. EVENT DELEGATION
========================================================= */

/*
   Instead of adding a separate event listener
   to every Edit/Delete/Checkbox element,
   we listen once on the task list.
*/

taskList.addEventListener(
    "click",
    event => {

        const actionElement =
            event.target.closest(
                "[data-action]"
            );


        if (!actionElement) {
            return;
        }


        const taskItem =
            actionElement.closest(
                ".task-item"
            );


        if (!taskItem) {
            return;
        }


        const taskId =
            taskItem.dataset.id;


        const action =
            actionElement.dataset.action;


        switch (action) {

            case "edit":

                editTask(taskId);

                break;


            case "delete":

                deleteTask(taskId);

                break;
        }
    }
);


/* =========================================================
   18. CHECKBOX EVENT DELEGATION
========================================================= */

taskList.addEventListener(
    "change",
    event => {

        if (
            !event.target.matches(
                '[data-action="toggle"]'
            )
        ) {

            return;
        }


        const taskItem =
            event.target.closest(
                ".task-item"
            );


        if (!taskItem) {
            return;
        }


        toggleTask(
            taskItem.dataset.id
        );
    }
);


/* =========================================================
   19. FILTER EVENTS
========================================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            changeFilter(
                button.dataset.filter
            );
        }
    );
});


/* =========================================================
   20. CLEAR COMPLETED EVENT
========================================================= */

clearCompletedButton.addEventListener(
    "click",
    clearCompletedTasks
);


/* =========================================================
   21. INITIAL RENDER
========================================================= */

renderTasks();