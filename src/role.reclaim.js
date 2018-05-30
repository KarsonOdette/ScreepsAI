const Constants = require("constants");
const Utils = require("utils");

var roleReclaim = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
		var amtEnergy = creep.carry.energy;
		creep.say("\u{2620}", true);
		
		if (creep.memory.room_home != undefined && !Utils.isInHomeRoom(creep)) {
			Utils.moveToHomeRoom(creep);
		}
		
		else if (amtEnergy > 0) {
			var targets = creep.room.find(FIND_STRUCTURES, 
				{
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION ||
								structure.structureType == STRUCTURE_SPAWN ||
								structure.structureType == STRUCTURE_TOWER) && 
								structure.energy < structure.energyCapacity;
					}
				}
			);
			if (targets.length > 0) {
				
				var target = targets[0];
				if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {maxRooms: 1, visualizePathStyle: Utils.getPathVisualStyle(creep)});
				}
			}
			else {
				recycle(creep);
			}
		}
		
		else {
			recycle(creep);
		}
	}
};

function recycle(creep) {
	var spawn = Utils.getClosestSpawn(creep.pos);
	var result = spawn.recycleCreep(creep);
	if (result == ERR_NOT_IN_RANGE) {
		creep.moveTo(spawn, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
	}
}

module.exports = roleReclaim;