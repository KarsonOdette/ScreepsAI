const Constants = require("constants");
const Utils = require("utils");

module.exports = {
    
    /** @param {StructureTower} tower **/
    run: function(tower) {
        var isInUse = false;
        var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile != undefined && Constants.Allies.indexOf(hostile.owner.username) != -1) {
            hostile = undefined;
        }
        
        // Attack Hostile Creeps
        if (hostile != undefined) {
            tower.attack(hostile);
            isInUse = true;
        }
        
        // Heal Creeps
        if (!isInUse && tower.energy > ((tower.energyCapacity / 4) * 2)) {
            var friendlies = tower.room.find(FIND_MY_CREEPS,
                {
                    filter: (creep) => {
                        return creep.hits < creep.hitsMax;
                    }
                }
            );
            if (friendlies.length > 0) {
                for(var creepName in friendlies) {
                    tower.heal(friendlies[creepName]);
                    isInUse = true;
                    break;
                }
            }
        }
        
        // Repair Defenses
        if (!isInUse && tower.energy > ((tower.energyCapacity / 4) * 2)) {
            var defense = Utils.getWeakestDefense(tower.room);
            if (defense != undefined) {
                tower.repair(defense);
                isInUse = true;
            }
        }
        
        // Repair Other Structures
        if (!isInUse && tower.energy > ((tower.energyCapacity / 4) * 3)) {
            var structure = Utils.getWeakestNonDefense(tower.room);
            if (structure != undefined) {
                tower.repair(structure);
                isInUse = true;
            }
        }
	}
};