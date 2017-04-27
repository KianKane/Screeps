var visuals = require("visuals");

Creep.prototype.builder = function()
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
        var site = this.pos.findClosestByPath(this.room.find(FIND_MY_CONSTRUCTION_SITES,
            {filter: function(site){ return site.structureType !== STRUCTURE_ROAD; }}));
        if (!site)
        {
            site = this.pos.findClosestByPath(this.room.find(FIND_MY_CONSTRUCTION_SITES));
        }
        if (site)
        {
            if (this.build(site) === ERR_NOT_IN_RANGE)
            {
                this.moveTo(site, visuals.buildPath);
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