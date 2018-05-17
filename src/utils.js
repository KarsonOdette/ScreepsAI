const Constants = require('constants');

module.exports = {
    
    getNumCreeps: function() {
        return Object.keys(Game.creeps).length;
    },
    
    length: function(arr) {
        return Object.keys(arr).length;
    },
    
    reclaimAll: function() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            creep.memory.role = Constants.Role.RECLAIM;
        }
    },
    
    /** @param {Creep} creep **/
    findBestSource: function(creep) {
        return creep.pos.findClosestByRange(FIND_SOURCES,
            {
                filter: (source) => {
                    return source.energy > 0 && 
                    creep.room.name === source.room.name;
                }
            }
        );
    },
    
    /** @param {Creep} creep **/
    chooseTargetSource: function(creep) {
        var source = module.exports.findRandomSourceInRoom(creep);
        if (source != undefined) {
            module.exports.setTargetSource(creep, source.id);
        }
        else {
            module.exports.setTargetSource(creep, Constants.NO_TARGET);
        }
    },
    
    /** @param {Creep} creep **/
    getTargetSource: function(creep) {
        var id = creep.memory.targetSourceId;
        if (id == undefined || id == Constants.NO_TARGET) {
            module.exports.chooseTargetSource(creep);
            id = creep.memory.targetSourceId;
        }
        return Game.getObjectById(id);
    },
    
    setTargetSource: function(creep, id) {
        creep.memory.targetSourceId = id;
    },
    
    /** @param {Creep} creep **/
    clearTargetSource: function(creep) {
        creep.memory.targetSourceId = Constants.NO_TARGET;
    },
    
    /** @param {Creep} creep **/
    findRandomSourceInRoom: function(creep) {
        var sources = creep.room.find(FIND_SOURCES,
            {
                filter: (source) => {
                    return source.energy > 0 && 
                    creep.room.name === source.room.name;
                }
            }
        );
        var index = Math.floor(Math.random() * sources.length);
        return sources[index];
    },
    
    /** @param {Creep} creep **/
    getClosestIdleLocation: function(creep) {
        var flag = creep.pos.findClosestByRange(FIND_FLAGS, 
            {
                filter: (flag) => {
                    return true;//flag.memory.type == Constants.Flags.IDLE;
                }
            }
        );
        return flag;
    },
    
    getGCL: function() {
        var ret = "";
        ret += "GCL: " + Game.gcl.level + "\n";
        ret += "Progress: " + ((Game.gcl.progress / Game.gcl.progressTotal) * 100) + "%";
        return ret;
    },
    
    removeConstructionSites: function() {
        for(var name in Game.constructionSites) {
            var constructionSite = Game.constructionSites[name];
            constructionSite.remove();
        }
    },
    
    cleanUpMemory: function() {
        if (Memory.nextWorkerId == undefined) {
            Memory.nextWorkerId = 0;
        }
        if (Memory.nextCartId == undefined) {
            Memory.nextCartId = 0;
        }
        if (Memory.nextGuardId == undefined) {
            Memory.nextGuardId = 0;
        }
        Memory.firstRun = true;
        Memory.roleCount = [0, 0, 0, 0, 0, 0, 0, 0];
        
        for(var i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    },
    
    areCreepsReclaiming: function() {
        for(var creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            if (creep.memory.role == Constants.Role.RECLAIM) {
                return true;
            }
        }
        return false;
    },
    
    /** @param {Room} room **/
    getWeakestDefense: function(room) {
        var walls = room.find(FIND_STRUCTURES, 
            {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL ||
                            structure.structureType == STRUCTURE_RAMPART) && 
                            structure.hits < Constants.TARGET_WALL_STRENGTH;
                }
            }
        );
        if (walls.length > 0) {
            var wall = walls[0];
            for(var i in walls) {
                var tWall = walls[i];
                if (tWall.hits < wall.hits) {
                    wall = tWall;
                }
            }
            return wall;
        }
        else {
            return undefined;
        }
    },
    
    /** @param {Room} room **/
    getWeakestNonDefense:function (room) {
        var walls = room.find(FIND_STRUCTURES, 
            {
                filter: (structure) => {
                    return (structure.structureType != STRUCTURE_WALL &&
                            structure.structureType != STRUCTURE_RAMPART) && 
                            structure.hits < ((structure.hitsMax / 10) * 9);
                }
            }
        );
        if (walls.length > 0) {
            var wall = walls[0];
            for(var i in walls) {
                var tWall = walls[i];
                if (tWall.hits < wall.hits) {
                    wall = tWall;
                }
            }
            return wall;
        }
        else {
            return undefined;
        }
    },
    
    /** @param {Creep} creep **/
    findPriorityStorage:function (creep) {
        var target;
        
        var isCart = creep.memory.role == Constants.Role.CART;
        var hasCart = Memory.roleCount[Constants.Role.CART] > 0;
        
        // Priority #-1
        if (hasCart && !isCart) {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, 
                {
                    filter: (structure) => {
                        return  structure.structureType == STRUCTURE_CONTAINER && 
                                structure.store[RESOURCE_ENERGY] < structure.storeCapacity &&
                                structure.room == creep.room;
                    }
                }
            );
            if (target != undefined) {
                return target;
            }
        }
        
        // Priority #0
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, 
            {
                filter: (structure) => {
                    return  structure.structureType == STRUCTURE_TOWER && 
                            structure.energy < ((structure.energyCapacity) / 4) &&
                            structure.my;
                }
            }
        );
        if (target != undefined) {
            return target;
        }
        
        // Priority #1
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, 
            {
                filter: (structure) => {
                    return  (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && 
                            structure.energy < structure.energyCapacity;
                }
            }
        );
        if (target != undefined) {
            return target;
        }
        
        // Priority #2
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, 
            {
                filter: (structure) => {
                    return  structure.structureType == STRUCTURE_TOWER && 
                            structure.energy < structure.energyCapacity;
                }
            }
        );
        if (target != undefined) {
            return target;
        }
        
        // Priority #3
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, 
            {
                filter: (structure) => {
                    return  (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && 
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity &&
                            structure.room == creep.room;
                }
            }
        );
        if (target != undefined) {
            return target;
        }
        
        // Priority #3.5
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, 
            {
                filter: (structure) => {
                    return  (structure.structureType == STRUCTURE_STORAGE) && 
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                }
            }
        );
        if (target != undefined) {
            return target;
        }
    },
    
    /** @param {Creep} creep **/
    findPriorityFullStorage:function (creep) {
        var target;
        
        targets = creep.room.find(FIND_STRUCTURES, 
            {
                filter: function(structure) {
                    return  (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && 
                            structure.store[RESOURCE_ENERGY] > 0;
                }
            }
        );
        
        var best;
        var fullness = 0.0;
        var len = module.exports.length(targets);
        for(var a=0; a<len; a++) {
            var target = targets[a];
            var tFullness = target.store[RESOURCE_ENERGY] / target.storeCapacity;
            if (tFullness > fullness) {
                fullness = tFullness;
                best = target;
            }
        }
        
        return best;
    },
    
    /** @param {RoomPosition} pos **/
    isBlocked: function (pos) {
        var room = Game.rooms[pos.roomName];
        var objectsAtPos = room.lookForAt(LOOK_TERRAIN, pos);
        return objectsAtPos.length > 0 && objectsAtPos[0] == 'wall';
    },
    
    /** @param {Creep} creep **/
    getPathVisualStyle: function (creep) {
        if (module.exports.shouldDrawPath(creep)) {
            return Constants.PATH_VISUAL;
        }
        else {
            return null;
        }
    },
    
    /** @param {Creep} creep **/
    shouldDrawPath: function (creep) {
        return creep.memory.drawPath === true;
    }
};