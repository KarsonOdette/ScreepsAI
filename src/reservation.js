module.exports = {
    scanRoom: function() {
        for(var roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            var sources = room.find(FIND_SOURCES);
            var a;
            for(a=0; a<sources.length; a++) {
                var source = sources[a];
                for(var x=source.pos.x-1; x<=source.pos.x+1; x++) {
                    for(var y=source.pos.y-1; y<=source.pos.y+1; y++) {
                        var pos = new RoomPosition(x, y, source.pos.roomName);
                        if (!require('utils').isBlocked(pos)) {
                            room.visual.circle(pos, {radius: 0.1, fill: 'red'});
                        }
                    }
                }
            }
        }
    }
};