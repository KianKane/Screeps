var spawner = require("spawner");

module.exports =
{
	run: function(room, numFighters)
	{
		var flag = Game.flags.fighters;
		if (flag)
		{
			// Find elements
			var fighters = [];
			var allCreeps = Game.creeps;
			for (var key in Game.creeps)
			{
				if (allCreeps[key].memory.role == "fighter")
				{
					fighters.push(allCreeps[key]);
				}
			}

			// Create fighters
			if (fighters.length < numFighters && room.energyAvailable >= room.energyCapacityAvailable)
			{
				spawner.spawn(room, [MOVE, ATTACK, TOUGH], {role: "fighter"});
			}
			
			// Manage fighters
			for (var key in fighters)
			{
				var fighter = fighters[key];
				var enemyTowers = fighter.room.find(FIND_HOSTILE_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN;} });
				var enemyCreeps = fighter.room.find(FIND_HOSTILE_CREEPS);
				var enemyBuildings = fighter.room.find(FIND_HOSTILE_STRUCTURES);
				if (flag.room == fighter.room)
				{
					var enemyTower = fighter.pos.findClosestByPath(enemyTowers);
					if (enemyTower)
					{
						if (fighter.attack(enemyTower) == ERR_NOT_IN_RANGE)
							fighter.moveTo(enemyTower, {visualizePathStyle: {stroke: "#ff0000"}});
					}
					else
					{
						var enemyCreep = fighter.pos.findClosestByPath(enemyCreeps);
						if (enemyCreep)
						{
							if (fighter.attack(enemyCreep) == ERR_NOT_IN_RANGE)
								fighter.moveTo(enemyCreep, {visualizePathStyle: {stroke: "#ff0000"}});
						}
						else
						{
							var enemyBuilding = fighter.pos.findClosestByPath(enemyBuildings);
							if (enemyBuilding)
							{
								if (fighter.attack(enemyBuilding) == ERR_NOT_IN_RANGE)
									fighter.moveTo(enemyBuilding, {visualizePathStyle: {stroke: "#ff0000"}});
							}
							else
							{
								fighter.moveTo(flag, {visualizePathStyle: {stroke: "#808080"}});
							}
						}
					}
				}
				else
				{
					fighter.moveTo(flag, {visualizePathStyle: {stroke: "#808080"}});
				}
			}
		}
	}
};