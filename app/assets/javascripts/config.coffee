window.Config =
  viewport:
    width: 640
    height: 480
    center: null

  player:
    size: 8

  cycle:
    segments: 24
    outerRadius: 200
    innerRadius: 100
    centerRadius: null

  obstacleEffects:
    divisor: 2
    threshold: 1

  actionValues:
    Pull: 20
    Push: 20
    Merge: 15
    Fork: 10

  music: [
    "sounds/music/04 - Bullcactus.mp3"
    "sounds/music/05 - Soft commando.mp3"
    "sounds/music/06 - Monster.mp3"
    "sounds/music/08  - Markus.mp3"
    "sounds/music/09 - Rofon.mp3"
    "sounds/music/10 - Datahell beta.mp3"
  ]


# dynamic configurations
Config.cycle.centerRadius = (Config.cycle.outerRadius + Config.cycle.innerRadius) / 2 + 15
Config.viewport.center    = {x: Config.viewport.width / 2, y: Config.viewport.height / 2}