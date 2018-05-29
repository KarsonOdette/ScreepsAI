const _ = require("lodash");
const Constants = require("constants");
const RoleUpgrader = require("role.upgrader");
const Utils = require("utils");

const MODE_CHOOSING = 0;
const MODE_HARVESTING = 1;
const MODE_STORING = 2;

module.exports = {
    
    /*
        Example In-Memory management of sources
        
        sources: [
            {
                id: '59bbc43e2052a716c3ce7a07',
                room: 'W35N59',
                owned: true,                        // Decides if it is a long range harvester
                num_slots: 3
            },
            ...
        ]
        
    */
    
    /** @param {Creep} creep **/
    run: function(creep) {
		
        if (creep.memory.mode_harvest == undefined ||
                creep.memory.mode_harvest == MODE_CHOOSING) {
            
            if (creep.memory.room_home == undefined ||
                    creep.memory.room_remote == undefined) {
                
                // Edgecase / Legacy
                creep.memory.room_home = creep.room.name;
                creep.memory.room_remote = creep.room.name;
            }
			if (!Utils.isInRemoteRoom(creep)) {
				Utils.moveToRemoteRoom(creep);
			}
            else {
                creep.memory.source = Utils.findRandomSourceInRoom(creep).id;
                creep.memory.mode_harvest = MODE_HARVESTING;
            }
        }
		
	    if (creep.memory.mode_harvest == MODE_HARVESTING) {
	        if (!Utils.isInRemoteRoom(creep)) {
	            Utils.moveToRemoteRoom(creep);
	        }
	        else {
                var source = Game.getObjectById(creep.memory.source);
                if (source == undefined) {
					// Edge Case
					creep.memory.mode_harvest = MODE_CHOOSING;
                }
                else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {maxRooms: 1, visualizePathStyle: Utils.getPathVisualStyle(creep)});
                }
                if (creep.carry.energy >= creep.carryCapacity) {
                    creep.memory.mode_harvest = MODE_STORING;
                    Utils.clearTargetSource(creep);
                }
	        }
        }
		
        if (creep.memory.mode_harvest == MODE_STORING) {
			var storage = undefined;
			var spawn = Game.spawns.Spawn1;
			if (!Utils.isInHomeRoom(creep)) {
				Utils.moveToHomeRoom(creep);
			}
			else {
				storage = Utils.findPriorityStorage(creep);
    			if (storage != undefined) {
    				var resultTransfer = creep.transfer(storage, RESOURCE_ENERGY);
    				if (resultTransfer == ERR_NOT_IN_RANGE) {
    					creep.moveTo(storage, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
    				}
    			}
    			else {
    				RoleUpgrader.run(creep);
    			}
			}
			if (creep.carry.energy == 0) {
				creep.memory.mode_harvest = MODE_CHOOSING;
			}
        }
		
	}
	
};