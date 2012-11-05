class Screen
  constructor:(@w, @h)->
    #@canvas = document.getElementById("board");
    #@canvas.style.width = @w
    #@canvas.style.height = @h
    #@ctx = @canvas.getContext('2d');
    #console.log(@ctx)
  
  render:(x, y, tile)->
    @ctx.fillStyle = '#FF00FF'
    @ctx.fillRect(x, y, 16, 16)
    
  getContext:->
    @ctx
    
  getCanvas:->
    @canvas
    
  clear:->
    @ctx.fillStyle =  "#FF00FF"
    @ctx.fillRect(0,0,@w, @h)
    
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
      e = @modelList.get(i)
      e.setPosition(e.getX()+xOff, e.getY())
    
  tick:=>
    xOff =0
    
    if (@player.getX()*@scale) > 240
      xOff = -(@speed/@scale)
      @xOffset -= (@speed/@scale)
      @player.setPosition(240/@scale, @player.getY())
      
    if (@player.getX()*@scale) < 40
      xOff = (@speed/@scale)
      @xOffset += (@speed/@scale)
      @player.setPosition(40/@scale, @player.getY())
    
    @processEntities xOff
    
    