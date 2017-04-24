var economyManager = require("manager.economy");

module.exports.loop = function()
{
	// Clean memory
	for(var i in Memory.creeps)
	{
		if (!Game.creeps[i])
		{
			delete Memory.creeps[i];
		}
	}
	
	// Run managers
	economyManager.run(Game.spawns["spawn1"]);
}