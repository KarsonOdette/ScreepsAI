module.exports.NUM_ROLES = 8;
module.exports.TARGET_WALL_STRENGTH = 200000;
module.exports.NO_TARGET = -1;

module.exports.PATH_VISUAL = {
    fill: 'transparent',
    stroke: '#f00',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.3
};

module.exports.Allies = [
    'TheIndigoKnight',
    'SysGabriel'
];

module.exports.TaskPriority = {
    TRIVIAL: 0,
    LOW: 10,
    MEDIUM: 100,
    HIGH: 1000,
    CRITICAL: 10000
};

module.exports.Role = {
    RECLAIM: 0,
    
    // Worker Roles
    HARVESTER: 1,
    BUILDER: 2,
    UPGRADER: 3,
    REPAIRER: 4,
    
    // Gaurd Roles
    MELEE: 5,
    RANGED: 6,
    MEDIC: 7,
    
    // Hero Roles
    // TODO
    
    CART: 8
};

module.exports.Class = {
    UNASSIGNED: 0,
    WORKER: 1,
    GUARD: 2,
    HERO: 3,
    CART: 4
};

module.exports.RoleCounts = [
    0, // RECLAIM
    3, // HARVESTER
    5, // UPGRADER
    2, // BUILDER
    1, // REPAIRER
    0, // MELEE
    0, // RANGED
    0, // MEDIC
    3  // CART
];


var Role = module.exports.Role;
var Class = module.exports.Class;

module.exports.Creep = {
    Class: {
        Worker: {
            id: Class.WORKER,
            Roles: [
                Role.BUILDER,
                Role.HARVESTER,
                Role.RECLAIM,
                Role.UPGRADER
            ]
            
        },
        Cart: {
            id: Class.CART,
            Roles: [
                Role.CART
            ]
            
        },
        Guard: {
            id: Class.GUARD,
            Roles: [
                Role.MELEE,
                Role.RANGED,
                Role.MEDIC
            ]
        },
        Hero: {
            id: Class.HERO,
            Roles: [
                
            ]
        }
    }
};

module.exports.Bodies = {
    Workers: [
        [WORK, CARRY, MOVE],
        [WORK, WORK, CARRY, CARRY, MOVE],
        [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    ],
    Carts: [
        [CARRY, CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    ],
    Gaurds: [
        [ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE], 
        [ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE], 
        [ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE], 
        [ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE], 
        [ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE], 
        [ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE], 
        [ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE], 
        [ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE]
    ],
    Heros: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]
};

module.exports.Flags = {
    UNASSIGNED: 0,
    IDLE: 1
};

module.exports.MinableRooms = [
	'W35N59',
	'W36N59',
	'W36N58'
];