import { TaskManager } from './taskManager.js';

// Initialise the taskManager object
const taskManager = new TaskManager();

// Load tasks object from local storage
if(localStorage.getItem('tasks')) {
  taskManager.load();
};

// Handles display of intro div
function displayIntro() {
  const taskList = document.getElementById("taskList");
  if (taskManager.tasks.length > 0 && taskList.classList.contains("taskList")) {
    // Remove class from container (displays intro message)
    taskList.classList.remove("taskList");
    taskManager.render();
  } else if (taskManager.tasks.length === 0 && !taskList.classList.contains("taskList")) {
    taskList.classList.add("taskList");
    taskList.innerHTML = `<div id="intro">You currently have no tasks added.<br><br>Click the green '+' button to add a task.</div>`;
  }
};

// Hide intro message if there are existing tasks stored in the array
window.onload = () => {
  taskManager.render();
  displayIntro();
};

// Select the New Task Form
const newTaskForm = document.querySelector('#btn-add-task');

// New task event listener
newTaskForm.addEventListener('click', event => {
  event.preventDefault();

  // New task values template
  const newTaskNameInput = document.querySelector('#newTaskNameInput');
  const taskName = newTaskNameInput.value;

  // Add test data
  if (taskName === '!test') {
    taskManager.addTask('work', 'Complete client report 📈', 'Include final figures for Mr Yamamoto', 'dani', 'high', 'in-progress', 'Fri 22/01/21');
    taskManager.addTask('leisure', 'Stream on Twitch 🎮', 'Run competition with followers', 'victoria', 'low', 'completed', 'Thu 28/01/21');
    taskManager.addTask('other', 'Fix boiler 🔧', 'Call plumber @ 2pm', 'dani', 'medium', 'not-started', 'Wed 27/01/21');
    taskManager.addTask('none', 'Grocery shopping 🛒', 'Need milk, bread and tea', 'victoria', 'low', 'none', 'Sat 30/01/21');
    taskManager.addTask('leisure', 'Go for a nice walk 🧍‍♀️', 'Albert park lake', 'victoria', 'none', 'not-started', '');
    taskManager.addTask('none', 'Walk the dog 🐶', 'He loves it!', 'none', 'low', 'not-started', '');
    taskManager.save();
    taskManager.render();
    return;
  }

  // Clear all tasks
  if (taskName === '!clear') {
    taskManager.tasks = [];
    taskManager.save();
    taskManager.render();
    return;
  }


  // Validation code
  if (taskName.length < 3) {
    const alert = document.getElementById('alertMessage');
    alert.style.display = 'block';
    setTimeout(() => {alert.style.display = 'none'}, 4000);
  } else {
    taskManager.addNode(taskName);

    // Clear newTaskNameInput value
    newTaskNameInput.value = '';
  }
});

// Delete button event listener
document.body.addEventListener('click', function (event) {
  if (event.target.classList == 'bin') {
    let taskId = event.target.id.replace(/\D/g, '');
    taskManager.deleteNode(taskId);
    displayIntro();
  }
});

// Show/hide intro message if task list is empty and add task is clicked
document.body.addEventListener('click', function (event) {
  if (event.target.id == 'btn-add-task') {
    displayIntro();
  };
});

// Show/hide intro message if task list is empty after clicking the bin icon
document.body.addEventListener("click", function (event) {
  if (event.target.classList == 'bin') {
    displayIntro();
  }
});

// Enter button in new task field adds new task
newTaskNameInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    newTaskForm.click();
    newTaskNameInput.value = '';
  }
  taskManager.save();
});

// Clicking into task field changes '...' button to 'Save' button
document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('form-control') && event.target.nextSibling.nextSibling.innerText === "...") {
    event.target.nextSibling.nextSibling.innerText = "Save";
    event.target.nextSibling.nextSibling.classList.add("save");
  }
});

// Show/hide description field
document.body.addEventListener('click', function (event) {
  if (event.target.innerText === '...') {
    if (event.target.parentNode.nextElementSibling.style.display === 'none') {
      event.target.parentNode.nextElementSibling.style.display = 'flex';
    } else {
      event.target.parentNode.nextElementSibling.style.display = 'none';
    }
  }
});

// Show/hide description save button
document.body.addEventListener('click', function (event) {
  if (event.target.placeholder == 'Description..') {
    event.target.nextSibling.nextSibling.style.display = 'flex';
  }
});

