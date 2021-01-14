export class TaskManager {
  constructor() {
    this.tasks = [];
  }

  // taskId creation
  taskIdGenerator() {
    let newTaskId;
    if (this.tasks[0] === undefined) {
      newTaskId = 1;
    } else {
      newTaskId = this.tasks.sort((a, b) => b.taskId - a.taskId)[0].taskId + 1
    }
    return newTaskId;
  }

  addTask(taskType = 'none', taskName = '', taskDescription = '', taskAssignedTo = 'none', taskPriority = 'none', taskStatus = 'none', taskDueDate = '') {
    const task = {
      taskId: this.taskIdGenerator(),
      taskType: taskType,
      taskName: taskName,
      taskDescription: taskDescription,
      taskAssignedTo: taskAssignedTo,
      taskPriority: taskPriority,
      taskStatus: taskStatus,
      taskDueDate: taskDueDate,
    };
    this.tasks.push(task);
    this.tasks.sort((a, b) => a.taskId - b.taskId);
    this.save();
  };
  
  // Return an array of all tasks
  getTasks() {
    return this.tasks;
  }

  // Get task by taskId
  getTask(taskId) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].taskId == taskId) {
        return this.tasks[i];
      }
    }
  }
    
  // Update task type
  updateTaskType(taskId, taskType) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskType = taskType;
    this.save();
  }
  
  // Update task name
  updateTaskName(taskId, taskName) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskName = taskName;
    this.save();
  }

  // Update task description
  updateTaskDescription(taskId, taskDescription) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskDescription = taskDescription;
    this.save();
  }
  
  // Update assignee
  updateAssignedTo(taskId, taskAssignedTo) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskAssignedTo = taskAssignedTo;
    this.save();
  }

  // Update priority
  updatePriority(taskId, taskPriority) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskPriority = taskPriority;
    this.save();
  }
  
  // Update status
  updateStatus(taskId, taskStatus) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskStatus = taskStatus;
    this.save();
  }
  
  // Update due date
  updateDueDate(taskId, taskDueDate) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskDueDate = taskDueDate;
    this.save();
  }

  // Delete Task
  deleteTask(taskId) {
    this.tasks.splice(this.findTask(taskId), 1);
    this.save();
  }

  // Find the index of the task in task array by taskId
  findTask(taskId) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].taskId == taskId) {
        return i;
      }
    }
  }

  // Initialises the date picker and handles updates
  getCalendar(taskManager) {
    let dateField = document.querySelectorAll('.date');
    dateField.flatpickr({
      enableTime: false,
      dateFormat: "D d/m/y",
      monthSelectorType: "static",
      disableMobile: true,
      onChange: function () {
        let taskId = this.input.id.replace(/\D/g, '');
        taskManager.updateDueDate(taskId, this.input.value);
      }
    })
  }

  // Local storage functions
  save() {
    if (localStorage.getItem('tasks')) {
      localStorage.removeItem('tasks');
    }
    const tasksJson = JSON.stringify(this.tasks);
    localStorage.setItem('tasks', tasksJson);
  }

  load() {
    const taskString = localStorage.getItem('tasks');
    const tasksJson = JSON.parse(taskString);
  
    tasksJson.map(eachTask => {
      const { taskType, taskName, taskDescription, taskAssignedTo, taskPriority, taskStatus, taskDueDate } = eachTask;
      this.addTask(taskType, taskName, taskDescription, taskAssignedTo, taskPriority, taskStatus, taskDueDate);
    })
  }

  // Show correct values for selectors / dueDate
  showValues(taskManager) {
    if (taskManager.tasks) {
      for (let i = 0; i < taskManager.tasks.length; i++) {
        let taskId = taskManager.tasks[i].taskId;
        document.querySelector(`#type${taskId}`).value = taskManager.tasks[i].taskType;
        document.querySelector(`#assigned${taskId}`).value = taskManager.tasks[i].taskAssignedTo;
        document.querySelector(`#priority${taskId}`).value = taskManager.tasks[i].taskPriority;
        document.querySelector(`#status${taskId}`).value = taskManager.tasks[i].taskStatus;
        document.querySelector(`#date${taskId}`).value = taskManager.tasks[i].taskDueDate;
      }
      $('.selectpicker').selectpicker('render');
    }
  }

  // Render the task list, initialise date pickers and selectors
  render() {
    // Create an array to store the tasks' HTML
    const tasksHtmlList = [];

    // Loop over our tasks and create the html, storing it in the array
    for (let i = 0; i < this.tasks.length; i++) {
      // Get the current task in the loop
      const task = this.tasks[i];

      // Create the task html
      const taskHtml = createTaskHtml(task.taskId, task.taskType, task.taskName, task.taskDescription, task.taskAssignedTo, task.taskPriority, task.taskStatus, task.taskueDate);

      // Push it to the tasksHtmlList array
      tasksHtmlList.push(taskHtml);
    }

    // Create the tasksHtml by joining each item in the tasksHtmlList with a new line in between each item.
    // Set the inner html of the tasksList on the page
    document.querySelector('#taskList').innerHTML = tasksHtmlList.join('\n');
    
    // Show correct values for selectors / dueDate
    this.showValues(this);

    // Make dueDate field clickable
    this.getCalendar(this);

    // Make selectors active
    $('select').selectpicker();
  }

  // Add child node, rather than a full render
  addNode(taskName) {
    const newTask = document.createElement('div');
    const taskId = taskManager.taskIdGenerator();
    newTask.innerHTML = createTaskHtml(taskId, 'none', taskName, '', 'none', 'none', 'none', '');
    const taskList = document.getElementById('taskList');
    taskList.appendChild(newTask);
    this.getCalendar(this);
    $('.selectpicker').selectpicker('render');
    this.addTask('none', taskName, '', 'none', 'none', 'none', '');
  }

  // Delete node, rather than a full render
  deleteNode(task) {
    const taskId = task.id;
    this.deleteTask(taskId);
    document.getElementById(task).remove();
  }
};


