window.Config =
  viewport:
    width: 640
    height: 480
    center: null

  cycleSegments: 24
  cycleOuterRadius: 200
  cycleInnerRadius: 100
  cycleCenterRadius: null

  music: [
    "sounds/music/04 - Bullcactus.mp3"
    "sounds/music/05 - Soft commando.mp3"
    "sounds/music/06 - Monster.mp3"
    "sounds/music/08  - Markus.mp3"
    "sounds/music/09 - Rofon.mp3"
    "sounds/music/10 - Datahell beta.mp3"
  ]
  # circler


# dynamic configurations
window.Config.cycleCenterRadius = (window.Config.cycleOuterRadius + window.Config.cycleInnerRadius) / 2 + 15
window.Config.viewport.center = {x: window.Config.viewport.width / 2, y: window.Config.viewport.height / 2}