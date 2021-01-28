//Unit testing
import { TaskManager } from '../public/js/taskManager.js';
import assert from 'assert';

global.localStorage = {
    data: {},
    getItem(key) {
        return this.data[key];
    },
    setItem(key, value) {
        this.data[key] = value;
    },
    removeItem(key) {
        delete this.data[key];
    }
};

describe('taskManager', () => {
  it('should add a task', () => {
    // Setup
    const taskManager = new TaskManager(0);
    const taskInfo = ['work', 'Write report for important client', 'John Smith @ Corp Tech - Final figures', 'dani', 'high', 'in-progress', 'Fri 12/02/21'];
    const length = taskManager.tasks.length;

    // Exercise
    taskManager.addTask(taskInfo[0], taskInfo[1], taskInfo[2], taskInfo[3], taskInfo[4], taskInfo[5], taskInfo[6], taskInfo[7]);
    
    // Verify
    assert.ok(length < taskManager.tasks.length);
  });

  it('should delete a task', () => {
    // Setup
    const taskManager = new TaskManager(0);
    taskManager.addTask();
    const length = taskManager.tasks.length;

    // Exercise
    taskManager.deleteTask(1);
    
    // Verify
    assert.ok(length > taskManager.tasks.length);
  });

  it('should return a task by taskId', () => {
    // Setup
    const taskManager = new TaskManager(0);
    const expectedTaskId = 1; 
    taskManager.addTask();

    // Exercise
    const result = taskManager.getTask(1);
    
    // Verify
    assert.equal(result.taskId, expectedTaskId);
  });
});