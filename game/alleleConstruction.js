function Allele(group, delta) {
    this.delta = delta;
    this.group = group;
    this.apply = function (target) {
        for (var key in delta) {
            var curChange = delta[key];
            if(!assertDefined(curChange))
                continue;

            if (defined(target.attr[key])) {
                target.attr[key] += curChange;
            } else if (key == "attack") {
                //attack type
                target.attr.attack_types.push(new curChange());
            } else if (key == "target") {
                //target strategy
                target.attr.target_Strategy = new curChange();
                // What should we do if we're removing the gene for the target_Strategy?
            }
        }
    }
    this.getInnerColor = function()
    {
        if(this.delta.attack)        
            return "pink";
        else if(this.delta.target)
            return "yellow";

        return "white";
    }
    this.getOuterColor = function()
    {
        if(this.delta.attack)
        {
            var name = this.delta.attack.name;
            if(name == "bullet")
                return globalColorPalette.bullet;
            else if(name == "laser")
                return globalColorPalette.laser;
            else if(name == "chain_lightning")
                return globalColorPalette.chain_lightning;
            else if(name == "pulse")
                return globalColorPalette.pulse;
            else if(name == "poison")
                return globalColorPalette.poison;
            else if(name == "slow")
                return globalColorPalette.slow;
                
            return "yellow";
        }
        return getInnerColorFromAttrs(this.delta);
    }
}