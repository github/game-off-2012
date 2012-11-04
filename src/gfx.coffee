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
    @xOffset = 0
    @player = @game.player
    @modelList = @game.modelList
    
  tick:->
    