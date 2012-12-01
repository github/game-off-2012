# Gitdefence

Defend your codebase from incoming bugs with towers that can dynamically improve. 


## Towers

Towers are your only defence against bugs trying to get to your codebase and subsequently damage your health. If your health goes to 0 you die, so you will want to built a lot of towers.

You can build towers by clicking on them in the tower bar, then clicking on the map:

<img src="http://i.imgur.com/UiAD4.gif" style="border:0;">

Towers will attack bugs according to their targeting type, which is dependent on their genetics, although no matter their targeting type they cannot attack bugs beyond their range. To see their range click on the tower.

Clicking on a tower will also show its stats in the sidebar:

<img src="http://i.imgur.com/vgcKZ.gif" style="border:0;">

Towers have the following stats:

* Range: Allows them to attack bugs which are farther away.
* Damage: Makes them take away more health from bugs with every attack.
* Hp: Their lifesource, they health will never go above this (except if their receive a rare allele).
* Current Hp: If this goes below 0 they die and are removed from the map.
* Att Speed: How many attacks they can apply per second. If this is negative they can still attack, albeit at a greatly reduced speed.
* Upload: How fast they can send alleles (see networks).
* Download: How fast they can receive alleles (see networks).


Towers will attack and damage bugs near them, they can have multiple attacks in which case one will be applied to every enemy hit by the first attack. The attack types are as follows:

* Laser: Instant damage of 2x your base damage to a creep.
* Bullet: A bullet is shot at a creep, which cannot miss, which will do 3x your base damage when it hits.
* Pulse: 30% of your base damage is done to all the bugs within range.
* Poison: 30% of your base damage is done to a creep, with a 80% chance for this same damage to be repeated every 0.3 seconds.
* Chain Lightning: A creep it hit for your base damage, with a chance for another creep to be attack after some delay with another lightning strike. This can repeat many times, but it will never hit the same creep twice.
* Slow: A creep will have its attack speed and movement speed halved for 2.5 seconds.

Reductions in damage will apply to the next attack when attacks are chained. So for example: if you have 100 codebase damage and have a pulse then laser, 30 damage will be done to all the bugs in the pulse range and then 60 damage will be dealth to all bugs hit by the laser. All attacks that are chained are done to different enemies, so a pulse then slow will not slow everything within range, but instead everything hit by the pulse will slow one other enemy (which could have also been hit by the pulse).


## Genetics

Towers and bugs (or bugs) have a genetic system based on alleles. Towers are branched from the their specific codebase tower (which determines their attack type) and then given random alleles. These alleles do not act quite like real alleles, as they are all dominant and you only need one for a trait to be changed, however they add a natural progression of towers. 

Every tower starts off with random alleles, and an allele to give it a specific attack type. New alleles can be purchased or gained by connecting towers to other towers. However, beware, as with genetics you cannot gain a trait (or allele) without losing one of your existing ones. When you buy alleles you are able to see how the allele will impact your tower and discard it if you choose so. Connecting towers gives you less control, but making connections between towers is free so it is a good way to spread the traits of amazing towers.


## Purchasing Alleles

Alleles can be purchased in varying quantities, with discounts being given for buying a large amount of alleles at once. As many alleles have no impact or only have a negative impact it is recommended that you toggle "Auto Trash Worse", so to automatically trash alleles which are worse in every aspect.

<img src="http://i.imgur.com/FgUKN.gif" style="border:0;">
Highlighted is the allele purchasing panel.

<img src="http://i.imgur.com/b1PQe.gif" style="border:0;">
Highlighted shows the change that will be applied if an allele which changes attack type is.

When mousing over any of the purchase allele buttons indicator will apear next to your tower stats and new attack types or targeting types may appear. Numbers next to existing tower attributes will show the change that will occur after applying the allele. New attack types will have a (+) beside them, and attack types they will replace will have a (-) beside them.


## Making Networks

Networks between towers can be created by dragged one tower to another tower. This will cause alleles from the starting tower to be occasionally pushed to the end tower. Alleles will be pushed according the the kills the tower gets, and the kills needed to push an allele is proportional to the minimum of the sending tower's upload and the receiving tower's download speed.

Network connections can be removed by clicking on the sending tower and then clicking on the - box next to the receiving tower.

## Resources Used

JQuery.

Many algorithms from stackoverflow.

Quadtree article on wikipedia.