var visuals = require("visuals");

Creep.prototype.upgrader = function()
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
        if (this.upgradeController(this.room.controller) === ERR_NOT_IN_RANGE)
        {
            this.moveTo(this.room.controller, visuals.upgradePath);
        }
        if (this.carry.energy <= 0)
        {
            this.memory.harvesting = true;
        }
    }
};