import { TaskManager } from './taskManager.js';

// Initialise the taskManager object
const taskManager = new TaskManager();

// Get uid & load tasks from Firestore
auth.onAuthStateChanged(user => {
  if (user) {
    localStorage.setItem("uid", user.uid);
    // Load tasks from Firebase into local storage
    loadFromFB();
  }
});

// Handles display of intro div
function displayIntro() {
  const taskList = document.getElementById("taskList");
  if (taskManager.tasks.length > 0 && taskList.classList.contains("taskList")) {
    // Remove class from container (displays intro message)
    taskList.classList.remove("taskList");
  } else if (taskManager.tasks.length === 0 && !taskList.classList.contains("taskList")) {
    taskList.classList.add("taskList");
    taskList.innerHTML = `<div id="intro">You currently have no tasks added.<br><br>Click the green '+' button to add a task.</div>`;
  }
};

// Hide loading div
function hideLoadingDiv() {
  const div = document.getElementById('loading');
  div.style.display = 'none';
}

// Hide intro message if there are existing tasks stored in the array
window.onload = () => {
  // taskManager.render();
  initDivMouseOver();
};

// Show up/down arrows
function initDivMouseOver()   {
  let div = document.querySelectorAll('.task');
  for (let task of div) {
    let taskIndex = taskManager.findTask(task.id);
    task.onmouseover = function () { 
      if (taskIndex !== 0) {
        document.getElementById(`up${task.id}`).style.display = 'block';
      }
      if (taskIndex !== taskManager.tasks.length - 1) {
      document.getElementById(`down${task.id}`).style.display = 'block';
      }
      task.onmouseleave = function () { 
        document.getElementById(`up${task.id}`).style.display = 'none';
        document.getElementById(`down${task.id}`).style.display = 'none';
      }
    } 
  }
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
    displayIntro();
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Test data added</strong>', 'success', 2);
    return;
  }

  // Clear all tasks
  if (taskName === '!clear') {
    taskManager.tasks = [];
    taskManager.save();
    taskManager.render();
    displayIntro();
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Tasks Cleared</strong>', 'success', 2);
    return;
  }

  // Validation code
  if (taskName.length < 3) {
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;New task input invalid! </strong>&nbsp;Field must have more than 2 characters.', 'error', 5);
    return;
  } else {
    taskManager.addNode(taskName);
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Task Added</strong>', 'success', 2);
  }

  // Clear newTaskNameInput value
  newTaskNameInput.value = '';

  taskManager.render();
  displayIntro();

  // Initialise up/down arrows
  initDivMouseOver();
});

// Delete button event listener
document.body.addEventListener('click', function (event) {
  if (event.target.classList == 'bin') {
    let taskId = event.target.id.replace(/\D/g, '');
    taskManager.deleteNode(taskId);
    if (taskManager.tasks.length === 0) {
      displayIntro();
    }
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Task Deleted </strong>', 'success', 2);
    initDivMouseOver();
  }
});

// Enter button in new task field adds new task
newTaskNameInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    newTaskForm.click();
    newTaskNameInput.value = '';

    // Initialise up/down arrows
    initDivMouseOver();
    taskManager.save();
  }
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
  if (event.target.id.includes('descriptionBtn') && event.target.innerText === '...') {
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
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Task name updated</strong>', 'success', 2);
    taskManager.save();
  }
});

// Clicking 'Save' button updates the task description
document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('desc-save')) {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskDescription(taskId, event.target.previousElementSibling.value)
    event.target.style.display = 'none';
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Task description updated</strong>', 'success', 2);
    taskManager.save();
  }
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
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Task name updated</strong>', 'success', 2);
    taskManager.save();
  }
});

// Enter button updates the task description
document.body.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && event.target.placeholder === 'Description..') {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskDescription(taskId, event.target.value);
    event.target.nextElementSibling.style.display = "none";
    event.target.blur();
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Task description updated</strong>', 'success', 2);
    taskManager.save();
  }
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

// Reset all sorts apart from current sort
function resetSorts() {
  taskManager.taskNameOrder = true;
  taskManager.taskTypeOrder = true;
  taskManager.taskAssignedToOrder = true;
  taskManager.taskPriorityOrder = true;
  taskManager.taskStatusOrder = true;
  taskManager.taskDueDateOrder = true;
};

// Sort by taskName
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskHeader' && taskManager.taskNameOrder === true && taskManager.tasks.length > 0) {
    taskManager.sortByTaskNameAsc();
    initDivMouseOver();
    resetSorts();
    taskManager.taskNameOrder = false;
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskHeader' && taskManager.taskNameOrder === false && taskManager.tasks.length > 0) {
    taskManager.sortByTaskNameDsc();
    initDivMouseOver();
    resetSorts();
  }
  });

