var visuals = require("visuals");

Creep.prototype.fighter = function()
{
    var hostile = this.pos.findClosestByRange(this.room.find(FIND_HOSTILE_CREEPS));
    if (hostile)
    {
        if (this.attack(hostile) === ERR_NOT_IN_RANGE)
        {
            this.moveTo(hostile, visuals.attackPath);
        }
    }
};