module.exports =
{
	run: function(room, numHarvesters)
	{
		// Find elements
		var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
		var hostiles = room.find(FIND_HOSTILE_CREEPS);
		var woundedCreeps = room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.hits < creep.hitsMax;} });
		
		// Manage towers
		for (var key in towers)
		{
			var tower = towers[key];
			var hostile = tower.pos.findClosestByRange(hostiles);
			if (hostile)
			{
				tower.attack(hostile);
			}
			else
			{
				var wounded = tower.pos.findClosestByRange(woundedCreeps);
				if (wounded)
				{
					tower.heal(wounded);
				}
			}
		}
	}
};