var spawner = require("spawner");

module.exports =
{
	run: function(room, numUpgraders)
	{
		// Find elements
		var upgraders = room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.memory.role == "upgrader";} });
		var sources = room.find(FIND_SOURCES);

		// Create upgraders
		if (upgraders.length < numUpgraders && room.energyAvailable >= room.energyCapacityAvailable)
		{
			spawner.spawn(room, [MOVE, CARRY, WORK, MOVE, WORK, WORK], {role: "upgrader", harvesting: true});
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