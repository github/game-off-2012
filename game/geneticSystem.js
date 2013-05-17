function Genes() {
    this.base = new BaseObj(this);
    this.tpos = new Rect(0, 0, 0, 0);

    this.alleles = {};

    var addingAlleles = false;
    this.startAlleleAdd = function() {
        addingAlleles = true;
    }
    this.endAlleleAdd = function() {
        addingAlleles = false;
        this.recalculateAttributes();
    }

    this.addAllele = function (allele) {
        if (!assertDefined(allele))
            return;

        var holder = this.base.parent;

        if (!assertDefined(holder))
            return;

        if (!assertDefined(allele.delta, allele.group))
            return;

        var group = allele.group;

        this.alleles[group] = allele;
        if(!addingAlleles)
            this.recalculateAttributes();
    };

    this.removeAlleleGroup = function (group) {
        if(this.alleles[group.group])
            delete this.alleles[group.group];
    }

    this.recalculateAttributes = function() {
        var holder = this.base.parent;
        holder.setBaseAttrs();

        for(var key in this.alleles) {
            this.alleles[key].apply(holder);
        }
        holder.attr.currentHp = holder.attr.hp;

        //I mean, this could happen, its not an error, you just have crap alleles
        //(However letting the range be 0 may cause errors. Also, no point in not drawing
        //it, might as well give them a little bit of range so a circle is at least drawn).
        if (holder.attr.range < 1) {
            holder.attr = 1;
        }
    }

    //Should only be called if you are fully replacing the targeting strategy and attack types
    this.replaceAlleles = function (newAlleles) {
        var holder = this.base.parent;
        holder.attr.targetStrategy = null;
        holder.attr.attackTypes = [];

        this.startAlleleAdd();

        for (var group in newAlleles) {
            this.addAllele(newAlleles[group]);
        }

        this.endAlleleAdd();
    };
}
