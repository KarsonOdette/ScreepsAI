var Utils = require("utils");
var Constants = require("constants");
var MODE_TRANSFERING = 0;
var MODE_RETURNING = 1;

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.taskMode == undefined) {
            creep.memory.taskMode = MODE_RETURNING;
        }
        if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.taskMode = MODE_TRANSFERING;
        }
	    if (creep.memory.taskMode == MODE_RETURNING) {
            var target = Utils.findPriorityFullStorage(creep);
            if (target != undefined) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
                }
            }
            else {
                require("role.idle").run(creep);
            }
        }
        else if (creep.memory.taskMode == MODE_TRANSFERING) {
            var target = Utils.findPriorityStorage(creep);
            if (target != undefined) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
                }
            }
            else {
                require("role.idle").run(creep);
            }
            if (creep.carry.energy == 0) {
                creep.memory.taskMode = MODE_RETURNING;
            }
        }
	}
}