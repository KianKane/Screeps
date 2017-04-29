var DEFAULT_TARGET_NUM_HARVESTERS = 5;
var DEFAULT_TARGET_NUM_UPGRADERS = 5;
var DEFAULT_TARGET_NUM_REPAIRERS = 2;
var DEFAULT_TARGET_NUM_BUILDERS = 1;
var DEFAULT_TARGET_NUM_FARVESTERS = 0;
var DEFAULT_TARGET_NUM_FIGHTERS = 4;

require("creep.prototype.farvester");
require("creep.prototype.builder");
require("creep.prototype.harvester");
require("creep.prototype.repairer");
require("creep.prototype.upgrader");
require("creep.prototype.fighter");
require("structure.prototype.tower");
var spawner = require("spawner");

module.exports.loop = function()
{
	// Clean memory.
	for(var i in Memory.creeps)
	{
		if (!Game.creeps[i])
		{
			delete Memory.creeps[i];
		}
	}
	
	// Run roles on creeps.
	for (var creepKey in Game.creeps)
	{
		var creep = Game.creeps[creepKey];
		switch (creep.memory.role)
		{
			case "harvester":
				creep.harvester();
				break;
			case "upgrader":
				creep.upgrader();
				break;
			case "repairer":
				creep.repairer();
				break;
			case "builder":
				creep.builder();
				break;
            case "farvester":
				creep.farvester();
				break;
			case "fighter":
				creep.fighter();
				break;
			default: // If the creep has no known role then assign it the harvester role.
				creep.memory.role = "harvester";
				creep.memory.harvesting = true;
		}
	}

	// Run towers
	for (var structureKey in Game.structures)
	{
		var structure = Game.structures[structureKey];
		if (structure.structureType === STRUCTURE_TOWER)
		{
			structure.tower();
		}
	}

	// Spawn new creeps
	for (var roomKey in Game.rooms)
	{
		var room = Game.rooms[roomKey];
		if (room.find(FIND_MY_SPAWNS).length > 0 && room.energyAvailable === room.energyCapacityAvailable)
		{
			var targetNumHarvesters = room.memory.targetNumHarvesters;
			var targetNumFighters = room.memory.targetNumFighters;
			var targetNumUpgraders = room.memory.targetNumUpgraders;
			var targetNumFarvesters = room.memory.targetNumFarvesters;
			var targetNumRepairers = room.memory.targetNumRepairers;
			var targetNumBuilders = room.memory.targetNumBuilders;

			if (!targetNumHarvesters)
				targetNumHarvesters = DEFAULT_TARGET_NUM_HARVESTERS;
			if (!targetNumFighters)
				targetNumFighters = DEFAULT_TARGET_NUM_FIGHTERS;
			if (!targetNumUpgraders)
				targetNumUpgraders = DEFAULT_TARGET_NUM_UPGRADERS;
			if (!targetNumFarvesters)
				targetNumFarvesters = DEFAULT_TARGET_NUM_FARVESTERS;
			if (!targetNumRepairers)
				targetNumRepairers = DEFAULT_TARGET_NUM_REPAIRERS;
			if (!targetNumBuilders)
				targetNumBuilders = DEFAULT_TARGET_NUM_BUILDERS;

			spawner.spawnToCount(room, targetNumHarvesters, targetNumFighters, targetNumUpgraders, targetNumFarvesters, targetNumRepairers, targetNumBuilders);
		}
	}

	// Show CPU statistics in the console.
	var elapsed = Game.cpu.getUsed();
	console.log("CPU Usage: " + Math.round((elapsed/Game.cpu.limit)*100) + "%" + 
		"  Elapsed: " + Math.round(elapsed*100)/100 + "ms" + 
		"  Limit: " + Math.round(Game.cpu.limit*100)/100 + "ms" + 
		"  Full Limit: " + Math.round(Game.cpu.tickLimit*100)/100 + "ms" + 
		"  Bucket: " + Math.round(Game.cpu.bucket*100)/100 + "ms");
};