class Text
  
  chooseColor = "#FF00FF"
  color = "#FFF"
  
  constructor:(@value, @x, @y, @actual)->
    
  draw:(ctx)->
    ctx.fillStyle = if @actual then chooseColor else color
    ctx.fillText(@value, @x, @y)

class Map
  constructor:(@id,@game,@inputHandler)->
    console.log("INIT Map")
    
    @actualText = 0
    @do = 0
    
    @texts =[
      new Text("Level 1", 16*4, (16*4)-4, true),
      new Text("Level 2", 6*8*4, (8*13*4)+4, false),
      new Text("Level 3", 11*8*4, (8*2*4)-4, false),
      new Text("Final", 15*8*4, (12*8*4)-4, false)
    ]
    
    @canvas = document.getElementById(@id)
    @canvas.width = WIDTH
    @canvas.height = HEIGHT
    @ctx = @canvas.getContext("2d")
    
    @ctx.webkitImageSmoothingEnabled = false
    @ctx.mozImageSmoothingEnabled= false
    
    @ctx.font="normal 36px Arial"
    @ctx.fillStyle="#FFF"
    
    @mapgen = new MapGenerator(STORAGE.getRessource("map"), STORAGE.getRessource("spritesheet"))
    
  tick:->
    if @inputHandler.RIGHT.isPressed()
      if @actualText < 3
        @do = 1
    else
      if @do is 1
        @texts[@actualText].actual = false
        @actualText += @do
        @texts[@actualText].actual = true
        @do = 0
      
    if @inputHandler.LEFT.isPressed()
      if @actualText > 0
        @do = -1
    else
      if @do is -1
        @texts[@actualText].actual = false
        @actualText += @do
        @texts[@actualText].actual = true
        @do = 0
        
    if @inputHandler.ENTER.isPressed()
      @game.loadLevel(@actualText)
  
  draw:->
    @ctx.drawImage(@mapgen.background, 0, 0, 640, 480)
    for text in @texts
      text.draw(@ctx)