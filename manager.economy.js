/* The economy manager is responsible for:
 *	- Gathering energy.
 *	- Replenishing the energy of structures.
 *	- Upgrading the controller.
 *
 * The economy manager is in charge of the following roles:
 *	- Drone
 */
 
module.exports =
{
	run: function(spawn)
	{
		// Find drones
		var drones = _.filter(Game.creeps, {memory:{role:"drone"}});

		// Create drones
		if (drones.length < 6)
			spawn.createCreep([WORK, CARRY, MOVE], undefined, {role: "drone"});
		
		// Control drones
		var counter = 0;
		for (var key in drones)
		{
			counter++;
			var drone = drones[key];
			if (drone.carry.energy < drone.carryCapacity)
			{
				// Harvest energy from source
				var sources = drone.room.find(FIND_SOURCES);
				if (drone.harvest(sources[counter % sources.length]) == ERR_NOT_IN_RANGE)
					drone.moveTo(sources[counter % sources.length]);
			}
			else
			{
				var targets = spawn.room.find(FIND_STRUCTURES, { filter: (structure) => {return structure.energy < structure.energyCapacity;} });
				if (targets.length > 0)
				{
					// Deposit energy into building
					if (drone.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						drone.moveTo(targets[0]);
				}
				else
				{
					// Upgrade controller
					if (drone.upgradeController(spawn.room.controller) == ERR_NOT_IN_RANGE)
					{
						drone.moveTo(spawn.room.controller);
					}
				}
			}
		}
	}
};