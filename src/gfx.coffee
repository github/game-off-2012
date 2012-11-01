class Screen
  constructor:->
    @canvas = document.getElementById("board");
    @ctx = @canvas.getContext('2d');
    console.log(@ctx)
  
  render:(x, y, tile)->
    @ctx.fillStyle = '#FF00FF'
    @ctx.fillRect(x, y, 16, 16)
