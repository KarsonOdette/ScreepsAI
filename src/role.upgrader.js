const Constants = require("constants");
const Utils = require("utils");

const MODE_CHOOSE_SOURCE = 0;
const MODE_SOURCE_MINE = 1;
const MODE_SOURCE_STORAGE = 2;
const MODE_UPGRADE = 3;

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
		creep.say("\u{26A1}", true);
		
	    if (creep.memory.mode_upgrader == undefined 
				|| creep.memory.mode_upgrader == MODE_CHOOSE_SOURCE) {
		    
		    creep.memory.controller = undefined;
    		
            // Choose Source
			var storage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
	            {
	                filter: (structure) => {
						var isStorage = structure.structureType == STRUCTURE_STORAGE 
								|| structure.structureType == STRUCTURE_CONTAINER;
						return isStorage 
								&& structure.store[RESOURCE_ENERGY] >= creep.carryCapacity - creep.carry.energy;
	                }
	            }
			);
			if (storage != undefined) {
				// Select Storage
				creep.memory.mode_upgrader = MODE_SOURCE_STORAGE;
				creep.memory.storage = storage.id;
				creep.memory.mine = undefined;
			}
			/*
			// Upgrader mining disabled
			else {
				// Select Mine
				creep.memory.mode_upgrader = MODE_SOURCE_MINE;
				creep.memory.storage = undefined;
				creep.memory.mine = Utils.findBestSource(creep).id;
			}
			*/
		}
		
		// Mine From Source (Disabled)
		if (creep.memory.mode_upgrader == MODE_SOURCE_MINE) {
			var source = Game.getObjectById(creep.memory.mine);
			var isCreepFull = creep.carry.energy >= creep.carryCapacity;
			if (!isCreepFull) {
				// Continue Mining
				var result = creep.harvest(source);
				if (result == ERR_NOT_IN_RANGE) {
					creep.moveTo(source);
				}
			}
			else {
				// Stop Mining
				creep.memory.mine = undefined;
				creep.memory.mode_upgrader = MODE_UPGRADE;
				creep.memory.controller = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
					{
						filter: (structure) => {
							return structure.structureType == STRUCTURE_CONTROLLER;
						}
					}
				).id;
			}
		}
		
		// Withdraw From Storage
		if (creep.memory.mode_upgrader == MODE_SOURCE_STORAGE) {
			var storage = Game.structures[creep.memory.storage];
			var isCreepFull = creep.carry.energy >= creep.carryCapacity;
			var isStorageEmpty = storage.store[RESOURCE_ENERGY] <= 0;
			var shouldStopWithdrawing = isCreepFull || isStorageEmpty;
			if (!shouldStopWithdrawing) {
				// Continue Withdrawing
				var result = creep.withdraw(storage, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy);
				if (result == ERR_NOT_IN_RANGE) {
					creep.moveTo(storage);
				}
			}
			else {
				// Stop Withdrawing
				creep.memory.storage = undefined;
				creep.memory.mode_upgrader = MODE_UPGRADE;
				creep.memory.controller = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
					{
						filter: (structure) => {
							return structure.structureType == STRUCTURE_CONTROLLER;
						}
					}
				).id;
			}
		}
		
		
		if (creep.memory.mode_upgrader == MODE_UPGRADE) {
			var controller = Game.getObjectById(creep.memory.controller);
			var upgradeResult = creep.upgradeController(controller);
			if (upgradeResult == ERR_NOT_IN_RANGE) {
				creep.moveTo(controller);
			}
			if (creep.carry.energy == 0) {
			    creep.memory.mode_upgrader = MODE_CHOOSE_SOURCE;
    	    }
		}
		
	}
	
};

module.exports = roleUpgrader;