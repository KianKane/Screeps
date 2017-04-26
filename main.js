/* Main */

var builderManager = require("manager.builder");
var harvesterManager = require("manager.harvester");
var repairerManager = require("manager.repairer");
var upgraderManager = require("manager.upgrader");

module.exports.loop = function()
{
	var start = new Date().getTime();
	
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
	upgraderManager.run(room, 3);
	builderManager.run(room, 3);
	repairerManager.run(room, 3);
	harvesterManager.run(room, 3);
	
	var elapsed = new Date().getTime()- start;
	console.log("CPU Usage: " + Math.round((elapsed / Game.cpu.limit)*100) + "%"
		"  Elapsed: " + elapsed + "ms" + 
		"  Limit: " + Game.cpu.limit + "ms" + 
		"  Full Limit: " + Game.cpu.tickLimit + "ms" + 
		"  Bucket: " + Game.cpu.bucket + "ms");
}