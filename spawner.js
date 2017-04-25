module.exports =
{
	spawn: function(room, pattern, memory)
	{
		var spawn = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN;} })[0];
		var cost = 0;
		var modules = [];
		while (cost < room.energyAvailable)
		{
			var index = modules.length % pattern.length;
			cost += BODYPART_COST[pattern[index]];
			if (cost <= room.energyAvailable)
				modules.push(pattern[index]);
		}
		spawn.createCreep(modules, undefined, memory);
	}
};