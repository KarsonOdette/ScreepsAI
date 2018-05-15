var Utils = require("utils");

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        var Constants = require("constants");
        var renewResp = Game.spawns.Spawn1.renewCreep(creep);
        if (renewResp != OK) {
            if (renewResp == ERR_FULL || renewResp == ERR_NOT_ENOUGH_ENERGY) {
                creep.memory.isRenewing = false;
            }
            else {
                creep.moveTo(Game.spawns.Spawn1.pos, {visualizePathStyle: Utils.getPathVisualStyle(creep)});
                creep.say("Renewing");
                //creep.say("\u{1F4A9}", true);
            }
        }
	}
};