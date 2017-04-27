var visuals = require("visuals");

Creep.prototype.harvester = function()
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
        var structure = this.pos.findClosestByPath(this.room.find(FIND_MY_STRUCTURES,
            {filter: function(structure){ return structure.energy < structure.energyCapacity; }}));
        if (structure)
        {
            if (this.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            {
                this.moveTo(structure, visuals.transferPath);
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