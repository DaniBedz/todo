import { TaskManager } from './taskManager.js';
import alertifySettings from './alertify.js'

// Initialise the taskManager object
const taskManager = new TaskManager();

// Get uid & load tasks from Firestore
auth.onAuthStateChanged(user => {
  if (user) {
    localStorage.setItem("uid", user.uid);
    // Load tasks from Firebase into local storage
    taskManager.loadFromFB();
    
    // Load customAssignees from Firebase into local storage
    taskManager.loadCustomAssigneesFromFB().then(() => {
      if (taskManager.tasks.length > 0) {
        taskManager.render();
        initDivMouseOver();
      }
    })
  }
});

// Handles display of intro div
function displayIntro() {
  const taskList = document.getElementById("taskList");
  if (taskManager.tasks.length > 0 && taskList.classList.contains("taskList")) {
    // Remove class from container (hides intro message)
    taskList.classList.remove("taskList");
  } else if (taskManager.tasks.length === 0 && !taskList.classList.contains("taskList")) {
    taskList.classList.add("taskList");
    taskList.innerHTML = `<div id="intro">You currently have no tasks added.<br><br>Click the green '+' button to add a task.</div>`;
  }
};
window.displayIntro = displayIntro;

// Hide loading div
function hideLoadingDiv() {
  const div = document.getElementById('loading');
  div.style.display = 'none';
}
window.hideLoadingDiv = hideLoadingDiv;

