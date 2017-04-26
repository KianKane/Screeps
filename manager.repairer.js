var spawner = require("spawner");

module.exports =
{
	run: function(room, numRepairers)
	{
		// Find elements
		var repairers = room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.memory.role == "repairer";} });
		var needingRepair = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.hits < structure.hitsMax;} });
		var sources = room.find(FIND_SOURCES);

		// Create repairers
		if (repairers.length < numRepairers && room.energyAvailable >= room.energyCapacityAvailable)
		{
			spawner.spawn(room, [MOVE, CARRY, WORK, MOVE, WORK, WORK], {role: "repairer", harvesting: true});
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
				var bestPriority = Number.MIN_VALUE;
				var bestStructure = null;
				for (var sKey in needingRepair)
				{
					var structure = needingRepair[sKey];
					var priority = (50 - repairer.pos.getRangeTo(structure)) + (200 - Math.min(structure.hits, 100000)/Math.min(structure.hitsMax, 100000)*200);
					if (priority >= bestPriority)
					{
						bestPriority = priority;
						bestStructure = structure;
					}
				}
				if (bestStructure)
				{
					if (repairer.repair(bestStructure) == ERR_NOT_IN_RANGE)
						repairer.moveTo(bestStructure, {visualizePathStyle: {stroke: "#0fff00"}});
				}
				if (repairer.carry.energy <= 0)
					repairer.memory.harvesting = true;
			}
		}
	}
};