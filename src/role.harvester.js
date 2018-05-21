const _ = require("lodash");
const Constants = require("constants");
const RoleUpgrader = require("role.upgrader");
const Utils = require("utils");

const MODE_HARVESTING = 0;
const MODE_STORING = 1;

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
		
        if (creep.memory.mode_harvest == undefined) {
            creep.memory.mode_harvest = MODE_HARVESTING;
            creep.memory.room_home = creep.room.name;
            creep.memory.room_remote = creep.room.name;
        }
		
	    if (creep.memory.mode_harvest == MODE_HARVESTING) {
            var source = Utils.getTargetSource(creep);
            if (source != undefined && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {maxRooms: 1, visualizePathStyle: Utils.getPathVisualStyle(creep)});
            }
            if (creep.carry.energy >= creep.carryCapacity) {
                creep.memory.mode_harvest = MODE_STORING;
                Utils.clearTargetSource(creep);
            }
        }
		
        if (creep.memory.mode_harvest == MODE_STORING) {
			var storage = undefined;
			if (creep.memory.room_home == creep.memory.room_remote) {
				storage = Game.rooms[creep.memory.room_home].find(FIND_MY_STRUCTURES, 
					{
						filter: {
							structureType: STRUCTURE_STORAGE
						}
					}
				)[0];
			}
			else {
				storage = Utils.findPriorityStorage(creep);
			}
			
			if (_.sum(storage.store) < storage.storeCapacity) {
				var resultTransfer = creep.transfer(storage, RESOURCE_ENERGY);
				if (resultTransfer == ERR_NOT_IN_RANGE) {
					creep.moveTo(storage, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
				}
				if (creep.carry.energy == 0) {
					creep.memory.mode_harvest = MODE_HARVESTING;
				}
			}
			else {
				if (creep.room.name == creep.memory.room_home) {
					RoleUpgrader.run(creep);
				}
				else {
					creep.moveTo(storage);
				}
			}
        }
		
	}
	
};