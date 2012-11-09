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
  constructor:(@bundle, @world)->
    @data
    @background = document.createElement("canvas")
    #AsyncLoading at the moment, maybe sync would be better...
    $.getJSON(@bundle.sheet, @load)
  
  #load-method -> async
  load:(data)=>
    @data = data
    
    sprites = new SpriteSheet(@bundle.img)
    #Get graphical-context
    ctx = @background.getContext("2d")
    
    d = @data.layers[0].data
    tileheight =@data.tileheight
    tilewidth = @data.tilewidth
    
    @background.width = @data.width*tilewidth
    @background.height = @data.height*tileheight
    
    #iterate through data(tiles)
    for y in [0..@data.height-1]
      for x in [0..@data.width-1]
        sprites.drawTile(ctx, x, y, d[x+y*@data.width]-1)
    
    #getGroundLayer TODO F**cking Refactor !!!
    groundLayer = @data.layers[1].objects[0].polygon
    
    b2PolygonShape shape = new b2PolygonShape
    shape.SetAsArray(groundLayer) 
    
    fixDef = new b2FixtureDef;
    fixDef.density = 1;
    fixDef.friction = 1;
    fixDef.restitution = 0.2;
    fixDef.shape = shape
    
    bodyDef = new b2BodyDef
    bodyDef.type = b2Body.b2_staticBody
    bodyDef.position.x = @data.layers[1].objects[0].x/30*5
    bodyDef.position.y = @data.layers[1].objects[0].y/30*3.75
    
    #Create Ground
    @world.CreateBody(bodyDef).CreateFixture(fixDef)
    
         
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
    
class SpriteSheet
  constructor:(@path, @tilesize)->
    @image = new Image()
    @image.src = @path
  
  drawTile:(ctx,x, y,index)->
    for iy in [0..7]
      for ix in [0..7]
        if (ix+iy*8) is index
          ctx.drawImage(@image, (ix*8), (iy*8), 8, 8, x*8, y*8, 8, 8)
              
    #if (@player.getX()*@scale) > 240
    #  xOff = -(@speed/@scale)
    #  @xOffset -= (@speed/@scale)
    #  @player.setPosition(240/@scale, @player.getY())
      
   # if (@player.getX()*@scale) < 40
   #   xOff = (@speed/@scale)
   #   @xOffset += (@speed/@scale)
   #   @player.setPosition(40/@scale, @player.getY())
    
   # @processEntities xOff
    
    