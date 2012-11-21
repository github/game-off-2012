Config.cycle =
  segments: 72
  colors:
    base: "#2A678C"
  centerRadius: null # calculated
  outerRadius:
    base: 200
    minimum: 0
    maximum: 235
  innerRadius:
    base: 100
    minimum : 50
    maximum: 235
  distance:
    minimum: 60
    maximum: 180

Config.player =
  size: 8
  color: "#ffffff"
  initialAngle: 270
  radiusModification: -15
  speed:
    sides:
      initial: 1.4
      increase: 0.1
      maximum: 2.2
    angular:
      initial: 1
      increase: 0.1
      maximum: 3

Config.obstacles =
  width:
    innerRadius: 20
    outerRadius: 40
  height:
    innerRadius: 20
    outerRadius: 350
  changeWhere:
    initial: 40
    increaseBy: 3
  intervals:
    atStart: 2000
    initial: 1500
    reduceBy: 250
    minimum: 500
  tweenDuration:
    inital: 100
    change: 3
    minimum: 10
  effect:
    divisor: 1.2
    threshold: 1

Config.actions      =  ["Pull", "Push", "Fork", "Merge", "Pull", "Push", "Merge", "Pull", "Push"]
Config.actionValues =
  Pull:  30
  Push:  30
  Merge: 15
  Fork:  15

# calculated configurations
Config.cycle.centerRadius = (Config.cycle.outerRadius.base + Config.cycle.innerRadius.base) / 2 + 15