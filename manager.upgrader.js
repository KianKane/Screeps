module.exports =
{
	run: function(room, numUpgraders)
	{
		// Find elements
		var upgraders = room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.memory.role == "upgrader";} });
		var spawns = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN && structure.energy == structure.energyCapacity;} });
		var sources = room.find(FIND_SOURCES);

		// Create upgraders
		if (upgraders.length < numUpgraders && spawns.length > 0)
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
			spawns[0].createCreep(modules, undefined, {role: "upgrader", harvesting: true});
		}
		
		// Manage upgraders
		for (var key in upgraders)
		{
			var upgrader = upgraders[key];
			
			if (upgrader.memory.harvesting)
			{
				var source = upgrader.pos.findClosestByPath(sources);
				if (source)
				{
					if (upgrader.harvest(source) == ERR_NOT_IN_RANGE)
						upgrader.moveTo(source, {visualizePathStyle: {stroke: "#fff000"}});
				}
				if (upgrader.carry.energy >= upgrader.carryCapacity)
					upgrader.memory.harvesting = false;
			}
			else
			{
				if (upgrader.upgradeController(upgrader.room.controller) == ERR_NOT_IN_RANGE)
					upgrader.moveTo(upgrader.room.controller, {visualizePathStyle: {stroke: "#9700ff"}});
				if (upgrader.carry.energy <= 0)
					upgrader.memory.harvesting = true;
			}
		}
	}
};