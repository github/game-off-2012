function Genes() {
    this.base = new baseObj(this);

    this.alleles = {};

    this.addAllele = function (group, allele) {
        if (!assertDefined(group, allele))
            return;

        var holder = this.base.parent;

        if (!assertDefined(holder))
            return;


        if (!allele.delta.attack) {
            if (this.alleles[group])
                this.alleles[group].apply(holder, true);

            this.alleles[group] = allele;

            this.alleles[group].apply(holder, false);
        }
        else {
            //Should fix attack types not properly being removed
            this.alleles[group] = allele;
            this.replaceAlleles(this.alleles[group]);
        }
    };

    //Should only be called if you are fuly replacing the targetting strategy and attack types
    this.replaceAlleles = function (newAlleles) {
        this.attr.target_Strategy = null;
        this.attr.attack_types = [];
        var holder = this.base.parent.holder;

        for (var alleleGroup in this.alleles)
            if (this.alleles[alleleGroup]) {
                this.alleles[alleleGroup].apply(holder, true);
                delete this.alleles[alleleGroup];
            }

        for (var group in newAlleles)
            this.addAllele(group, newAlleles[group]);

        if (!holder.attr.target_Strategy || holder.attr.attack_types.length == 0)
            fail("Don't call replace alleles unless you are going to fill in targetting and attacking types.");
    };
}