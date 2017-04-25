/* The drone manager is responsible for:
 *	- Gathering energy.
 *	- Replenishing the energy of structures.
 *	- Upgrading the controller.
 *
 * The drone manager is in charge of the following roles:
 *	- drone
 *
 * Which utilise the following states;
 *	- harvest
 *	- transfer
 */
 
module.exports =
{
	run: function(room)
	{
		// Find room elements
		var drones = room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.memory.role == "drone";} });
		var spawns = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN && structure.energy == structure.energyCapacity;} });
		var structures = room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.energy < structure.energyCapacity;} });
		var sites = room.find(FIND_CONSTRUCTION_SITES);
		var sources = room.find(FIND_SOURCES);
		var controller = room.controller;

		// Create drones
		if (drones.length < 6 && spawns.length > 0)
		{
			var pattern = [MOVE, CARRY, WORK];
			var patternCost = [50, 50, 100];
			var cost = 0;
			var modules = [];
			while (cost < spawns[0].energyCapacity)
			{
				var index = modules.length % pattern.length;
				modules.push(pattern[index]);
				cost += patternCost[index];
			}
			spawns[0].createCreep(modules, undefined, {role: "drone", state: "harvest"});
		}
		
		// Control drones
		var counter = 0;
		for (var key in drones)
		{
			var drone = drones[key];
			if (drone.memory.state == "harvest")
			{
				var source = drone.pos.findClosestByPath(sources);
				if (source)
				{
					if (drone.harvest(source) == ERR_NOT_IN_RANGE)
						drone.moveTo(source, {visualizePathStyle: {stroke: "#fff000"}});
				}
				
				if (drone.carry.energy >= drone.carryCapacity)
					drone.memory.state = "transfer";
			}
			else if (drone.memory.state == "transfer")
			{
				if (controller.ticksToDowngrade < 1000)
				{
					if (drone.upgradeController(controller) == ERR_NOT_IN_RANGE)
							drone.moveTo(controller, {visualizePathStyle: {stroke: "#9700ff"}});
				}
				else
				{
					var structure = drone.pos.findClosestByPath(structures);
					if (structure)
					{
						if (drone.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							drone.moveTo(structure, {visualizePathStyle: {stroke: "#0fff00"}});
					}
					else
					{
						var site = drone.pos.findClosestByPath(sites)
						if (site)
						{
							if (drone.build(site) == ERR_NOT_IN_RANGE)
								drone.moveTo(site, {visualizePathStyle: {stroke: "#008fff"}});
						}
						else
						{
							if (drone.upgradeController(controller) == ERR_NOT_IN_RANGE)
								drone.moveTo(controller, {visualizePathStyle: {stroke: "#9700ff"}});
						}
					}
				}
				
				if (drone.carry.energy <= 0)
					drone.memory.state = "harvest";
			}
			else
			{
				drone.memory.state = "harvest";
			}
		}
	}
};