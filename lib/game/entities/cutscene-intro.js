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
      {
        entity: 'center',
        text: '** back at the office **'
      }
      , {
          entity: 'Higgs',
          text: 'Dude, he kinda looks like...'
        }
      , {
          entity: 'Boson',
          text: 'What?'
        }
      , {
          entity: 'Higgs',
          text: '...he, kinda looks a lot like MegaMa..'
        }
      , {
          entity: 'Boson',
          text: 'No! He has seven distinct differences!!!'
        }
      , {
          entity: 'Higgs',
          text: '**Please Don\'t Sue Us Capcom**'
        }
      , {
          entity: 'Boson',
          text: '...'
        }
    ]
  });
});
