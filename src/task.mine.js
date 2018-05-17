const TaskCreep = require('task.creep')

class TaskMine extends TaskCreep {
    constructor(id, creep, source) {
        super(id, 'mine', creep);
		this.source = source;
    }
}

module.exports = TaskMine;