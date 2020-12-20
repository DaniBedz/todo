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
  if (event.keyCode === 13) {
    event.preventDefault();
    newTaskForm.click();
  }
});


// Show/hide description
document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('more')) {
    if (event.target.parentNode.nextElementSibling.style.display === 'none') {
      event.target.parentNode.nextElementSibling.style.display = 'block';
    } else {
      event.target.parentNode.nextElementSibling.style.display = 'none';
    }
  }
});