Config.gfx =
  trail:
    duration: 50
    reduceBy: 0.2
    color: "#7f7f7f"
    interval:
      initial: 12
      reduceBy: 1
      minimum: 2

  text:
    duration: 600

  segmentsInitialIndex: 500

  player:
    color: "#ffffff"

  track:
    baseColor: "#2A678C"
    hueChangeDivisor: 12

  cyclesTitles:
    [
      "v0.1", "v0.2", "v0.3", "v0.4", "v0.5", "v0.6", "v0.7", "v0.8", "v0.9",
      "Alpha", "Beta", "RC", "v1.0",
      "DLC #1", "DLC #2", "DLC #3", "DLC #4",
      "Hotfix #1", "Hotfix #2", "Hotfix #3", "Hotfix #4",
      "Content Patch #1", "Content Patch #2", "Content Patch #3", "Content Patch #4",
      "Exit", "Thailand", "Mexico", "New Zealand", "Space", "James Cameron", "Final Level", "Exception"
    ]

Config.flow =
  restartDelay: 1600

Config.viewport =
  width: 640
  height: 480
  center: null # calculated
Config.viewport.center = {x: Config.viewport.width / 2, y: Config.viewport.height / 2}
