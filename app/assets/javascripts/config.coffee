window.Config =
  viewport:
    width: 640
    height: 480
    center: null # calculated

  cycle:
    segments: 144
    outerRadius: 200
    innerRadius: 100
    centerRadius: null # calculated

  player:
    size: 8
    color: "#ffffff"
    initialAngle: 270
    speed:
      sides:
        initial: 1.4
        increase: 0.1
        maximum: 2
      angular:
        initial: 1
        increase: 0.15
        maximum: 3

  obstacles:
    width: 10
    height: 10
    interval: 1500
    changeAhead: 30
    tweenDuration:
      inital: 80
      change: 5
      minimum: 10
    effect:
      divisor: 1.2
      threshold: 0.1

  actionValues:
    Pull: 30
    Push: 30
    Merge: 20
    Fork: 10

  gfx:
    trail:
      duration: 50
      reductionTo: 0.2
      interval: 5
      color: "#7f7f7f"

  flow:
    restartDelay: 1000

  music: [
    "sounds/music/04 - Bullcactus.mp3"
    "sounds/music/05 - Soft commando.mp3"
    "sounds/music/06 - Monster.mp3"
    "sounds/music/08  - Markus.mp3"
    "sounds/music/09 - Rofon.mp3"
    "sounds/music/10 - Datahell beta.mp3"
  ]


# calculated configurations
Config.cycle.centerRadius = (Config.cycle.outerRadius + Config.cycle.innerRadius) / 2 + 15
Config.viewport.center    = {x: Config.viewport.width / 2, y: Config.viewport.height / 2}