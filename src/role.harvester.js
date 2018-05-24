const _ = require("lodash");
const Constants = require("constants");
const RoleUpgrader = require("role.upgrader");
const Utils = require("utils");

const MODE_CHOOSING = 0;
const MODE_HARVESTING = 1;
const MODE_STORING = 2;

// TODO: Game.creeps.C18.room.findExitTo('W37N59')

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
		
        if (creep.memory.mode_harvest == undefined ||
                creep.memory.mode_harvest == MODE_CHOOSING) {
            
            creep.memory.mode_harvest = MODE_HARVESTING;
            if (creep.memory.room_home == undefined ||
                    creep.memory.room_remote == undefined) {
                creep.memory.room_home = creep.room.name;
                creep.memory.room_remote = creep.room.name;
            }
            var source = undefined;
            if (creep.memory.room_remote == creep.memory.room_home) {
                creep.memory.source = Utils.getTargetSource(creep).id;
            }
            else {
                creep.memory.source = '59bbc43c2052a716c3ce79a5';
            }
        }
		
	    if (creep.memory.mode_harvest == MODE_HARVESTING) {
            var source = Game.getObjectById(creep.memory.source);
            if (source == undefined) {
                if (creep.memory.source == undefined) {
                    // Edge Case
                    creep.memory.mode_harvest = MODE_CHOOSING;
                }
                else{
                    creep.moveTo(new RoomPosition(25, 25, creep.memory.room_remote));
                    creep.say('error');
                }
            }
            if (source != undefined && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {maxRooms: 2, visualizePathStyle: Utils.getPathVisualStyle(creep)});
            }
            if (creep.carry.energy >= creep.carryCapacity) {
                creep.memory.mode_harvest = MODE_STORING;
                Utils.clearTargetSource(creep);
            }
        }
		
        if (creep.memory.mode_harvest == MODE_STORING) {
			var storage = undefined;
			if (creep.memory.room_home != creep.memory.room_remote) {
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
			
			if (storage == undefined) {
			    creep.say('Bad Store');
			}
			else if (_.sum(storage.store) < storage.storeCapacity) {
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