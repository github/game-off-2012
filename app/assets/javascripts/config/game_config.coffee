Config.cycle =
  segments: 144
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
    minimum: 55
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
      maximum: 2
    angular:
      initial: 1
      increase: 0.15
      maximum: 3

Config.obstacles =
  width:
    innerRadius: 20
    outerRadius: 20
  height:
    innerRadius: 20
    outerRadius: 600
  changeWhere:
    initial: 30
    increaseBy: 5
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
    divisor: 1.08
    threshold: 1

Config.actions      =  ["Pull", "Push", "Fork", "Merge"]
Config.actionValues =
  Pull:  40
  Push:  40
  Merge: 20
  Fork:  20

# calculated configurations
Config.cycle.centerRadius = (Config.cycle.outerRadius.base + Config.cycle.innerRadius.base) / 2 + 15