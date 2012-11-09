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

#RessourceLoader for syncing the loaded ressources and start rendering
class RessourceLoader
  constructor:(@game)->
    
class LevelLoader
  constructor:(@bundle, @world, @game)->
    @data
    @background = document.createElement("canvas")
    @ctx = @background.getContext("2d")
    #AsyncLoading at the moment, maybe sync would be better...
    $.getJSON(@bundle.sheet, @load)
  
  #load-method -> async
  load:(data)=>
    @data = data
    
    #Get graphical-context
    
    
    for i in [0..@data.layers.length-1]
      name = @data.layers[i].name
      if name == 'scene'
        @createScene(@data, @data.layers[i])
        
      if name == 'static'
        @createModel(@world, @data.layers[i], b2Body.b2_staticBody)
    
    @game.run()
   
   #Method creates Scene out of SceneLayer
      #LoadS the spites
   createScene:(data, layer)=>
    sprites = new SpriteSheet(@bundle.img, 8)
    #RawTileData
    tiles = layer.data
     
    tileheight = data.tileheight
    tilewidth =  data.tilewidth
     
    @background.width = data.width*tilewidth
    @background.height = data.height*tileheight
     
    #iterate through data(tiles)
    for y in [0..data.height-1]
      for x in [0..data.width-1]
        sprites.drawTile(@ctx, x, y, tiles[x+y*data.width]-1)

   createModel:(world, layer, type)=>
    objects = layer.objects
    
    #The ratio is how much tiles are in one frame
    ratio = (8*16)
    
    scalew = 640/ratio
    scaleh = 480/ratio
    
    for i in [0..objects.length-1]
      obj = objects[i]
      console.log(obj)
      b2PolygonShape shape = new b2PolygonShape
      shape.SetAsArray(obj.polygon)
      #Could be red out of map-->addlater
      fixDef = new b2FixtureDef
      fixDef.density = 1
      fixDef.friction = 1
      fixDef.restitution = 0.2
      fixDef.shape = shape
      
      bodyDef = new b2BodyDef
      bodyDef.type = type
      bodyDef.position.x = obj.x/30*scalew
      bodyDef.position.y = obj.y/30*scaleh
      
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

#SpriteSheet-Class for loading and accessing sprites by a atlas-index
class SpriteSheet
  constructor:(@path, @tilesize)->
    @image = new Image()
    @image.src = @path
  
  drawTile:(ctx,x, y,index)->
    for iy in [0..7]
      for ix in [0..7]
        if (ix+iy*@tilesize) is index
          ctx.drawImage(@image, (ix*@tilesize), (iy*@tilesize), @tilesize, @tilesize, x*@tilesize, y*@tilesize, @tilesize, @tilesize)
    
    