var nearestSpawnToSource = function(room)
{
	var sources = room.find(FIND_SOURCES);
	var spawns = room.find(FIND_MY_SPAWNS);
	var bestDist = Number.MAX_VALUE;
	var bestSpawn = null;
	for(var spawnKey in spawns)
	{
		var spawn = spawns[spawnKey];
		var dist =  spawn.pos.findPathTo(spawn.pos.findClosestByPath(sources)).length;
		if (dist <= bestDist)
		{
			bestDist = dist;
			bestSpawn = spawn;
		}
	}
	return bestSpawn;
};

module.exports =
{
	spawn: function(spawn, pattern, memory)
	{
		var cost = 0;
		var modules = [];
		while (modules.length < 50 && cost < spawn.room.energyAvailable)
		{
			var index = modules.length % pattern.length;
			cost += BODYPART_COST[pattern[index]];
			if (cost <= spawn.room.energyAvailable)
			{
				modules.push(pattern[index]);
			}
		}
		spawn.createCreep(modules, undefined, memory);
	},

	spawnToCount: function(room, targetNumHarvesters, targetNumFighters, targetNumUpgraders, targetNumFarvesters, targetNumRepairers, targetNumBuilders)
	{
		var numHarvesters = room.find(FIND_MY_CREEPS, {filter: function(creep){return creep.memory.role === "harvester"}}).length;
		var numFighters = room.find(FIND_MY_CREEPS, {filter: function(creep){return creep.memory.role === "fighter"}}).length;
		var numUpgraders = room.find(FIND_MY_CREEPS, {filter: function(creep){return creep.memory.role === "upgrader"}}).length;
		var numFarvesters = _.filter(Game.creeps, function(creep){return creep.memory.role === "farvester" && creep.memory.home === room.name;}).length;
		var numRepairers = room.find(FIND_MY_CREEPS, {filter: function(creep){return creep.memory.role === "repairer"}}).length;
		var numBuilders = room.find(FIND_MY_CREEPS, {filter: function(creep){return creep.memory.role === "builder"}}).length;

		if (numHarvesters < targetNumHarvesters)
		{
			this.spawnHarvester(room);
		}
		else if (numFighters < targetNumFighters && room.find(FIND_HOSTILE_CREEPS).count > 0)
		{
			this.spawnFighter(room);
		}
		else if (numUpgraders < targetNumUpgraders)
		{
			this.spawnUpgrader(room);
		}
		else if (numFarvesters < targetNumFarvesters)
		{
			this.spawnFarvester(room);
		}
		else if (numRepairers < targetNumRepairers)
		{
			this.spawnRepairer(room);
		}
		else if (numBuilders < targetNumBuilders)
		{
			this.spawnBuilder(room);
		}
	},

	spawnBuilder: function(room)
	{
		var bestSpawn = nearestSpawnToSource(room);
		if (bestSpawn)
		{
			this.spawn(bestSpawn, [MOVE, CARRY, WORK, MOVE, WORK, WORK], {role: "builder", harvesting: true});
		}
	},

	spawnHarvester: function(room)
	{
		var bestSpawn = nearestSpawnToSource(room);
		if (bestSpawn)
		{
			this.spawn(bestSpawn, [MOVE, CARRY, WORK, MOVE, WORK, WORK], {role: "harvester", harvesting: true});
		}
	},

	spawnRepairer: function(room)
	{
		var bestSpawn = nearestSpawnToSource(room);
		if (bestSpawn)
		{
			this.spawn(bestSpawn, [MOVE, CARRY, WORK, MOVE, WORK, WORK], {role: "repairer", harvesting: true});
		}
	},

	spawnUpgrader: function(room)
	{
		var bestSpawn = nearestSpawnToSource(room);
		if (bestSpawn)
		{
			this.spawn(bestSpawn, [MOVE, CARRY, WORK, MOVE, WORK, WORK], {role: "upgrader", harvesting: true});
		}
	},

	spawnFarvester: function(room)
	{
		var bestSpawn = nearestSpawnToSource(room);
		if (bestSpawn)
		{
			this.spawn(bestSpawn, [MOVE, CARRY, WORK, MOVE, CARRY, CARRY], {role: "farvester", harvesting: true, home: room.name});
		}
	},

	spawnFighter: function(room)
	{
		var bestSpawn = nearestSpawnToSource(room);
		if (bestSpawn)
		{
			this.spawn(bestSpawn, [MOVE, ATTACK, TOUGH], {role: "fighter"});
		}
	}
};