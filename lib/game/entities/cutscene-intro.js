ig.module(
  'game.entities.cutscene-intro'
)
.requires(
  'impact.entity',
  'game.entities.cutscene'
)
.defines(function() {
  EntityCutsceneIntro = EntityCutscene.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    text: [
      { entity: 'center', text: '** back at the office **' }
      , { entity: 'John', text: 'Dude, he kinda looks like...' }
      , { entity: 'Jared', text: 'What?' }
      , { entity: 'John', text: '...he, kinda looks a lot like MegaMa..' }
      , { entity: 'Jared', text: 'No! He has seven distinct differences!!!' }
      , { entity: 'John', text: '**Please Don\'t Sue Us Capcom**' }
      , { entity: 'Jared', text: '...' }
    ]
  });
});
