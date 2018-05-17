const Task = require('task')

class TaskCreep extends Task {
    constructor(id, type, creep) {
        super(id, type);
        this.creep = creep;
    }
}

module.exports = TaskCreep;