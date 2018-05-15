var Utils = require("utils");
var Constants = require("constants");

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        Utils.clearTargetSource(creep);
	    }

	    if (creep.memory.upgrading) {
	        var controller = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
	            {
	                filter: (structure) => {
	                    return structure.structureType == STRUCTURE_CONTROLLER;
	                }
	            }
	        );
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
            }
	    }
	    else {
            var source = Utils.findRandomSourceInRoom(creep);
            if (source != undefined && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {maxRooms: 1, visualizePathStyle: Utils.getPathVisualStyle(creep)});
            }
	    }
	}
};

module.exports = roleUpgrader;