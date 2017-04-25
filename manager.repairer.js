module.exports =
{
	run: function(room, numRepairers)
	{
		// Find elements
		var repairers = room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.memory.role == "repairer";} });
		var needingRepair = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.hits < structure.hitsMax;} });
		var spawns = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN && structure.energy == structure.energyCapacity;} });
		var sources = room.find(FIND_SOURCES);

		// Create repairers
		if (repairers.length < numRepairers && spawns.length > 0)
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
			spawns[0].createCreep(modules, undefined, {role: "repairer", harvesting: true});
		}
		
		// Manage repairers
		for (var key in repairers)
		{
			var repairer = repairers[key];
			
			if (repairer.memory.harvesting)
			{
				var source = repairer.pos.findClosestByPath(sources);
				if (source)
				{
					if (repairer.harvest(source) == ERR_NOT_IN_RANGE)
						repairer.moveTo(source, {visualizePathStyle: {stroke: "#fff000"}});
				}
				if (repairer.carry.energy >= repairer.carryCapacity)
					repairer.memory.harvesting = false;
			}
			else
			{
				var structure = repairer.pos.findClosestByPath(needingRepair);
				if (structure)
				{
					if (repairer.repair(structure) == ERR_NOT_IN_RANGE)
						repairer.moveTo(structure, {visualizePathStyle: {stroke: "#0fff00"}});
				}
				if (repairer.carry.energy <= 0)
					repairer.memory.harvesting = true;
			}
		}
	}
};