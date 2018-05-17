const PriorityQueue = require("priorityqueue");
const Task = require("task");

class TaskManager {
    constructor() {
        this.taskQueue = new PriorityQueue(
            (a, b) => {
				if (a.priority != b.priority) {
					return a.priority > b.priority;
				}
				return a.id > b.id;
			}
		);
		this.nextId = 0;
    }
	
	addTask(task) {
		task.id = nextId;
		nextId++;
		taskQueue.push(task);
	}
}

module.exports = TaskManager;