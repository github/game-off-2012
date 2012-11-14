window.Config =
  viewport:
    width: 640
    height: 480
    center: null # calculated

  cycle:
    segments: 144
    colors:
      base: "#2A678C"
      action: "#75BEEB"
    centerRadius: null # calculated
    outerRadius:
      base: 200
      minimum: 0
      maximum: 235
    innerRadius:
      base: 100
      minimum : 30
      maximum: 235
    distance:
      minimum: 20
      maximum: 180

  player:
    size: 8
    color: "#ffffff"
    initialAngle: 270
    radiusModification: -15
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
    width:
      innerRadius: 20
      outerRadius: 20
    height:
      innerRadius: 20
      outerRadius: 600
    changeAhead: 30
    intervals:
      atStart: 2000
      initial: 1500
      reduceBy: 250
      minimum: 500
    tweenDuration:
      inital: 80
      change: 5
      minimum: 10
    effect:
      divisor: 1.09
      threshold: 0.01

  actions: ["Pull", "Push", "Fork", "Merge"]

  actionValues:
    Pull:  40
    Push:  40
    Merge: 20
    Fork:  20

  gfx:
    trail:
      duration: 50
      reduceBy: 0.2
      color: "#7f7f7f"
      interval:
        initial: 12
        reduceBy: 1
        minimum: 2

  flow:
    restartDelay: 1500

  music: [
    "sounds/music/04 - Bullcactus.mp3"
    "sounds/music/05 - Soft commando.mp3"
    "sounds/music/06 - Monster.mp3"
    "sounds/music/08  - Markus.mp3"
    "sounds/music/09 - Rofon.mp3"
    "sounds/music/10 - Datahell beta.mp3"
  ]

# calculated configurations
Config.cycle.centerRadius = (Config.cycle.outerRadius.base + Config.cycle.innerRadius.base) / 2 + 15
Config.viewport.center    = {x: Config.viewport.width / 2, y: Config.viewport.height / 2}