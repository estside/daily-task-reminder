// Get references to DOM elements
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const taskType = document.getElementById('taskType');
const targetInput = document.getElementById('targetInput');
const recurringTaskList = document.getElementById('recurringTaskList');
const otherTaskList = document.getElementById('otherTaskList');
const targetTaskList = document.getElementById('targetTaskList');
const lyricDiv = document.getElementById('lyric');
// Show/hide target input based on type
taskType.addEventListener('change', () => {
    if (taskType.value === 'target') {
        targetInput.style.display = '';
    } else {
        targetInput.style.display = 'none';
    }
});

// J. Cole lyrics
const jcoleLyrics = [
    "No such thing as a life that's better than yours.",
    "Love yourself, girl, or nobody will.",
    "Keep grindin', your life can change in one year.",
    "If you ain't aim too high, then you aim too low.",
    "Anything's possible, you gotta dream like you've never seen obstacles.",
    "I put my hand to the sky, I sing grateful for the blessings you bring.",
    "There's beauty in the struggle, ugliness in the success.",
    "The bad news is nothing lasts forever, the good news is nothing lasts forever.",
    "To appreciate the sun, you gotta know what rain is.",
    "Life is all about the evolution."
];

function showRandomLyric() {
    if (lyricDiv) {
        const idx = Math.floor(Math.random() * jcoleLyrics.length);
        lyricDiv.textContent = '"' + jcoleLyrics[idx] + '"';
    }
}

// Function to load tasks from local storage
function loadTasks() {
    try {
        const tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
        recurringTaskList.innerHTML = '';
        otherTaskList.innerHTML = '';
        targetTaskList.innerHTML = '';
        if (tasks.length === 0) {
            recurringTaskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
            otherTaskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
            targetTaskList.innerHTML = '<div class="empty-state">No target tasks yet. Add one above!"</div>';
        } else {
            let hasRecurring = false, hasOther = false, hasTarget = false;
            tasks.forEach(task => {
                if (task.type === 'recurring') {
                    addTaskToDOM(task.text, task.completed, 'recurring');
                    hasRecurring = true;
                } else if (task.type === 'target') {
                    addTaskToDOM(task.text, task.completed, 'target', task.target, task.done);
                    hasTarget = true;
                } else {
                    addTaskToDOM(task.text, task.completed, 'other');
                    hasOther = true;
                }
            });
            if (!hasRecurring) recurringTaskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
            if (!hasOther) otherTaskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
            if (!hasTarget) targetTaskList.innerHTML = '<div class="empty-state">No target tasks yet. Add one above!</div>';
        }
        console.log('Loaded tasks:', tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        recurringTaskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
        otherTaskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
        targetTaskList.innerHTML = '<div class="empty-state">No target tasks yet. Add one above!</div>';
    }
}

// Function to save tasks to local storage
function saveTasks() {
    try {
        const tasks = [];
        recurringTaskList.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.classList.contains('completed'),
                type: 'recurring'
            });
        });
        otherTaskList.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.classList.contains('completed'),
                type: 'other'
            });
        });
        targetTaskList.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.classList.contains('completed'),
                type: 'target',
                target: parseInt(item.getAttribute('data-target'), 10),
                done: parseInt(item.getAttribute('data-done'), 10)
            });
        });
        localStorage.setItem('dailyTasks', JSON.stringify(tasks));
        console.log('Saved tasks:', tasks);
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

