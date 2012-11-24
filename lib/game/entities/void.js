/*
This entity does nothing but just sits there. It can be used as a target
for other entities, such as movers.
*/

ig.module(
	'game.entities.void'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityVoid = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(128, 28, 230, 0.7)',
	
	size: {x: 8, y: 8},
	
	update: function(){}
});

});