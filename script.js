// Get references to DOM elements
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');

// Function to load tasks from local storage
function loadTasks() {
    try {
        const tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
        if (tasks.length === 0) {
            taskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
        } else {
            tasks.forEach(task => addTaskToDOM(task.text, task.completed));
        }
        console.log('Loaded tasks:', tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        taskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
    }
}

// Function to save tasks to local storage
function saveTasks() {
    try {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.classList.contains('completed')
            });
        });
        localStorage.setItem('dailyTasks', JSON.stringify(tasks));
        console.log('Saved tasks:', tasks);
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

// Function to add a task to the DOM
function addTaskToDOM(taskText, isCompleted = false) {
    console.log('addTaskToDOM called with:', taskText, isCompleted);
    // Clear empty state if it exists
    if (taskList.querySelector('.empty-state')) {
        taskList.innerHTML = '';
    }

    const listItem = document.createElement('div');
    listItem.classList.add('task-item');
    if (isCompleted) {
        listItem.classList.add('completed');
    }

    // Checkbox container
    const checkboxContainer = document.createElement('label');
    checkboxContainer.classList.add('checkbox-container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;
    checkbox.addEventListener('change', () => {
        listItem.classList.toggle('completed');
        saveTasks();
    });

    const checkmark = document.createElement('span');
    checkmark.classList.add('checkmark');

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    // Task text
    const textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    if (isCompleted) {
        textSpan.classList.add('completed');
    }
    textSpan.textContent = taskText;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '×';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => {
        listItem.remove();
        saveTasks();
        // Show empty state if no tasks left
        if (taskList.children.length === 0) {
            taskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
        }
    });

    listItem.appendChild(checkboxContainer);
    listItem.appendChild(textSpan);
    listItem.appendChild(deleteBtn);
    taskList.appendChild(listItem);
}

// Event listener for adding a new task
addTaskBtn.addEventListener('click', () => {
    const taskText = newTaskInput.value.trim();
    console.log('Add button clicked, task text:', taskText);
    if (taskText !== '') {
        console.log('Adding task to DOM:', taskText);
        addTaskToDOM(taskText);
        saveTasks();
        newTaskInput.value = '';
    } else {
        console.log('Empty task text, not adding');
    }
});

// Allow adding tasks with Enter key
newTaskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTaskBtn.click();
    }
});

// Event listener for clearing all tasks
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all tasks?')) {
        taskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
        saveTasks();
    }
});

// Load tasks when the popup opens
document.addEventListener('DOMContentLoaded', loadTasks); 