// Function to add a task to the DOM
function addTaskToDOM(taskText, isCompleted = false, type = 'recurring', target = 1, done = 0) {
    let list;
    if (type === 'recurring') list = recurringTaskList;
    else if (type === 'other') list = otherTaskList;
    else list = targetTaskList;
    if (list.querySelector('.empty-state')) {
        list.innerHTML = '';
    }

    const listItem = document.createElement('div');
    listItem.classList.add('task-item');
    if (isCompleted) {
        listItem.classList.add('completed');
    }

    if (type === 'target') {
        listItem.setAttribute('data-target', target);
        listItem.setAttribute('data-done', done);
    }

    // Checkbox container (for recurring/other)
    if (type !== 'target') {
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
        listItem.appendChild(checkboxContainer);
    }

    // Task text
    const textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    if (isCompleted) {
        textSpan.classList.add('completed');
    }
    textSpan.textContent = taskText;
    listItem.appendChild(textSpan);

    // Target progress (for target tasks)
    if (type === 'target') {
        const progress = document.createElement('span');
        progress.style.marginLeft = '10px';
        progress.style.fontSize = '13px';
        progress.style.color = '#6366f1';
        function updateProgress() {
            const now = new Date();
            const hoursLeft = 23 - now.getHours();
            const minsLeft = 59 - now.getMinutes();
            progress.textContent = ` (${done}/${target} done, ${target - done} left, ${hoursLeft}h ${minsLeft}m left)`;
            if (done >= target) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
        }
        updateProgress();
        listItem.appendChild(progress);

        // Decrement button
        const decBtn = document.createElement('button');
        decBtn.textContent = '-';
        decBtn.title = 'Decrease done count';
        decBtn.style.marginLeft = '10px';
        decBtn.style.background = '#6366f1';
        decBtn.style.color = 'white';
        decBtn.style.border = 'none';
        decBtn.style.borderRadius = '4px';
        decBtn.style.padding = '2px 8px';
        decBtn.style.cursor = 'pointer';
        decBtn.addEventListener('click', () => {
            if (done > 0) {
                done--;
                listItem.setAttribute('data-done', done);
                updateProgress();
                saveTasks();
            }
        });
        listItem.appendChild(decBtn);

        // Increment button
        const incBtn = document.createElement('button');
        incBtn.textContent = '+';
        incBtn.title = 'Mark one as done';
        incBtn.style.marginLeft = '5px';
        incBtn.style.background = '#6366f1';
        incBtn.style.color = 'white';
        incBtn.style.border = 'none';
        incBtn.style.borderRadius = '4px';
        incBtn.style.padding = '2px 8px';
        incBtn.style.cursor = 'pointer';
        incBtn.addEventListener('click', () => {
            if (done < target) {
                done++;
                listItem.setAttribute('data-done', done);
                updateProgress();
                saveTasks();
            }
        });
        listItem.appendChild(incBtn);
    }

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '×';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => {
        listItem.remove();
        saveTasks();
        if (list.children.length === 0) {
            if (type === 'recurring') list.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
            else if (type === 'other') list.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
            else list.innerHTML = '<div class="empty-state">No target tasks yet. Add one above!</div>';
        }
    });
    listItem.appendChild(deleteBtn);
    list.appendChild(listItem);
}

// Event listener for adding a new task

addTaskBtn.addEventListener('click', () => {
    const taskText = newTaskInput.value.trim();
    const type = taskType.value;
    if (taskText !== '') {
        if (type === 'target') {
            const target = parseInt(targetInput.value, 10) || 1;
            addTaskToDOM(taskText, false, 'target', target, 0);
            targetInput.value = '';
        } else {
            addTaskToDOM(taskText, false, type);
        }
        saveTasks();
        newTaskInput.value = '';
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
        recurringTaskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
        otherTaskList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
        targetTaskList.innerHTML = '<div class="empty-state">No target tasks yet. Add one above!</div>';
        saveTasks();
    }
});

// Load tasks and start reminder when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    showRandomLyric();
    loadTasks();
    // Start periodic reminder check
    setInterval(() => {
        try {
            const tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
            const hasIncomplete = tasks.some(task => !task.completed);
            if (tasks.length > 0 && hasIncomplete) {
                // Only show one alert at a time
                if (!window._reminderPopupShown) {
                    window._reminderPopupShown = true;
                    alert('Reminder: You have incomplete tasks!');
                    // Reset flag after alert closes
                    setTimeout(() => { window._reminderPopupShown = false; }, 1000);
                }
            }
        } catch (e) {
            // Ignore errors
        }
    }, 60 * 1000); // Check every 60 seconds
});