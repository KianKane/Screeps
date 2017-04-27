var visuals = require("visuals");

Creep.prototype.repairer = function()
{
    if (this.memory.harvesting)
    {
        var source = this.pos.findClosestByPath(this.room.find(FIND_SOURCES,
            {filter: function(source){ return source.energy > 0; }}));
        if (source)
        {
            if (this.harvest(source) === ERR_NOT_IN_RANGE)
            {
                this.moveTo(source, visuals.harvestPath);
            }
            if (this.carry.energy >= this.carryCapacity)
            {
                this.memory.harvesting = false;
            }
        }
        else
        {
            if (this.carry.energy > 0)
            {
                this.memory.harvesting = false;
            }
        }
    }
    else
    {
        var structures = this.room.find(FIND_MY_STRUCTURES,
            {filter: function(structure){ return structure.hits < structure.hitsMax; }});
        var bestPriority = Number.MIN_VALUE;
        var bestStructure = null;
        for (var structureKey in structures)
        {
            var structure = structures[structureKey];
            var priority = (50 - this.pos.getRangeTo(structure)) + (200 - Math.min(structure.hits, 100000)/Math.min(structure.hitsMax, 100000)*200);
            if (priority >= bestPriority)
            {
                bestPriority = priority;
                bestStructure = structure;
            }
        }
        if (bestStructure)
        {
            if (this.repair(bestStructure) === ERR_NOT_IN_RANGE)
            {
                this.moveTo(bestStructure, visuals.repairPath);
            }
            if (this.carry.energy <= 0)
            {
                this.memory.harvesting = true;
            }
        }
        else
        {
            if (this.carry.energy < this.carryCapacity)
            {
                this.memory.harvesting = true;
            }
        }
    }
};