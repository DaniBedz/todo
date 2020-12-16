// taskManager Class
class taskManager {
    constructor() {
        this.tasks = [];        
    }
    
    // Adds task
  createTask(taskType, taskName, taskDescription, assignee, priority, status, dueDate) {
    const newTask = {
        taskId: this.tasks.length+1,
        taskType,        
        taskName,
        taskDescription,
        assignee,
        priority,
        status,
        dueDate,
    }
    this.tasks.push(newTask);
    //this.renderTask(newTask.taskId,newTask.taskName);
    return newTask.taskId;
  }

    getTasks() {
        return this.tasks;
    }
    
    // Updates Task Type
    updateTaskType(taskId, taskType) {
        let index= this.findTask(taskId);
        this.tasks[index].taskType = taskType;
    }
  
    // Updates Task Name
    updateTaskName(taskId, taskName) {
        let index= this.findTask(taskId);
        this.tasks[index].taskName = taskName;
    }

    // Update Task Description
    updateTaskDescription(taskId, taskDescription) {
        let index= this.findTask(taskId);
        this.tasks[index].taskDescription = taskDescription;
    }
    
    // Updates Assignee
    updateAssignee(taskId, assignee) {
        let index= this.findTask(taskId);
        this.tasks[index].assignee = assignee;
    }
  
    // Updates Priority
    updatePriority(taskId, priority) {
        let index= this.findTask(taskId);
        this.tasks[index].priority = priority;
    }
    
    // Updates Status
    updateStatus(taskId, status) {
        let index= this.findTask(taskId);
        this.tasks[index].status = status;
    }
    
    // Updates Due Date
    updateDueDate(taskId, dueDate) {
        let index= this.findTask(taskId);
        this.tasks[index].dueDate = dueDate;
    }
    
    // Deletes Task
    deleteTask(taskId) {
        let index= this.findTask(taskId);
        this.tasks.splice(index,1);  
        renderDeleteTask(taskId);
    }

    //find the index of the task in task array by taskId
    findTask(taskId) {
        for(let i=0;i<this.tasks.length;i++) {
            if(this.tasks[i].taskId==taskId) {
                return i;
            }
        }
    }

    renderDeleteTask(taskId)
    {
        $("#"+taskId).parent().remove();
    }

    // Display Tasks by render method

    
}


//Testing for console.
    /*
    taskManager1.createTask('work','test task 3','victoria', 'low', 'not started', '12/12/2020');
    
    let tasks = taskManager1.getTasks();
    for(let i = 0; i < tasks.length; i++){
        console.log(tasks[i].taskId);
        console.log(tasks[i].taskName);
        console.log(tasks[i].taskType);
        console.log(tasks[i].dueDate);
    }

    console.log('update for task id=1');

    taskManager1.updateDueDate(1,'13/12/2020');

    tasks = taskManager1.getTasks();

    for(let i = 0; i < tasks.length; i++){
        console.log(tasks[i].taskId);
        console.log(tasks[i].taskName);
        console.log(tasks[i].taskType);
        console.log(tasks[i].dueDate);
    }
    */
