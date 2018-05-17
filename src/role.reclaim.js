const Utils = require("utils");
const Constants = require("constants");

var roleReclaim = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var amtEnergy = creep.carry.energy;
        creep.say("reclaim");
        if (amtEnergy > 0) {
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
        }
        else {
            var result = Game.spawns.Spawn1.recycleCreep(creep);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
            }
        }
	}
};

module.exports = roleReclaim;