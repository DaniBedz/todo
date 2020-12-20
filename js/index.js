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

// Clicking into task field changes ... button to "Save" button
document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('form-control')) {
    event.target.nextSibling.nextSibling.innerText = "Save";
    event.target.nextSibling.nextSibling.classList.add("save");
  }
});

// Show/hide description
document.body.addEventListener('click', function (event) {
  if (event.target.innerText === '...') {
    if (event.target.parentNode.nextElementSibling.style.display === 'none') {
      event.target.parentNode.nextElementSibling.style.display = 'block';
    } else {
      event.target.parentNode.nextElementSibling.style.display = 'none';
    }
  }
});

// Clicking "Save" button updates the task name
document.body.addEventListener('click', function (event) {
  if (event.target.innerText === 'Save') {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskName(taskId, event.target.previousElementSibling.value)
    event.target.classList.remove("save"); 
    event.target.innerText = '...';
  }
});

// Enter button updates the task name
document.body.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && event.target.classList.contains('form-control')) {
    let taskId = event.target.id.replace(/\D/g, '')
    taskManager.updateTaskName(taskId, event.target.value);
  }
});