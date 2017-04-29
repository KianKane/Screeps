Structure.prototype.tower = function()
{
    var healer = this.pos.findClosestByRange(this.room.find(FIND_HOSTILE_CREEPS, {filter: function(creep){ return _.filter(creep.body, function(part){ return part.type == HEAL; }).length > 0 }}));
    if (healer)
    {
        this.attack(healer);
    }
    else
    {
        var hostile = this.pos.findClosestByRange(this.room.find(FIND_HOSTILE_CREEPS));
        if (hostile)
        {
            this.attack(hostile);
        }
        else
        {
            var wounded = this.pos.findClosestByRange(this.room.find(FIND_MY_CREEPS,
                {filter: function(creep){ return creep.hits < creep.hitsMax; }}));
            if (wounded)
            {
                this.heal(wounded);
            }
        }
    }
};