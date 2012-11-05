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
    @player = @game.player
    @modelList = @game.modelList
    @scale = @game.scale
    
  tick:=>
    xOffset =0
    
    if (@player.getX()*@scale) > 240
      xOffset = -(5/@scale)
      @player.setPosition(240/@scale, @player.getY())
      
    if (@player.getX()*@scale) < 40
      xOffset = +(5/@scale)
      @player.setPosition(40/@scale, @player.getY())
    
    for i in [0..@modelList.size()-1]
      e = @modelList.get(i)
      e.setPosition(e.getX()+xOffset, e.getY())