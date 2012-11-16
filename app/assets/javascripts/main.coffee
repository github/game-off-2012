window.onload = ->

  Crafty.init(Config.viewport.width, Config.viewport.height)

  Crafty.storage.open('ReleaseCycles')

  Settings.load()


  Crafty.scene('menu')