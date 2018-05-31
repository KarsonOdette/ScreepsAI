const Constants = require("constants");
const RoleBuilder = require("role.builder");
const Utils = require("utils");

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
	    var closestDamagedStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, 
    	    {
                filter: (structure) => {
                    return 
                        structure.structureType != STRUCTURE_RAMPART && 
                        structure.structureType != STRUCTURE_WALL && 
                        structure.hits / structure.hitsMax <= 0.90;
                }
            }
        );
	    
	    if (closestDamagedStructure) {
    	    if (creep.memory.repairing && creep.carry.energy == 0) {
                creep.memory.repairing = false;
    	    }
    	    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.repairing = true;
    	    }
    
    	    if (creep.memory.repairing) {
    	        if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
    	            creep.moveTo(closestDamagedStructure.pos, {maxRooms: 1, visualizePathStyle: Utils.getPathVisualStyle(creep)});
    	        }
    	    }
    	    else if (creep.memory.repairing) {
    	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {maxRooms: 1, visualizePathStyle: Utils.getPathVisualStyle(creep)});
                    }
                }
    	    }
    	    else {
                var source = Utils.findRandomSourceInRoom(creep);
                if (source != undefined && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {maxRooms: 1, visualizePathStyle: Utils.getPathVisualStyle(creep)});
                }
    	    }
	    }
	    else {
	        RoleBuilder.run(creep);
	    }
    }
};

module.exports = roleRepairer;