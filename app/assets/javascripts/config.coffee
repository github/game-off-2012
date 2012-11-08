window.Config =
  viewport:
    width: 640
    height: 480
    center: null

  cycleSegments: 24
  cycleOuterRadius: 200
  cycleInnerRadius: 100
  cycleCenterRadius: null

  # circler


# dynamic configurations
window.Config.cycleCenterRadius = (window.Config.cycleOuterRadius + window.Config.cycleInnerRadius) / 2 + 15
window.Config.viewport.center = {x: window.Config.viewport.width / 2, y: window.Config.viewport.height / 2}