// Create the HTML for a task
const createTaskHtml = (taskId, taskType, taskName, taskDescription, taskAssignedTo, taskPriority, taskStatus, taskDueDate) => `
<div class="row mx-auto text-center task" id="${taskId}">
  <div class="col">
    <div class="row bg-grey pt-3">
      <div class="order-2 order-lg-1 col-1 bg-grey flex">
        <div class="form-group">
          <label for="type${taskId}">Type</label>
          <select id="type${taskId}" class="selectpicker" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;&nbsp;&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;&nbsp;</span>">None</option>
            <option class="bg-grey" value="work" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;&nbsp;&nbsp;&nbsp;Work&nbsp;&nbsp;&nbsp;&nbsp;</span>">Work</option>
            <option class="bg-grey" value="leisure" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;&nbsp;&nbsp;Leisure&nbsp;&nbsp;</span>">Leisure</option>
            <option class="bg-grey" value="other" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;&nbsp;&nbsp;&nbsp;Other&nbsp;&nbsp;&nbsp;&nbsp;</span>">Other</option>
          </select>
        </div>
      </div>

      <div class="order-1 order-lg-2 col-12 col-lg-5 bg-grey p-desc description">
        <div class="input-group">
          <input id="name${taskId}" type="text" class="form-control bg-grey text-white input rounded task-desc" placeholder="Type task name here.." value="${taskName}">
          <button id="descriptionBtn${taskId}" type="button" class="more text-white px-3 py-2 rounded">...</button>
        </div>
        <div id="descriptionDiv${taskId} class="input-group descriptionDiv" style="display: none">
          <input id="description${taskId}" type="text" class="form-control bg-grey text-white input rounded task-desc" placeholder="Description..">
          <button id="descriptionSaveBtn${taskId}" type="button" class="text-white px-3 py-2 rounded pull-right desc-save">Save</button>
        </div>
      </div>

      <div class="order-2 order-lg-3 col-1 bg-grey text-center flex">
        <div class="form-group">
          <label for="assigned${taskId}">Assigned</label>
          <select id="assigned${taskId}" class="bg-grey selectpicker text-center" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;&nbsp;&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;&nbsp;</span>">None</option>
            <option class="bg-grey" value="victoria" data-content="<span class='btn btn-victoria btn-shrink'>&nbsp;&nbsp;Victoria&nbsp;&nbsp;</span>">Victoria</option>
            <option class="bg-grey" value="dani" data-content="<span class='btn btn-dani btn-shrink'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dani&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>">Dani</option>
          </select>
        </div>
      </div>

      <div class="order-3 order-lg-4 col-1 bg-grey flex">
        <div class="form-group">
          <label for="priority${taskId}">Priority</label>
          <select id="priority${taskId}" class="bg-grey selectpicker" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;&nbsp;&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;&nbsp;</span>">None</option>
            <option class="bg-grey" value="low" data-content="<span class='btn btn-success btn-shrink'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Low&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>">Low</option>
            <option class="bg-grey" value="medium" data-content="<span class='btn btn-warning btn-shrink'>&nbsp;&nbsp;Medium&nbsp;</span>">Medium</option>
            <option class="bg-grey" value="high" data-content="<span class='btn btn-danger btn-shrink'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;High&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>">High</option>
          </select>
        </div>
      </div>

      <div class="order-4 order-lg-5 col-1 bg-grey flex">
        <div class="form-group">
          <label for="status${taskId}">Status</label>
          <select id="status${taskId}" class="bg-grey selectpicker" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>">None</option>
            <option class="bg-grey" value="not-started" data-content="<span class='btn btn-danger btn-shrink'>&nbsp;Not Started&nbsp;</span>">Not Started</option>
            <option class="bg-grey" value="in-progress" data-content="<span class='btn btn-warning btn-shrink'>&nbsp;In Progress&nbsp;</span>">In Progress</option>
            <option class="bg-grey" value="completed" data-content="<span class='btn btn-success btn-shrink'>&nbsp;&nbsp;Completed&nbsp;&nbsp;</span>">Completed</option>
          </select>
        </div>
      </div>

      <div class="order-5 order-lg-6 col-2 bg-grey text-white flex">
        <div class="form-group">
          <label for="date${taskId}">Due Date</label>
          <input id="date${taskId}" placeholder="&#xf271;"
            class="date bg-grey text-white text-center rounded border-0 date py-2" type="text">
        </div>
      </div>

      <div class="order-7 order-lg-8 col-1 bg-grey flex">
        <div class="form-group delete-cell">
          <label for="delete${taskId}">Delete</label>
          <img src="./img/bin.png"id="delete${taskId}" class="bin">
        </div>
      </div>
    </div>
  </div>
</div>
`