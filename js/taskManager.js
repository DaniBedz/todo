class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(taskId, type = 'none', name, description, assignedTo = 'none', priority = 'none', dueDate = '') {
        const task = {
            taskId: taskId,
            type: type,
            name: name,
            description: description,
            assignedTo: assignedTo,
            priority: priority,
            status: status,
            dueDate: dueDate,
        };

        this.tasks.push(task);
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
        let index= this.findTask(taskId);
        this.tasks[index].taskType = taskType;
    }
    
    // Update task name
    updateTaskName(taskId, taskName) {
        let index= this.findTask(taskId);
        this.tasks[index].taskName = taskName;
    }

    // Update task description
    updateTaskDescription(taskId, taskDescription) {
        let index= this.findTask(taskId);
        this.tasks[index].taskDescription = taskDescription;
    }
    
    // Update assignee
    updateAssignee(taskId, assignee) {
        let index= this.findTask(taskId);
        this.tasks[index].assignee = assignee;
    }
  
    // Update priority
    updatePriority(taskId, priority) {
        let index= this.findTask(taskId);
        this.tasks[index].priority = priority;
    }
    
    // Update status
    updateStatus(taskId, status) {
        let index= this.findTask(taskId);
        this.tasks[index].status = status;
    }
    
    // Update due date
    updateDueDate(taskId, dueDate) {
        let index= this.findTask(taskId);
        this.tasks[index].dueDate = dueDate;
    }
    
    // Delete task
    deleteTask(taskId) {
        this.tasks.splice(taskId, 1);        
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
          const taskHtml = createTaskHtml(task.taskId, task.type, task.name, task.description, task.assignedTo, task.priority, task.status, task.dueDate);

          // Push it to the tasksHtmlList array
          tasksHtmlList.push(taskHtml);
      }

      // Create the tasksHtml by joining each item in the tasksHtmlList
      // with a new line in between each item.
      const tasksHtml = tasksHtmlList.join('\n');

      // Set the inner html of the tasksList on the page
      const tasksList = document.querySelector('#taskList');
      tasksList.innerHTML = tasksHtml;
    
    // Make dueDate field clickable
    getCalendar();

    // Make selectors active
    $('select').selectpicker();
    }
}

// Create the HTML for a task
const createTaskHtml = (taskId, type, name, description, assignedTo, priority, status, dueDate) => `
<div class="card row mx-auto text-center" id="${taskId}">
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
          <input id="name${taskId}" type="text" class="form-control bg-grey text-white input rounded task-desc" placeholder="Type task name here.." value="${name}">
          <button id="descriptionBtn${taskId}" type="button" class="more text-white px-3 py-2 rounded">...</button>
        </div>
        <div id="descriptionDiv${taskId} class="descriptionDiv" style="display: none">
          <input id="description${taskId}" type="text" class="form-control bg-grey text-white input rounded task-desc" placeholder="Description..">
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
          <label for="delete1">Delete</label>
          <p id="delete1" class="bin">&#xf2ed;</p>
        </div>
      </div>
    </div>
  </div>
</div>
`