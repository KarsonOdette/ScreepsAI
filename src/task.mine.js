const TaskCreep = require('task.creep')

class TaskMine extends TaskCreep {
    constructor(creep, priority, source) {
        super('mine', priority, creep);
		this.source = source;
    }
}

module.exports = TaskMine;