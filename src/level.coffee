class Level
  constructor:(@id, world, @screen,json, sheet)->
    console.log("INIT Level")
    
    @entities = new List()
    
    @canvas = document.getElementById(@id)
    @ctx = @canvas.getContext("2d")
    @ctx.canvas.width = WIDTH
    @ctx.canvas.height = HEIGHT
    
    @ctx.webkitImageSmoothingEnabled = false
    @ctx.mozImageSmoothingEnabled= false
    
    @level = new LevelGenerator(json, sheet, world)
    
    for i in [0..4]
      @entities.add({e:new TestEntity(0, 0), m:new PlayerModel(world, (Math.random()*200)+50, 30)})

  tick:->
    for i in [0..@entities.size()-1]
      e = @entities.get(i).e
      m = @entities.get(i).m
      m.tick()
      e.setX(m.getScreenX())
      e.setY(m.getScreenY())
  
  draw:(xOffset, yOffset)->
    @ctx.clearRect(0, 0, WIDTH, HEIGHT)
    @ctx.drawImage(@level.background,xOffset, yOffset, 128, 128, 0, 0, 640, 480)
    
    for i in [0..@entities.size()-1]
      @entities.get(i).e.render(@screen)
