export class TaskManager {
  constructor() {
    this.customAssigneesArray = [];
    this.tasks = [];
    this.taskNameOrder = true;
    this.taskTypeOrder = true;
    this.taskAssignedToOrder = true;
    this.taskPriorityOrder = true;
    this.taskStatusOrder = true;
    this.taskDueDateOrder = true;
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

  // addTask, push to array, sort and save to local storage
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
    if (typeof window !== 'undefined') {
      this.saveToFB();
    }
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

  // Sort taskType ascending
  sortByTaskTypeAsc() {
    const type = ['work', 'leisure', 'other', 'none'];
  
    taskManager.tasks.sort((a, b) => {
      let aIndex = type.findIndex(type => a.taskType.includes(type));
      let bIndex = type.findIndex(type => b.taskType.includes(type));
      return aIndex - bIndex;
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskType descending
  sortByTaskTypeDsc() {
    const type = ['work', 'leisure', 'other', 'none'];
  
    taskManager.tasks.sort((a, b) => {
      let aIndex = type.findIndex(type => a.taskType.includes(type));
      let bIndex = type.findIndex(type => b.taskType.includes(type));
      return bIndex - aIndex;
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskName ascending
  sortByTaskNameAsc() {
    taskManager.tasks.sort((a, b) => {
      if (a.taskName.toLowerCase() < b.taskName.toLowerCase()) {
        return - 1;
      }
      if (a.taskName.toLowerCase() > b.taskName.toLowerCase()) {
        return 1;
      }
      else {
        return 0;
      }
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskName descending
  sortByTaskNameDsc() {
    taskManager.tasks.sort((a, b) => {
      if (a.taskName.toLowerCase() < b.taskName.toLowerCase()) {
        return 1;
      }
      if (a.taskName.toLowerCase() > b.taskName.toLowerCase()) {
        return - 1;
      }
      else {
        return 0;
      }
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskAssignedTo ascending
  sortByTaskAssignedToAsc() {
    taskManager.tasks.sort((a, b) => {
       if (a.taskAssignedTo === 'none') {
        return 1;
       }
      if (a.taskAssignedTo < b.taskAssignedTo) {
        return -1;
      }
      if (a.taskAssignedTo > b.taskAssignedTo) {
        return 1;
      } else {
        return 0;
      }
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskAssignedTo descending
  sortByTaskAssignedToDsc() {
    taskManager.tasks.sort((a, b) => {
      if (a.taskAssignedTo === 'none') {
        return -1;
       }
      if (a.taskAssignedTo < b.taskAssignedTo) {
        return 1;
      }
      if (a.taskAssignedTo > b.taskAssignedTo) {
        return -1;
      } else {
        return 0;
      }
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskPriority ascending
  sortByTaskPriorityAsc() {
    const priority = ['high', 'medium', 'low', 'none'];
  
    taskManager.tasks.sort((a, b) => {
      let aIndex = priority.findIndex(priority => a.taskPriority.includes(priority));
      let bIndex = priority.findIndex(priority => b.taskPriority.includes(priority));
      return aIndex - bIndex;
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskPriority descending
  sortByTaskPriorityDsc() {
     const priority = ['high', 'medium', 'low', 'none'];
  
    taskManager.tasks.sort((a, b) => {
      let aIndex = priority.findIndex(priority => a.taskPriority.includes(priority));
      let bIndex = priority.findIndex(priority => b.taskPriority.includes(priority));
      return bIndex - aIndex;
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskStatus ascending
  sortByTaskStatusAsc() {
    const status = ['none', 'not-started', 'in-progress', 'completed'];
  
    taskManager.tasks.sort((a, b) => {
      let aIndex = status.findIndex(status => a.taskStatus.includes(status));
      let bIndex = status.findIndex(status => b.taskStatus.includes(status));
      return aIndex - bIndex;
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskStatus descending
  sortByTaskStatusDsc() {
    const status = ['none', 'not-started', 'in-progress', 'completed'];
  
    taskManager.tasks.sort((a, b) => {
      let aIndex = status.findIndex(status => a.taskStatus.includes(status));
      let bIndex = status.findIndex(status => b.taskStatus.includes(status));
      return bIndex - aIndex;
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskDueDate ascending
  sortByTaskDueDateAsc() {
    taskManager.tasks.sort((a, b) => {
      if (a.taskDueDate === '') {
        return 1;
      }
      if (b.taskDueDate === '') {
        return -1;
      }
      let dateNumbersA = a.taskDueDate.split(' '); 
      let dateFormattedA = dateNumbersA[1].split('/').reverse().join('');
      let dateNumbersB = b.taskDueDate.split(' '); 
      let dateFormattedB = dateNumbersB[1].split('/').reverse().join('');
      return dateFormattedA - dateFormattedB;
    });
    taskManager.save();
    taskManager.render();
  }

  // Sort taskDueDate descending
  sortByTaskDueDateDsc() {
    taskManager.tasks.sort((a, b) => {
      if (a.taskDueDate === '') {
        return -1;
      }
      if (b.taskDueDate === '') {
        return 1;
      }
      let dateNumbersA = a.taskDueDate.split(' '); 
      let dateFormattedA = dateNumbersA[1].split('/').reverse().join('');
      let dateNumbersB = b.taskDueDate.split(' '); 
      let dateFormattedB = dateNumbersB[1].split('/').reverse().join('');
      return dateFormattedB - dateFormattedA;
    });
    taskManager.save();
    taskManager.render();
  }

  // Render the task list, initialise date pickers and selectors
  render() {
    // customAssignees HTML
    function createCustomAssigneesHTML() {
      let generatedHTML;
      for (let i = 0; i < taskManager.customAssigneesArray.length; i++) {
        generatedHTML += `<option class="bg-grey" value="${taskManager.customAssigneesArray[i]}" data-content="<span class='btn btn-outline-primary btn-shrink btn-new btn-assignee'>${taskManager.customAssigneesArray[i]}</span>">${taskManager.customAssigneesArray[i]}</option>`;
      }
      return generatedHTML;
    }
  
    // Create HTML for customAssignee selector options
    const customAssigneesHTML = createCustomAssigneesHTML()

    // Create an array to store the tasks' HTML
    const tasksHtmlList = [];

    // Loop over our tasks and create the html, storing it in the array
    for (let i = 0; i < this.tasks.length; i++) {
      // Get the current task in the loop
      const task = this.tasks[i];

      // Create the task html
      const taskHtml = createTaskHtml(customAssigneesHTML, task.taskId, task.taskType, task.taskName, task.taskDescription, task.taskAssignedTo, task.taskPriority, task.taskStatus, task.taskueDate);
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
  deleteNode(taskId) {
    this.deleteTask(taskId);
    document.getElementById(taskId).remove();
  }

  // Save tasks to firestore
  saveToFB() {
  const todos = fs.collection('todos');
  const tasks = localStorage.tasks;
  todos.doc(`${localStorage.uid}`).set({ tasks });
  }

  // Load tasks from firestore
  async loadFromFB() {
    await fs.collection("todos").doc(`${localStorage.uid}`)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          hideLoadingDiv();
          localStorage.tasks = doc.data().tasks;
          taskManager.load();
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
  }

  // Load custom assignees from FB
  async loadCustomAssigneesFromFB() {
    await fs.collection("customAssignees").doc(`${localStorage.uid}`)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          localStorage.customAssignees = doc.data().customAssignees;
          taskManager.customAssigneesArray = JSON.parse(localStorage.customAssignees);
          window.customAssigneesArray = taskManager.customAssigneesArray;
        } else {
          // doc.data() will be undefined in this case
          console.log("Failed to load custom assignees");
        }
      }).catch(function (error) {
        console.log("Error getting custom assignees:", error);
      })
  }
  // Save customAssignees to Firestore
  saveCustomAssigneesToFB() {
    const customAssigneesCollection = fs.collection('customAssignees');
    const customAssignees = localStorage.customAssignees;
    customAssigneesCollection.doc(`${localStorage.uid}`).set({ customAssignees });
  }
};

// Create the HTML for a task
const createTaskHtml = (customAssigneesHTML, taskId, taskType, taskName, taskDescription, taskAssignedTo, taskPriority, taskStatus, taskDueDate) => `
<div class="row mx-auto text-center task" id="${taskId}">
  <div class="col">
    <div class="row bg-grey pt-3">
      <div class="order-2 order-lg-1 col-1 bg-grey flex">
        <div class="form-group">
          <label for="type${taskId}">Type</label>
          <select id="type${taskId}" class="selectpicker" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-type'>None</span>">None</option>
            <option class="bg-grey" value="work" data-content="<span class='btn btn-outline-primary btn-shrink btn-type'>Work</span>">Work</option>
            <option class="bg-grey" value="leisure" data-content="<span class='btn btn-outline-primary btn-shrink btn-type'>Leisure</span>">Leisure</option>
            <option class="bg-grey" value="other" data-content="<span class='btn btn-outline-primary btn-shrink btn-type'>Other</span>">Other</option>
          </select>
        </div>
      </div>

      <div class="order-1 order-lg-2 col-12 col-lg-5 bg-grey p-desc description">
        <div class="input-group">
          <input id="name${taskId}" type="text" class="form-control bg-grey text-white input rounded task-name" placeholder="Type task name here.." value="${taskName}">
          <button id="descriptionBtn${taskId}" type="button" class="more text-white px-3 py-2 rounded">...</button>
        </div>
        <div id="descriptionDiv${taskId}" class="input-group descriptionDiv" style="display: none">
          <input id="description${taskId}" type="text" class="form-control bg-grey text-white input rounded task-desc" placeholder="Description..">
          <button id="descriptionSaveBtn${taskId}" type="button" class="text-white px-3 py-2 rounded pull-right desc-save">Save</button>
        </div>
      </div>

      <div class="order-2 order-lg-3 col-1 bg-grey text-center flex">
        <div class="form-group">
          <label for="assigned${taskId}">Assigned</label>
          <select id="assigned${taskId}" class="bg-grey selectpicker text-center" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>&nbsp;&nbsp;&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;&nbsp;</span>">None</option>
            ${customAssigneesHTML}
            <option class="bg-grey" value="add-new" data-content="<span id='edit${taskId}' class='btn btn-outline-primary btn-shrink btn-edit'>&nbsp;Edit&nbsp;</span>"></option>
          </select>
        </div>
      </div>

      <div class="order-3 order-lg-4 col-1 bg-grey flex">
        <div class="form-group">
          <label for="priority${taskId}">Priority</label>
          <select id="priority${taskId}" class="bg-grey selectpicker" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none'>None</span>">None</option>
            <option class="bg-grey" value="low" data-content="<span class='btn btn-success btn-shrink'>Low</span>">Low</option>
            <option class="bg-grey" value="medium" data-content="<span class='btn btn-warning btn-shrink'>Medium</span>">Medium</option>
            <option class="bg-grey" value="high" data-content="<span class='btn btn-danger btn-shrink'>High</span>">High</option>
          </select>
        </div>
      </div>

      <div class="order-4 order-lg-5 col-1 bg-grey flex">
        <div class="form-group">
          <label for="status${taskId}">Status</label>
          <select id="status${taskId}" class="bg-grey selectpicker" data-width="fit">
            <option class="bg-grey" value="none" data-content="<span class='btn btn-outline-primary btn-shrink btn-none btn-status'>None</span>">None</option>
            <option class="bg-grey" value="not-started" data-content="<span class='btn btn-danger btn-shrink btn-status'>Not Started</span>">Not Started</option>
            <option class="bg-grey" value="in-progress" data-content="<span class='btn btn-warning btn-shrink btn-status'>In Progress</span>">In Progress</option>
            <option class="bg-grey" value="completed" data-content="<span class='btn btn-success btn-shrink btn-status'>Completed</span>">Completed</option>
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

      <div class="order-7 order-lg-8 col-1 bg-grey flex bin-div">
        <div id="up${taskId}" class='arrows arrow-up'>↑</div>
        <div class="form-group delete-cell">
          <label for="delete${taskId}">Delete</label>
          <img src="./img/bin.png"id="delete${taskId}" class="bin">
        </div>
        <div id="down${taskId}" class='arrows arrow-down'>↓</div>
      </div>
    </div>
  </div>
</div>
`