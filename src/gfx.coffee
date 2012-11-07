class Screen
  constructor:(@w, @h, @ctx)->
    @scale = 10
    #getPixels
    @pixels = @ctx.getImageData(0,0,@ctx.canvas.width/@scale, @ctx.canvas.height/@scale)
    
    #Debug-Shit
    for y in [0..@pixels.height] 
       for x in [0..@pixels.width]
         index = (x + y * @pixels.width) * 4;
         @pixels.data[index+0] = Math.random()*256
         @pixels.data[index+1] = Math.random()*256
         @pixels.data[index+2] = Math.random()*256
         @pixels.data[index+3] = 256
         
  #Would be the method for entities
  render:(x, y, tile)->
    #@ctx.drawImage(@image, 0, 0)
    
  clear:->
    #Clear to white
    for y in [0..@pixels.height] 
       for x in [0..@pixels.width]
         index = (x + y * @pixels.width) * 4;
         @pixels.data[index+0] = 256
         @pixels.data[index+1] = 256
         @pixels.data[index+2] = 256
         @pixels.data[index+3] = 256 
         
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
    
    