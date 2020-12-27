class TaskManager {
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

  addTask(taskType, taskName, taskDescription, taskAssignedTo, taskPriority, taskStatus, taskDueDate) {
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
  }
  
  // Return an array of all tasks
  getTasks() {
    return this.tasks;
  }

  // Get task by taskId
  getTask(taskId) {
    for(let i=0;i<this.tasks.length;i++) {
      if(this.tasks[i].taskId==taskId) {
        return this.tasks[i];
      }
    }
  }
    
  // Update task type
  updateTaskType(taskId, taskType) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskType = taskType;
  }
  
  // Update task name
  updateTaskName(taskId, taskName) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskName = taskName;
  }

  // Update task description
  updateTaskDescription(taskId, taskDescription) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskDescription = taskDescription;
  }
  
  // Update assignee
  updateAssignedTo(taskId, taskAssignedTo) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskAssignedTo = taskAssignedTo;
  }

  // Update priority
  updatePriority(taskId, taskPriority) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskPriority = taskPriority;
  }
  
  // Update status
  updateStatus(taskId, taskStatus) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskStatus = taskStatus;
  }
  
  // Update due date
  updateDueDate(taskId, taskDueDate) {
    const taskToUpdate = this.findTask(taskId);
    this.tasks[taskToUpdate].taskDueDate = taskDueDate;
  }

  // Delete Task
  deleteTask(taskId) {
    this.tasks.splice(this.findTask(taskId), 1);
    this.render();
  }

  // Find the index of the task in task array by taskId
  findTask(taskId) {
    for(let i = 0; i < taskManager.tasks.length; i++) {
      if(taskManager.tasks[i].taskId == taskId) {
        return i;
      }
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
    const tasksHtml = tasksHtmlList.join('\n');

    // Set the inner html of the tasksList on the page
    const tasksList = document.querySelector('#taskList');
    tasksList.innerHTML = tasksHtml;

    // Show correct values for selectors  
    for (let task of taskManager.tasks) {
      let taskId = task.taskId;
      $('#type'+ taskId).selectpicker('val', task.taskType);
      $('#assigned'+ taskId).selectpicker('val', task.taskAssignedTo);
      $('#priority'+ taskId).selectpicker('val', task.taskPriority);
      $('#status'+ taskId).selectpicker('val', task.taskStatus);
      $('.selectpicker').selectpicker('render');
    }

    // Make dueDate field clickable
    getCalendar();

    // Make selectors active
    $('select').selectpicker();

    // Show correct value for dueDate
    for (let task of taskManager.tasks) {
      let taskId = task.taskId;
      let dueDate = document.querySelector('#date' + taskId);
      dueDate.value = task.taskDueDate;
    }
  }
}

// Create the HTML for a task
const createTaskHtml = (taskId, taskType, taskName, taskDescription, taskAssignedTo, taskPriority, taskStatus, taskDueDate) => `
<div class="row mx-auto text-center" id="${taskId}">
  <div class="col">
    <div class="row bg-grey mx-n3 pt-3">
      <div class="col-1 bg-grey">
        <div class="form-group">
          <label for="type${taskId}">Type</label>
          <select id="type${taskId}" class="selectpicker mr-n3" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>None</span>">None</option>
            <option class="bg-grey" value="work" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>Work</span>">Work</option>
            <option class="bg-grey" value="leisure" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>Leisure</span>">Leisure</option>
            <option class="bg-grey" value="other" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>Other</span>">Other</option>
          </select>
        </div>
      </div>

      <div class="col-5 bg-grey p-desc description">
        <div class="input-group">
          <label for="name${taskId}">Task/Description</label>
          <input id="name${taskId}" type="text" class="form-control bg-grey text-white input rounded task-desc" placeholder="Type task name here.." value="${taskName}">
          <button id="descriptionBtn${taskId}" type="button" class="more text-white px-3 py-2 rounded">...</button>
        </div>
        <div id="descriptionDiv${taskId} class="input-group descriptionDiv" style="display: none">
          <input id="description${taskId}" type="text" class="form-control bg-grey text-white input rounded task-desc" placeholder="Description..">
          <button id="descriptionSaveBtn${taskId}" type="button" class="text-white px-3 py-2 rounded pull-right desc-save">Save</button>
        </div>
      </div>

      <div class="col-1 bg-grey text-center">
        <div class="form-group">
          <label for="assigned${taskId}">Assigned</label>
          <select id="assigned${taskId}" class="bg-grey selectpicker text-center mr-n3" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;None&nbsp;</span>">None</option>
            <option class="bg-grey" value="victoria" data-content="<span class='btn btn-victoria btn-shrink'>&nbsp;Victoria&nbsp;</span>">Victoria</option>
            <option class="bg-grey" value="dani" data-content="<span class='btn btn-dani btn-shrink'>&nbsp;&nbsp;&nbsp;Dani&nbsp;&nbsp;&nbsp;</span>">Dani</option>
          </select>
        </div>
      </div>

      <div class="col-1 bg-grey">
        <div class="form-group">
          <label for="priority${taskId}">Priority</label>
          <select id="priority${taskId}" class="bg-grey selectpicker mr-n3" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;None&nbsp;</span>">None</option>
            <option class="bg-grey" value="low" data-content="<span class='btn btn-success btn-shrink'>&nbsp;&nbsp;&nbsp;Low&nbsp;&nbsp;&nbsp;</span>">Low</option>
            <option class="bg-grey" value="medium" data-content="<span class='btn btn-warning btn-shrink'>&nbsp;Medium&nbsp;</span>">Medium</option>
            <option class="bg-grey" value="high" data-content="<span class='btn btn-danger btn-shrink'>&nbsp;&nbsp;&nbsp;High&nbsp;&nbsp;&nbsp;</span>">High</option>
          </select>
        </div>
      </div>

      <div class="col-1 bg-grey">
        <div class="form-group">
          <label for="status${taskId}">Status</label>
          <select id="status${taskId}" class="bg-grey selectpicker mr-n3" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;None&nbsp;</span>">None</option>
            <option class="bg-grey" value="not-started" data-content="<span class='btn btn-danger btn-status btn-shrink btn-wider'>Not Started</span>">Not Started</option>
            <option class="bg-grey" value="in-progress" data-content="<span class='btn btn-warning btn-status btn-shrink btn-wider'>In Progress</span>">In Progress</option>
            <option class="bg-grey" value="completed" data-content="<span class='btn btn-success btn-status btn-shrink'> Complete </span>">Completed</option>
          </select>
        </div>
      </div>

      <div class="col-2 bg-grey text-white">
        <div class="form-group">
          <label for="date${taskId}">Due Date</label>
          <input id="date${taskId}" placeholder="&#xf271;"
            class="date bg-grey text-white text-center rounded border-0 date py-2" type="text">
        </div>
      </div>

      <div class="col-1 bg-grey">
        <div class="form-group">
          <label for="delete${taskId}">Delete</label>
          <p id="delete${taskId}" class="bin">&#xf2ed;</p>
        </div>
      </div>
    </div>
  </div>
</div>
`