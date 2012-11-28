Config.cycle =
  segments: 120
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
  size: 7
  initialAngle: 270
  radiusModification: -15
  speed:
    sides:
      initial: 1.4
      increase: 0.1
      maximum: 2.2
    angular:
      initial: 1
      increase: 0.08
      maximum: 3

Config.obstacles =
  width:
    innerRadius: 25
    outerRadius: 25
  height:
    innerRadius: 15
    outerRadius: 350
  changeWhere:
    initial: 50
    randomBy: 20
    increaseBy: 5
  intervals:
    atStart: 2000
    initial: 1700
    reduceBy: 100
    minimum: 750
  tweenDuration:
    inital: 100
    change: 3
    minimum: 10
  effect:
    divisor: 1.2
    threshold: 0.01

Config.actions      =  ["Pull", "Push", "Fork", "Merge", "Pull", "Push", "Merge", "Pull", "Push"]
Config.actionValues =
  Pull:  25
  Push:  25
  Merge: 15
  Fork:  15

Config.actionValues.MAX   = _.max(Config.actionValues)
Config.cycle.centerRadius = (Config.cycle.outerRadius.base + Config.cycle.innerRadius.base) / 2 + 15