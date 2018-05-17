const Task = require('task')

class TaskCreep extends Task {
    constructor(type, priority, creep) {
        super(type, priority);
        this.creep = creep;
    }
}

module.exports = TaskCreep;