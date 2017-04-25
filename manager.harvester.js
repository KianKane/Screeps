module.exports =
{
	run: function(room, numHarvesters)
	{
		// Find elements
		var harvesters = room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.memory.role == "harvester";} });
		var needingEnergy = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.energy < structure.energyCapacity;} });
		var spawns = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN && structure.energy == structure.energyCapacity;} });
		var sources = room.find(FIND_SOURCES);

		// Create harvesters
		if (harvesters.length < numHarvesters && spawns.length > 0)
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
			spawns[0].createCreep(modules, undefined, {role: "harvester", harvesting: true});
		}
		
		// Manage harvesters
		for (var key in harvesters)
		{
			var harvester = harvesters[key];
			
			if (harvester.memory.harvesting)
			{
				var source = harvester.pos.findClosestByPath(sources);
				if (source)
				{
					if (harvester.harvest(source) == ERR_NOT_IN_RANGE)
						harvester.moveTo(source, {visualizePathStyle: {stroke: "#fff000"}});
				}
				if (harvester.carry.energy >= harvester.carryCapacity)
					harvester.memory.harvesting = false;
			}
			else
			{
				var structure = harvester.pos.findClosestByPath(needingEnergy);
				if (structure)
				{
					if (harvester.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						harvester.moveTo(structure, {visualizePathStyle: {stroke: "#0fff00"}});
				}
				if (harvester.carry.energy <= 0)
					harvester.memory.harvesting = true;
			}
		}
	}
};