// Show notification if successful signin & initialise taskUp/taskDown events
window.onload = () => {
  setTimeout(() => {
    if (localStorage.isFirstLogin == 1) {
      alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Thanks for signing up! I hope this is useful.</strong>`, `success`, 5);
      localStorage.isFirstLogin = 0;
    } else {
        alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Welcome back!</strong>`, `success`, 3)
      }
    }, 1000);
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
    taskManager.addTask('work', 'Complete client report 📈', 'Include final figures for Mr Yamamoto', 'Dani', 'high', 'in-progress', 'Fri 22/01/21');
    taskManager.addTask('leisure', 'Stream on Twitch 🎮', 'Run competition with followers', 'Victoria', 'low', 'completed', 'Thu 28/01/21');
    taskManager.addTask('other', 'Fix boiler 🔧', 'Call plumber @ 2pm', 'Dani', 'medium', 'not-started', 'Wed 27/01/21');
    taskManager.addTask('none', 'Grocery shopping 🛒', 'Need milk, bread and tea', 'Victoria', 'low', 'none', 'Sat 30/01/21');
    taskManager.addTask('leisure', 'Go for a nice walk 🚶‍♀️', 'Albert park lake', 'Victoria', 'none', 'not-started', '');
    taskManager.addTask('none', 'Walk the dog 🐶', 'He loves it!', 'none', 'low', 'not-started', '');
    taskManager.save();
    taskManager.customAssigneesArray = ['Victoria', 'Dani'];
    localStorage.customAssignees = JSON.stringify(taskManager.customAssigneesArray);
    taskManager.saveCustomAssigneesToFB();
    taskManager.render();
    displayIntro();
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Test data added</strong>', 'success', 2);
    newTaskNameInput.value = '';
    return;
  }

  // Clear all tasks
  if (taskName === '!clear') {
    taskManager.tasks = [];
    taskManager.save();
    taskManager.render();
    displayIntro();
    alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Tasks Cleared</strong>', 'success', 2);
    newTaskNameInput.value = '';
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
    event.target.nextSibling.nextSibling.style.display = 'inline-block';
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

// Handle selector updates / customAssignees
document.body.addEventListener('click', function (event) {
  if (taskManager.tasks.length > 0) {
    if (event.target.innerHTML === '&nbsp;Edit&nbsp;' || event.target.id.includes('bs-select')) {
      let taskId = event.target.id.replace(/\D/g, '');
      if (event.target.id.includes('bs-select')) {
        taskId = event.target.childNodes[0].firstChild.id.replace(/\D/g, '');
      }
      alertify.prompt('Assignee Name:', '', function (evt, value) {
        if (value !== '' && customAssigneesArray.indexOf(value) == -1 && value.length < 11 && value != 'None') {
          taskManager.customAssigneesArray.push(value);
          localStorage.customAssignees = JSON.stringify(taskManager.customAssigneesArray);
          alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;New Assignee ${value} added!</strong>`, 'success', 2);
          taskManager.saveCustomAssigneesToFB();
          taskManager.updateAssignedTo(taskId, value);
          taskManager.render();
          return true;
        } else {
          if (value === '') {
            alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Unable to create assignee: </strong>&nbsp;Please enter a name.', 'error', 3);
          } else if (value.length > 10) {
            alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Unable to create assignee: </strong>&nbsp;Maximum name length is 10 characters', 'error', 3);
          } else if (customAssigneesArray.indexOf(value) !== -1 || value == 'None') {
            alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Unable to create assignee: </strong>&nbsp;Assignee already exists', 'error', 3);
          }
          taskManager.updateAssignedTo(taskId, taskManager.getTask(taskId).taskAssignedTo);
          taskManager.render();
          initDivMouseOver();
        }
      }).set('labels', { ok: 'Add New', cancel: 'Delete Existing' }).set('oncancel', function () {
        if (customAssigneesArray.indexOf(document.getElementsByClassName('ajs-input')[0].value) !== -1) {
          let taskId = event.target.id.replace(/\D/g, '');
          if (event.target.value === customAssigneesArray.indexOf(document.getElementsByClassName('ajs-input')[0].value)) {
            taskManager.updateAssignedTo(taskId, 'none');
          }
          customAssigneesArray.splice(customAssigneesArray.indexOf(document.getElementsByClassName('ajs-input')[0].value), 1);
          // Change existing deleted customAssignee to 'none'
          for (const task of taskManager.tasks) {
            if (task.taskAssignedTo === document.getElementsByClassName('ajs-input')[0].value) {
              task.taskAssignedTo = 'none';
            }
            taskManager.save();
          }
          localStorage.customAssignees = JSON.stringify(taskManager.customAssigneesArray);
          taskManager.saveCustomAssigneesToFB();
          taskManager.render();
          alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Assignee Deleted!</strong>', 'success', 2);
          return true;
        } else {
          alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error: </strong>&nbsp;Unable to delete assignee!', 'error', 3);
          return true;
        }
      }).set('reverseButtons', true).set({
        'onclose': function () {
          taskManager.render();
          return true;
        }
      });; 
    } else {
      let selectors = document.getElementsByClassName('selectpicker');
      for (let selector of selectors) {
        selector.addEventListener('change', event => {
          let taskId = event.target.id.replace(/\D/g, '');
          event.preventDefault();
          if (event.target.id.includes('type')) {
            taskManager.updateTaskType(taskId, event.target.value);
          } else if (event.target.id.includes('assigned')) {
            if (event.target.value !== 'add-new') {
              taskManager.updateAssignedTo(taskId, event.target.value);
            }
          } else if (event.target.id.includes('priority')) {
            taskManager.updatePriority(taskId, event.target.value);
          } else if (event.target.id.includes('status')) {
            taskManager.updateStatus(taskId, event.target.value);
          }
        })
      }
    }
  }
  initDivMouseOver();
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
// loginState 1 = logged in
// loginState 2 = expired
// loginState 3 = logged out intentionally
// loginState 0 = logged out, no messages to display

auth.onAuthStateChanged(user => {
  if (user) {
    localStorage.setItem("loginState", 1);
  } else if (localStorage.loginState == 3) {
    window.open('auth.html', '_self');

  } else {
    localStorage.setItem("loginState", 2);
    window.open('auth.html', '_self');
  }
});

// Logout
document.body.addEventListener('click', function (event) {
  if (event.target.id === 'log-out') {
    localStorage.setItem("loginState", 3);
    auth.signOut();
  }
});

window.initDivMouseOver = initDivMouseOver;