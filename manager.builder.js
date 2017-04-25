module.exports =
{
	run: function(room, numBuilders)
	{
		// Find elements
		var builders = room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.memory.role == "builder";} });
		var sites = room.find(FIND_CONSTRUCTION_SITES);
		var spawns = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN && structure.energy == structure.energyCapacity;} });
		var sources = room.find(FIND_SOURCES);

		// Create builders
		if (builders.length < numBuilders && spawns.length > 0)
		{
			var pattern = [MOVE, CARRY, WORK];
			var patternCost = [50, 50, 100];
			var cost = 0;
			var modules = [];
			while (cost < spawns[0].energyCapacity)
			{
				var index = modules.length % pattern.length;
				cost += patternCost[index];
				if (cost <= spawns[0].energyCapacity)
					modules.push(pattern[index]);
			}
			spawns[0].createCreep(modules, undefined, {role: "builder", harvesting: true});
		}
		
		// Manage builders
		for (var key in builders)
		{
			var builder = builders[key];
			
			if (builder.memory.harvesting)
			{
				var source = builder.pos.findClosestByPath(sources);
				if (source)
				{
					if (builder.harvest(source) == ERR_NOT_IN_RANGE)
						builder.moveTo(source, {visualizePathStyle: {stroke: "#fff000"}});
				}
				if (builder.carry.energy >= builder.carryCapacity)
					builder.memory.harvesting = false;
			}
			else
			{
				var site = builder.pos.findClosestByPath(sites);
				if (site)
				{
					if (builder.build(site) == ERR_NOT_IN_RANGE)
						builder.moveTo(site, {visualizePathStyle: {stroke: "#008fff"}});
				}
				if (builder.carry.energy <= 0)
					builder.memory.harvesting = true;
			}
		}
	}
};