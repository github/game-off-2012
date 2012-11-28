/*
TowerStats = {
        range:          100,
        damage:         1,
        hp:             10,
        attSpeed:       1,        
        mutate:         0,
        mutatestrength: 0,
        upload:         0,
        download:       0,
        hitcount:       0,
        value:          50,
    };
    */


function Allele(delta)
{
    this.delta = delta;
    this.apply = function(target) {
        for (var key in this.delta) {
            target.attr[key] += this.delta[key];
        }
    }
}