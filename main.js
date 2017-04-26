/* Main */
var builderManager = require("manager.builder");
var harvesterManager = require("manager.harvester");
var repairerManager = require("manager.repairer");
var upgraderManager = require("manager.upgrader");
var towerManager = require("manager.tower");
var fighterManager = require("manager.fighter");

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
	
	// Get room
	var room = Game.spawns["spawn1"].room;
	
	// Run managers
	upgraderManager.run(room, 4);
	builderManager.run(room, 2);
	repairerManager.run(room, 4);
	fighterManager.run(room, 2);
	harvesterManager.run(room, 7);
	towerManager.run(room);
	
	var elapsed = Game.cpu.getUsed();
	console.log("CPU Usage: " + Math.round((elapsed/Game.cpu.limit)*100) + "%" + 
		"  Elapsed: " + Math.round(elapsed*100)/100 + "ms" + 
		"  Limit: " + Math.round(Game.cpu.limit*100)/100 + "ms" + 
		"  Full Limit: " + Math.round(Game.cpu.tickLimit*100)/100 + "ms" + 
		"  Bucket: " + Math.round(Game.cpu.bucket*100)/100 + "ms");
}