// Initialise the taskManager object
const taskManager = new TaskManager(0);

// Select the New Task Form
const newTaskForm = document.querySelector('#btn-add-task');

// New task event listener
newTaskForm.addEventListener('click', event => {
  event.preventDefault();

  // New task values template
  const newTaskNameInput = document.querySelector('#newTaskNameInput');
  const name = newTaskNameInput.value;
  const taskId = taskManager.tasks.length;
  const type = '';
  const description = '';
  const assignedTo = '';
  const priority = '';
  const dueDate = '';

  taskManager.addTask(taskId, type, name, description, assignedTo, priority, dueDate);

  // Render the tasks
  taskManager.render();
  
  // Clear newTaskNameInput value
  newTaskNameInput.value = '';
});

// Delete button event listener
document.body.addEventListener('click', function (event) {
  if (event.target.classList == 'bin') {
    taskManager.deleteTask(this.taskId);
    taskManager.render();
  };
});

// Show/hide intro message
document.body.addEventListener('click', function (event) {
  if (event.target.id == 'btn-add-task' || event.target.classList == 'bin') {
    if (taskManager.tasks.length > 0) {
      // Remove class from container (displays intro message)
      const taskList = document.getElementById("taskList");
      taskList.classList.remove("taskList");
    } else {
      taskList.classList.add("taskList");
      taskList.innerHTML = `<div id="intro">
          You currently have no tasks added. Click the green '+' button to add a task.
        </div>`;
    }
  };
});

// Enter button in new task field adds new task
newTaskNameInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    newTaskForm.click();
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
});

// Clicking 'Save' button updates the task description
document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('desc-save')) {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskDescription(taskId, event.target.previousElementSibling.value)
    event.target.style.display = 'none';
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
  }
});

// Enter button updates the task description
document.body.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && event.target.placeholder === 'Description..') {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskDescription(taskId, event.target.value);
    event.target.nextElementSibling.style.display = "none";
    event.target.blur();
  }
});

// Display description value from array in description field
document.body.addEventListener('click', function (event) {
  if (event.target.innerText === '...') {
    let taskId = event.target.id.replace(/\D/g, '');
    event.target.parentNode.nextElementSibling.children[0].value = taskManager.tasks[taskId].taskDescription;
  }
});