// Sort by taskType
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskType' && taskManager.taskTypeOrder === true  && taskManager.tasks.length > 0) {
    taskManager.sortByTaskTypeAsc();
    resetSorts();
    taskManager.taskTypeOrder = false;
    initDivMouseOver();

  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskType' && taskManager.taskTypeOrder === false  && taskManager.tasks.length > 0) {
    taskManager.sortByTaskTypeDsc();
    initDivMouseOver();
    resetSorts();
  }
});

// Sort by taskAssignedTo
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskAssignedTo' && taskManager.taskAssignedToOrder === true && taskManager.tasks.length > 0) {
    taskManager.sortByTaskAssignedToAsc();
    resetSorts();
    taskManager.taskAssignedToOrder = false;
    initDivMouseOver();
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskAssignedTo' && taskManager.taskAssignedToOrder === false && taskManager.tasks.length > 0) {
    taskManager.sortByTaskAssignedToDsc();
    initDivMouseOver();
    resetSorts();
  }
});

// Sort by taskPriority
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskPriority' && taskManager.taskPriorityOrder === true && taskManager.tasks.length > 0) {
    taskManager.sortByTaskPriorityAsc();
    resetSorts();
    taskManager.taskPriorityOrder = false;
    initDivMouseOver();
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskPriority' && taskManager.taskPriorityOrder === false && taskManager.tasks.length > 0) {
    taskManager.sortByTaskPriorityDsc();
    initDivMouseOver();
    resetSorts();
  }
});

// Sort by taskStatus
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskStatus' && taskManager.taskStatusOrder === true && taskManager.tasks.length > 0) {
    taskManager.sortByTaskStatusAsc();
    resetSorts();
    taskManager.taskStatusOrder = false;
    initDivMouseOver();
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskStatus' && taskManager.taskStatusOrder === false && taskManager.tasks.length > 0) {
    taskManager.sortByTaskStatusDsc();
    initDivMouseOver();
    resetSorts();
  }
});

// Sort by taskDueDate
document.body.addEventListener('click', function (event) {
  if (event.target.offsetParent && event.target.offsetParent.id === 'taskDueDate' && taskManager.taskDueDateOrder === true && taskManager.tasks.length > 0) {
    taskManager.sortByTaskDueDateAsc();
    resetSorts();
    taskManager.taskDueDateOrder = false;
    initDivMouseOver();
  }
  else if (event.target.offsetParent && event.target.offsetParent.id === 'taskDueDate' && taskManager.taskDueDateOrder === false && taskManager.tasks.length > 0) {
    taskManager.sortByTaskDueDateDsc();
    initDivMouseOver();
    resetSorts();
  }
});

// Move task up
document.body.addEventListener('click', function (event) {
  if (event.target.id.includes('up')) {
    let taskId = event.target.id.replace(/\D/g, '');
    let taskIndex = taskManager.findTask(taskId);
    if (taskIndex === 0) {
      return;
    }
    taskManager.tasks.move(taskIndex, taskIndex-1);
    taskManager.save();
    taskManager.render();
    initDivMouseOver();
  }
});

// Move task down
document.body.addEventListener('click', function (event) {
  if (event.target.id.includes('down')) {
    let taskId = event.target.id.replace(/\D/g, '');
    let taskIndex = taskManager.findTask(taskId);
    if (taskIndex === taskManager.tasks.length) {
      return;
    }
    taskManager.tasks.move(taskIndex, taskIndex+1);
    taskManager.save();
    taskManager.render();
    initDivMouseOver();
  }
});

// Make the taskManager Object globally available (ES6 module workaround)
window.taskManager = taskManager;

// Extend global Array object to include .move function (for reordering tasks)
Object.defineProperty(Array.prototype, 'move', {
    value: function (old_index, new_index) {
        while (old_index < 0) {
            old_index += this.length;
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this;
    }
});
      
// Check if user is logged in
auth.onAuthStateChanged(user => {
  if (user) {
    localStorage.setItem("loginState", 1);
  } else if (localStorage.loginState == 3) {
    location = 'auth.html'
  } else {
    localStorage.setItem("loginState", 2);
    location = 'auth.html'
  }
});

// Logout
document.body.addEventListener('click', function (event) {
  if (event.target.id === 'log-out') {
    localStorage.setItem("loginState", 3);
    auth.signOut();
  }
});

// Load from firestore
async function loadFromFB() {
  await fs.collection("todos").doc(`${localStorage.uid}`)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        hideLoadingDiv();
        localStorage.tasks = doc.data().tasks;
        taskManager.load();
        taskManager.render();
        if (taskManager.tasks.length === 0) {
          displayIntro();
        }
        initDivMouseOver();
      } else {
        // doc.data() will be undefined in this case
        console.log("Failed to load tasks");
      }
    }).catch(function (error) {
      console.log("Error getting tasks:", error);
    })
};

window.displayIntro = displayIntro;
window.loadFromFB = loadFromFB;
window.initDivMouseOver = initDivMouseOver;