// Clicking 'Save' button updates the task name
document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('save')) {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskName(taskId, event.target.previousElementSibling.value)
    event.target.classList.remove("save"); 
    event.target.innerText = '...';
  }
  taskManager.save();
});

// Clicking 'Save' button updates the task description
document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('desc-save')) {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskDescription(taskId, event.target.previousElementSibling.value)
    event.target.style.display = 'none';
  }
  taskManager.save();
});

// Enter button updates the task name
document.body.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && event.target.placeholder === 'Type task name here..') {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskName(taskId, event.target.value);
    event.target.nextElementSibling.classList.contains('more');
    event.target.nextElementSibling.classList.remove("save");
    event.target.nextElementSibling.innerText = '...';
    event.target.blur();
  }
  taskManager.save();
});

// Enter button updates the task description
document.body.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && event.target.placeholder === 'Description..') {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskDescription(taskId, event.target.value);
    event.target.nextElementSibling.style.display = "none";
    event.target.blur();
  }
  taskManager.save();
});

// Display description value from array in description field
document.body.addEventListener('click', function (event) {
  if (event.target.id.includes('descriptionBtn')) {
    let taskId = event.target.id.replace(/\D/g, '');
    event.target.parentNode.nextElementSibling.children[0].value = taskManager.tasks[taskManager.findTask(taskId)].taskDescription;
  }
});

// Handle selector updates
document.body.addEventListener('click', function (event) {
  if (taskManager.tasks.length > 0) {
    let selectors = document.getElementsByClassName('selectpicker');
    for (let selector of selectors) {
      selector.addEventListener('change', event => {
        event.preventDefault();
        let taskId = event.target.id.replace(/\D/g, '');
        if (event.target.id.includes('type')) {
          taskManager.updateTaskType(taskId, event.target.value);
        } else if (event.target.id.includes('assigned')) {
          taskManager.updateAssignedTo(taskId, event.target.value);
        } else if (event.target.id.includes('priority')) {
          taskManager.updatePriority(taskId, event.target.value);
        } else if (event.target.id.includes('status')) {
          taskManager.updateStatus(taskId, event.target.value);
        } 
      })
    }
  }
});

// Sort by taskName
let taskNameOrder = true;
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskHeader' && taskNameOrder === true) {
    taskManager.sortByTaskNameAsc();
    taskNameOrder = false;
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskHeader' && taskNameOrder === false) {
    taskManager.sortByTaskNameDsc();
    taskNameOrder = true;
  }
});

// Sort by taskType
let taskTypeOrder = true;
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskType' && taskTypeOrder === true) {
    taskManager.sortByTaskTypeAsc();
    taskTypeOrder = false;
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskType' && taskTypeOrder === false) {
    taskManager.sortByTaskTypeDsc();
    taskTypeOrder = true;
  }
});

// Sort by taskAssignedTo
let taskAssignedToOrder = true;
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskAssignedTo' && taskAssignedToOrder === true) {
    taskManager.sortByTaskAssignedToAsc();
    taskAssignedToOrder = false;
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskAssignedTo' && taskAssignedToOrder === false) {
    taskManager.sortByTaskAssignedToDsc();
    taskAssignedToOrder = true;
  }
});

// Sort by taskPriority
let taskPriorityOrder = true;
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskPriority' && taskPriorityOrder === true) {
    taskManager.sortByTaskPriorityAsc();
    taskPriorityOrder = false;
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskPriority' && taskPriorityOrder === false) {
    taskManager.sortByTaskPriorityDsc();
    taskPriorityOrder = true;
  }
});

// Sort by taskStatus
let taskStatusOrder = true;
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskStatus' && taskStatusOrder === true) {
    taskManager.sortByTaskStatusAsc();
    taskStatusOrder = false;
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskStatus' && taskStatusOrder === false) {
    taskManager.sortByTaskStatusDsc();
    taskStatusOrder = true;
  }
});

// Sort by taskDueDate
let taskDueDateOrder = true;
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskDueDate' && taskDueDateOrder === true) {
    taskManager.sortByTaskDueDateAsc();
    taskDueDateOrder = false;
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskDueDate' && taskDueDateOrder === false) {
    taskManager.sortByTaskDueDateDsc();
    taskDueDateOrder = true;
  }
});

// Make the taskManager Object globally available (ES6 module workaround)
window.taskManager = taskManager;