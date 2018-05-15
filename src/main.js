// Imports
var Constants = require('constants');
var Role = require('role');
var RoleRenew = require('role.renew');
var Utils = require('utils');
var TaskManager = require('taskmanager');

Utils.cleanUpMemory();

module.exports.loop = function() {
    var numCreeps = Utils.getNumCreeps();
    var roomLevel = Game.spawns.Spawn1.room.controller.level;
    var roomEnergyCap = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var roomSpawnLevel = Math.floor((roomEnergyCap - 300) / 250);
    
    // Spawn Creeps
    if (!Memory.firstRun && Game.spawns.Spawn1.spawning == null) {
        var isSpawning = false;
        var workerBodies = Constants.Bodies.Workers;
        
        // Spawn Worker
        if (!isSpawning) {
            if (numCreeps == 0) {
                roomLevel = 0;
                roomSpawnLevel = 0;
            }
            var nextWorkerName = "W" + Memory.nextWorkerId;
            var nextWorkerBody = workerBodies[roomSpawnLevel];
            var role;
            var a;
            for(a=1; a<=4; a++) {
                if (Memory.roleCount[a] < Constants.RoleCounts[a]) {
                    isSpawning = true;
                    role = a;
                    break;
                }
            }
            if (isSpawning) {
                var canCreateCreepWorkerResponse = Game.spawns.Spawn1.canCreateCreep(nextWorkerBody, nextWorkerName);
                if (canCreateCreepWorkerResponse == OK) {
                    Game.spawns.Spawn1.createCreep(nextWorkerBody, nextWorkerName, {
                        level:  roomSpawnLevel, 
                        class:  Constants.Class.WORKER, 
                        role:   role, 
                        isRenewing: false
                    });
                    Memory.nextWorkerId++;
                    isSpawning = true;
                }
                else if (canCreateCreepWorkerResponse == ERR_NAME_EXISTS) {
                    Memory.nextWorkerId++;
                }
                else {
                    console.log(canCreateCreepWorkerResponse);
                    console.log(nextWorkerBody);
                }
            }
        }
        
        // Spawn Cart
        if (!isSpawning) {
            var cartBodies = Constants.Bodies.Carts;
            var nextCartName = "C" + Memory.nextCartId;
            var nextCartBody = cartBodies[roomSpawnLevel];
            var role;
            var a;
            if (Memory.roleCount[Constants.Role.CART] < Constants.RoleCounts[Constants.Role.CART]) {
                isSpawning = true;
                role = Constants.Role.CART;
            }
            if (isSpawning) {
                var canCreateCreepCartResponse = Game.spawns.Spawn1.canCreateCreep(nextCartBody, nextCartName);
                if (canCreateCreepCartResponse == OK) {
                    Game.spawns.Spawn1.createCreep(nextCartBody, nextCartName, {
                        level:  roomSpawnLevel, 
                        class:  Constants.Class.CART, 
                        role:   role, 
                        isRenewing: false
                    });
                    Memory.nextCartId++;
                    isSpawning = true;
                }
                else if (canCreateCreepCartResponse == ERR_NAME_EXISTS) {
                    Memory.nextCartId++;
                }
            }
        }
        
        // Spawn Guard
        if (!isSpawning) {
            // TODO
        }
        
        // Spawn Hero
        if (!isSpawning) {
            // TODO
        }
    }

    // Preform Roles
    Memory.roleCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    Memory.isRenewingCreep = false;
    var weakestCreep = null;
    var weakestCreepTTL = Number.MAX_SAFE_INTEGER;
    var areCreepsReclaiming = Utils.areCreepsReclaiming();
    
    // Preform Creep Roles
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        Memory.roleCount[creep.memory.role]++;
    }
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == undefined ||
            creep.memory.role != Constants.Role.RECLAIM && numCreeps >= 10 && creep.memory.level < roomSpawnLevel && !areCreepsReclaiming) {
            creep.memory.role = Constants.Role.RECLAIM;
            areCreepsReclaiming = true;
        }
        if (creep.memory.isRenewing == undefined) {
            creep.memory.isRenewing = false;
        }
        if (creep.memory.isRenewing && 
            creep.memory.role != Constants.Role.RECLAIM) {
            RoleRenew.run(creep);
            Memory.isRenewingCreep = true;
        }
        else {
            Role[creep.memory.role].run(creep);
            if (creep.ticksToLive < weakestCreepTTL) {
                weakestCreep = creep;
                weakestCreepTTL = creep.ticksToLive;
            }
        }
    }
    
    // Preform Tower Role
    for(var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var towers = room.find(FIND_STRUCTURES, 
            {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER;
                }
            }
        );
        towers.forEach(tower => require("role.tower").run(tower));
    }
    
    // Flag the weak creep for renewal
    if (!Memory.isRenewingCreep && weakestCreep != null && weakestCreepTTL < 500) {
        weakestCreep.memory.isRenewing = true;
    }
    
    //require("reservation").scanRoom();
    
    Memory.firstRun = false;
    TaskManager.run();
}