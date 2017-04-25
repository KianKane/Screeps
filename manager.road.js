/* The road manager uses a heatmap to decide where to place roads.
 */

var ROAD_INTERVAL = 200;
var ROAD_THRESHOLD = 6;
 
module.exports =
{
	run: function(room)
	{
		// Find creeps
		var creeps = room.find(FIND_MY_CREEPS);

		// Get heat map if it exists or create a new one.
		var heatMap = room.memory.heatMap;
		if (!heatMap)
		{
			heatMap = [];
			for (var y = 0; y < 50; y++)
			{
				for (var x = 0; x < 50; x++)
				{
					heatMap[x+y*50] = 0;
				}
			}
		}
		
		// Mark heat map for this tick.
		for (var key in creeps)
		{
			var pos = creeps[key].pos;
			heatMap[pos.x+pos.y*50]++;
		}
		
		// Increment heat map tick count or set it to one if it does not exist.
		if (room.memory.heatMapTicks)
			room.memory.heatMapTicks++;
		else
			room.memory.heatMapTicks = 1;
		
		// Store modified heat map in memory.
		room.memory.heatMap = heatMap;
		
		// After 100 ticks.
		if (room.memory.heatMapTicks == ROAD_INTERVAL)
		{
			// Place roads
			for (var y = 0; y < 50; y++)
			{
				for (var x = 0; x < 50; x++)
				{
					if (heatMap[x+y*50] >= ROAD_THRESHOLD)
						room.createConstructionSite(x, y, STRUCTURE_ROAD);
				}
			}
			
			// Delete the heatmap.
			room.memory.heatMap = null;
			room.memory.heatMapTicks = 0;
		}
	}
};