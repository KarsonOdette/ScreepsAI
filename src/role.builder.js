const Utils = require("utils");
const Constants = require("constants");

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
	    if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	        Utils.clearTargetSource(creep);
	    }
	    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if (creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES,
    	        {
    	            filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION);
                    }    
    	        }
	        );
            if (targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: Utils.getPathVisualStyle(creep)});
                }
            }
            else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: Utils.getPathVisualStyle(creep)});
                    }
                }
                else {
                    require('role.harvester').run(creep);
                }
            }
	    }
	    else {
	        var source = Utils.getTargetSource(creep);
            if (source != undefined && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {
                    maxRooms: 1,
                    visualizePathStyle: Utils.getPathVisualStyle(creep)
                });
            }
	    }
	}
};