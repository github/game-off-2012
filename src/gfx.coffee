class Screen
  constructor:(@w, @h, @ctx)->
    @scale = 2
    #getPixels
         
  #Would be the method for entities
  render:(x, y, tile, rotate) ->
    @ctx.fillStyle ='#FF00FF'
    @ctx.fillRect(x, y, 16, 16)
    
  clear:->
    #Clear to white
    @ctx.fillStyle ='#FFFFFF'
    @ctx.fillRect(0, 0, @ctx.canvas.width, @ctx.canvas.height)
    
    
class LevelLoader
  constructor:(@path)->
    @data
    $.getJSON('js/sheet.json', @load)
  
  load:(data)->
    @data = data
    console.log(@data)
         
class Camera
  constructor:(@game)->
    @speed = 5
    @xOffset = 0
    @player = @game.player
    @modelList = @game.modelList
    @scale = @game.scale
    
  getXoffset: ->
    @xOffset
    
  setXoffset:(xOffset) ->
    @processEntities xOffset
    @xOffset = xOffset
    
  processEntities:(xOff) ->
    for i in [0..@modelList.size()-1]
      #e = @modelList.get(i)
      e.setPosition(e.getX()+xOff, e.getY())
    
  tick:=>
    xOff =0
    
    #if (@player.getX()*@scale) > 240
    #  xOff = -(@speed/@scale)
    #  @xOffset -= (@speed/@scale)
    #  @player.setPosition(240/@scale, @player.getY())
      
   # if (@player.getX()*@scale) < 40
   #   xOff = (@speed/@scale)
   #   @xOffset += (@speed/@scale)
   #   @player.setPosition(40/@scale, @player.getY())
    
   # @processEntities xOff
    
    