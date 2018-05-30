const Constants = require("constants");
const Utils = require("utils");

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
		
		creep.say("\u{2672}", true);
		
		if (creep.memory.room_home != undefined && !Utils.isInHomeRoom(creep)) {
			Utils.moveToHomeRoom(creep);
		}
		
		else {
			var spawn = Utils.getClosestSpawn(creep.pos);
			var renewResp = spawn.renewCreep(creep);
			if (renewResp != OK) {
				if (renewResp == ERR_FULL || renewResp == ERR_NOT_ENOUGH_ENERGY) {
					creep.memory.isRenewing = false;
				}
				else {
					creep.moveTo(spawn, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
				}
			}
		}
		
	}
	
};