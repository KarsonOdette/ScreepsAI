const Utils = require("utils");
const Constants = require("constants");
const MODE_HARVESTING = 0;
const MODE_STORING = 1;

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.taskMode == undefined) {
            creep.memory.taskMode = MODE_HARVESTING;
        }
	    if (creep.memory.taskMode == MODE_HARVESTING) {
            var source = Utils.getTargetSource(creep);
            if (source != undefined && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {maxRooms: 1, visualizePathStyle: Utils.getPathVisualStyle(creep)});
            }
            if (creep.carry.energy >= creep.carryCapacity) {
                creep.memory.taskMode = MODE_STORING;
                Utils.clearTargetSource(creep);
            }
        }
        else if (creep.memory.taskMode == MODE_STORING) {
            var target = Utils.findPriorityStorage(creep);
            if (target != undefined) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
                }
            }
            else {
                require("role.upgrader").run(creep);
            }
            if (creep.carry.energy == 0) {
                creep.memory.taskMode = MODE_HARVESTING;
            }
        }
	}
};