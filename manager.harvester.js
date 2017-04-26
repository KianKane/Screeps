var spawner = require("spawner");

module.exports =
{
	run: function(room, numHarvesters)
	{
		// Find elements
		var harvesters = room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.memory.role == "harvester";} });
		var needingEnergy = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.energy < structure.energyCapacity;} });
		var sources = room.find(FIND_SOURCES, {filter: (source) => {return source.energy > 0;} });

		// Create harvesters
		if (harvesters.length < numHarvesters && room.energyAvailable >= room.energyCapacityAvailable)
		{
			spawner.spawn(room, [MOVE, CARRY, WORK, MOVE, WORK, WORK], {role: "harvester", harvesting: true});
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